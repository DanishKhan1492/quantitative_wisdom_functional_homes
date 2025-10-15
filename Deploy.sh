#!/usr/bin/env bash
# ===============================================================
# Project: Quantitative Wisdom Functional Homes (QW Homes)
# Stack: React (Frontend) + Spring Boot (Gradle) + PostgreSQL + Nginx
# Java Version: 21
# Node Version: 22 LTS
# ===============================================================
set -euo pipefail
IFS=$'\n\t'

########################################
# Input
########################################
read -r -p "Enter your Public IP or domain: " PUBLIC_IP
if [[ -z "$PUBLIC_IP" ]]; then
  echo "❌ Public IP is required. Exiting."
  exit 1
fi

########################################
# Configuration
########################################
SERVICE_USER="$(id -un)"
PROJECT_NAME="qw-homes"
FRONTEND_DIR="frontend"
DIST_DIR="$FRONTEND_DIR/dist"
DEPLOY_DIR="/var/www/html/$PROJECT_NAME"
SERVICE_NAME="$PROJECT_NAME"
NGINX_DEFAULT_SITE="/etc/nginx/sites-available/default"
DB_NAME="qw-homes"
DB_USER="postgres"
DB_PASS="1234"
DB_PORT="5432"
SERVER_PORT="8080"
GRADLEW="./gradlew"
LOG_DIR="/var/log/$PROJECT_NAME"
SYSTEMD_SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME.service"
UPLOAD_PATH="/home/testing/"
EXPORT_PATH="/home/testing/"

########################################
# Helpers
########################################
log()  { printf '\n\e[1;34m[INFO]\e[0m %s\n' "$*"; }
ok()   { printf '\e[1;32m[ OK ]\e[0m %s\n' "$*"; }
warn() { printf '\e[1;33m[WARN]\e[0m %s\n' "$*"; }
err()  { printf '\e[1;31m[ERR]\e[0m %s\n' "$*"; exit 1; }

trap "echo 'Script interrupted'; exit 1" INT TERM

########################################
# Pre-flight checks
########################################
if [[ "$EUID" -ne 0 ]]; then
  SUDO='sudo'
else
  SUDO=''
fi

if [[ ! -f "build.gradle" && ! -d "frontend" ]]; then
  err "Run this script from the project root (where 'build.gradle' and 'frontend/' are located)."
fi

log "Deploying QW Homes as user '$SERVICE_USER'"
log "Binding Nginx to: $PUBLIC_IP"

########################################
# Step 1: Update & install base packages
########################################
log "Updating apt and installing base packages..."
$SUDO apt-get update -y
$SUDO apt-get upgrade -y
$SUDO apt-get install -y curl gnupg ca-certificates lsb-release unzip git ufw apt-transport-https software-properties-common
ok "Base packages installed"

########################################
# Step 2: Install Java 21
########################################
log "Installing OpenJDK 21 (if missing)..."
if ! java -version 2>/dev/null | grep -q "21"; then
  $SUDO apt-get install -y openjdk-21-jdk
fi
java -version | head -n 1 || true
ok "Java ready"

########################################
# Step 3: Install Node.js 22 LTS
########################################
log "Installing Node.js 22 (LTS) if needed..."
if ! command -v node >/dev/null 2>&1 || ! node -v | grep -q '^v22'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
fi
node -v && npm -v || true
ok "Node.js installed"

########################################
# Step 4: Install PostgreSQL
########################################
log "Installing PostgreSQL (if missing)..."
if ! command -v psql >/dev/null 2>&1; then
  $SUDO apt-get install -y postgresql postgresql-contrib
fi
$SUDO systemctl enable postgresql
$SUDO systemctl start postgresql

# Create DB if missing
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | awk '{$1=$1};1' | grep -qw "$DB_NAME"; then
  log "Creating database $DB_NAME"
  sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\";" || err "Failed to create DB"
else
  log "Database $DB_NAME already exists"
fi

# Set password for postgres user
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" \
  && ok "Set password for DB user ${DB_USER}" || warn "Could not set DB password (check postgres)"

ok "PostgreSQL configured with DB=${DB_NAME} and user=${DB_USER}"

########################################
# Step 5: Install Nginx
########################################
log "Installing Nginx (if missing)..."
if ! command -v nginx >/dev/null 2>&1; then
  $SUDO apt-get install -y nginx
  $SUDO systemctl enable nginx
  $SUDO systemctl start nginx
fi
ok "Nginx ready"

########################################
# Step 6: Build Backend
########################################
log "Building backend (Gradle)..."
if [[ -x "$GRADLEW" ]]; then
  "$GRADLEW" clean bootJar -x test
elif command -v gradle >/dev/null 2>&1; then
  gradle clean bootJar -x test
else
  err "Gradle wrapper not found and 'gradle' missing. Please add ./gradlew."
fi

JAR_PATH=$(find build/libs -maxdepth 1 -type f -name "*-boot.jar" -o -name "*.jar" | grep -v 'sources\|javadoc' | head -n1 || true)
[[ -f "$JAR_PATH" ]] || err "Could not find built JAR in build/libs/"
ok "Backend JAR found: $JAR_PATH"

########################################
# Step 7: Build Frontend
########################################
log "Building frontend (if present)..."
if [[ -d "$FRONTEND_DIR" && -f "$FRONTEND_DIR/package.json" ]]; then
  pushd "$FRONTEND_DIR" >/dev/null
  npm ci --no-audit --no-fund || npm install --no-audit --no-fund --legacy-peer-deps
  npm run build
  popd >/dev/null
else
  warn "No frontend found or package.json missing — skipping build."
fi
ok "Frontend build step finished"

########################################
# Step 8: Deploy frontend to DEPLOY_DIR
########################################
log "Preparing DEPLOY_DIR: $DEPLOY_DIR"

# Remove only the default Nginx index pages if present (do not delete unrelated content)
if [[ -f "/var/www/html/index.nginx-debian.html" ]]; then
  $SUDO rm -f /var/www/html/index.nginx-debian.html && log "Removed default index.nginx-debian.html"
fi
if [[ -f "/var/www/html/index.html" ]]; then
  $SUDO rm -f /var/www/html/index.html && log "Removed default index.html"
fi

$SUDO mkdir -p "$DEPLOY_DIR"
if [[ -d "$DIST_DIR" && $(ls -A "$DIST_DIR") ]]; then
  $SUDO rsync -a --delete "$DIST_DIR"/ "$DEPLOY_DIR"/
  $SUDO chown -R "$SERVICE_USER":"$SERVICE_USER" "$DEPLOY_DIR"
  ok "Frontend deployed to $DEPLOY_DIR"
else
  warn "Frontend dist missing or empty; continuing (DEPLOY_DIR prepared)."
fi

########################################
# Step 9: Configure default Nginx site to serve DEPLOY_DIR and proxy /api/
########################################
log "Configuring Nginx default site to serve $DEPLOY_DIR and proxy /api/"

$SUDO tee "$NGINX_DEFAULT_SITE" > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name ${PUBLIC_IP};

    root ${DEPLOY_DIR};
    index index.html index.htm;

    # Proxy API, docs, swagger to backend
    location ~ ^/(api|v3/api-docs|swagger-ui|swagger-ui.html)(/|$) {
        proxy_pass http://127.0.0.1:${SERVER_PORT};
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # CORS headers for preflight and calls
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";

        if (\$request_method = OPTIONS) {
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }

    # Serve static frontend
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # health check proxy (optional)
    location = /health {
        proxy_pass http://127.0.0.1:${SERVER_PORT}/actuator/health;
    }
}
EOF

# Test & reload nginx
if $SUDO nginx -t; then
  $SUDO systemctl reload nginx
  ok "Nginx configured and reloaded"
else
  $SUDO nginx -t || true
  err "Nginx configuration test failed; fix config and re-run."
fi

########################################
# Step 10: Setup systemd service for Spring Boot
########################################
log "Creating log/upload/export directories and systemd service..."

$SUDO mkdir -p "$LOG_DIR" "$UPLOAD_PATH" "$EXPORT_PATH"
$SUDO chown -R "$SERVICE_USER":"$SERVICE_USER" "$LOG_DIR" "$UPLOAD_PATH" "$EXPORT_PATH"

ABS_JAR_PATH="$(pwd)/${JAR_PATH}"

# ensure service user exists (system user allowed)
if id -u "$SERVICE_USER" >/dev/null 2>&1; then
  log "Service user $SERVICE_USER exists"
else
  log "Creating service user $SERVICE_USER (system account)"
  $SUDO useradd --system --no-create-home --shell /usr/sbin/nologin "$SERVICE_USER"
fi

$SUDO tee "$SYSTEMD_SERVICE_PATH" > /dev/null <<EOF
[Unit]
Description=Spring Boot Application - ${PROJECT_NAME}
After=network.target postgresql.service

[Service]
User=${SERVICE_USER}
WorkingDirectory=$(pwd)
Environment=APP_NAME=${PROJECT_NAME}
Environment=DB_URL=jdbc:postgresql://localhost:${DB_PORT}/${DB_NAME}
Environment=DB_USER=${DB_USER}
Environment=DB_PASS=${DB_PASS}
Environment=SERVER_PORT=${SERVER_PORT}
Environment=UPLOAD_PATH=${UPLOAD_PATH}
Environment=EXPORT_PATH=${EXPORT_PATH}
Environment=MAX_FILE_SIZE=20MB
Environment=MAX_REQUEST_SIZE=20MB
ExecStart=/usr/bin/java -Xms256m -Xmx1g -jar ${ABS_JAR_PATH}
SuccessExitStatus=143
Restart=always
RestartSec=10
TimeoutStartSec=300
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=${PROJECT_NAME}

[Install]
WantedBy=multi-user.target
EOF

$SUDO systemctl daemon-reload
$SUDO systemctl enable "$SERVICE_NAME"
$SUDO systemctl restart "$SERVICE_NAME" || {
  echo "---- service logs (last 200 lines) ----"
  $SUDO journalctl -u "$SERVICE_NAME" -n 200 --no-pager || true
  err "Spring Boot service failed to start"
}

# confirm service active
if $SUDO systemctl is-active --quiet "$SERVICE_NAME"; then
  ok "Spring Boot service is active"
else
  err "Spring Boot service is not active. See: sudo journalctl -u ${SERVICE_NAME} -f"
fi

########################################
# Step 11: Configure Firewall
########################################
log "Configuring firewall..."
$SUDO ufw allow OpenSSH
$SUDO ufw allow 80/tcp
$SUDO ufw allow "${SERVER_PORT}/tcp"
if $SUDO ufw status | grep -q inactive; then
  $SUDO ufw --force enable
fi
ok "Firewall configured"

########################################
# Step 12: Verify all services are running
########################################
log "Waiting briefly for services to settle..."
sleep 5

log "Checking service status..."
if ! $SUDO systemctl is-active --quiet "$SERVICE_NAME"; then
  err "Backend service not active. Check logs with: sudo journalctl -u $SERVICE_NAME -n 100 --no-pager"
fi
if ! $SUDO systemctl is-active --quiet postgresql; then
  err "PostgreSQL service not active."
fi
if ! $SUDO systemctl is-active --quiet nginx; then
  err "Nginx service not active."
fi
ok "All services running"

########################################
# Step 13: Wait for backend to be responsive
########################################
log "Waiting for backend to respond on port ${SERVER_PORT} ..."
for i in {1..30}; do
  if curl -s -o /dev/null "http://localhost:${SERVER_PORT}/actuator/health" || curl -s -o /dev/null "http://localhost:${SERVER_PORT}/"; then
    ok "Backend is up (responded on attempt $i)"
    break
  fi
  echo " ⏳ Still waiting ($i)..."
  sleep 3
done

if ! curl -s -o /dev/null "http://localhost:${SERVER_PORT}/actuator/health" && ! curl -s -o /dev/null "http://localhost:${SERVER_PORT}/"; then
  warn "Backend still not responding after waiting. Skipping initial POST."
else
  ########################################
  # Step 14: Initial User Creation POST
  ########################################
  log "All services active — attempting initial user creation POST to backend (localhost)..."

  HTTP_STATUS=$(curl -s -o /tmp/response.txt -w "%{http_code}" \
    --location "http://localhost:${SERVER_PORT}/api/v1/users" \
    --header "Content-Type: application/json" \
    --data-raw '{
      "username": "abuzar",
      "email": "abuzarkhan1242@gmail.com",
      "password": "abuzar12",
      "firstName": "abuzar",
      "lastName": "khan",
      "phoneNumber": "03249090438",
      "roles": [{"id": 1}]
    }')

  echo
  log "Initial POST HTTP status: $HTTP_STATUS"
  echo "Response body:"
  cat /tmp/response.txt
  echo

  if [[ "$HTTP_STATUS" != "200" && "$HTTP_STATUS" != "201" ]]; then
    warn "Initial user creation request returned HTTP $HTTP_STATUS. If 401/403, you may need to register via /api/v1/auth/register or create an admin user manually."
    echo "Check application logs: sudo journalctl -u ${SERVICE_NAME} -n 200 --no-pager"
  else
    ok "✅ User 'abuzar' successfully created!"
  fi
fi

########################################
# Step 15: Import Category Dump into Database
########################################
log "Importing category dump into database ${DB_NAME}..."

CATEGORY_DUMP_PATH="$(pwd)/category_dump.sql"
TEMP_DUMP_PATH="/tmp/category_dump.sql"

if [[ -f "$CATEGORY_DUMP_PATH" ]]; then
  log "Found dump file at: $CATEGORY_DUMP_PATH"

  log "Copying dump file to /tmp for import..."
  $SUDO cp "$CATEGORY_DUMP_PATH" "$TEMP_DUMP_PATH"
  $SUDO chmod 644 "$TEMP_DUMP_PATH"
  $SUDO chown postgres:postgres "$TEMP_DUMP_PATH"

  if $SUDO systemctl is-active --quiet postgresql; then
    log "PostgreSQL service active — importing data..."

    if sudo -u postgres psql -d "$DB_NAME" -f "$TEMP_DUMP_PATH" > /tmp/category_import.log 2>&1; then
      ok "✅ Category dump imported successfully into ${DB_NAME}"
    else
      warn "⚠️ Category import encountered errors. Check log: /tmp/category_import.log"
      tail -n 20 /tmp/category_import.log || true
    fi
  else
    warn "PostgreSQL is not running — skipping category import."
  fi

  $SUDO rm -f "$TEMP_DUMP_PATH"
else
  warn "No category_dump.sql found in project root — skipping Step 15."
fi


########################################
# Summary
########################################
log "✅ Deployment script finished successfully!"
log "Frontend:  http://${PUBLIC_IP}/"
log "Backend:   http://${PUBLIC_IP}:${SERVER_PORT}/api/"
log "To view logs: sudo journalctl -u ${SERVICE_NAME} -f"
ok "All done."
