# QW-Homes Deployment Guide

## Prerequisites

The following tools are required for deployment:

- **Node.js** - JavaScript runtime environment
- **JDK 21** - Java Development Kit version 21
- **PostgreSQL Database** - Relational database management system
- **Nginx** - Web server and reverse proxy

> **Note:** You don't need to install or configure these tools manually. Our automated deployment script handles everything for you.

## Pre-Deployment Configuration

Before deploying the application, you need to configure the frontend environment:

1. Navigate to the `frontend` folder
2. Open the `.env` file
3. Update the IP address field with your server's IP address or domain name

```bash
cd frontend
# Edit .env file and update the IP address
```

## Deployment Process

**To deploy the application:**

1. Make the deployment script executable (if not already):
   ```bash
   chmod +x Deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./Deploy.sh
   ```

3. When prompted, enter your public IP address or domain name

### What Happens During Deployment

The `Deploy.sh` script automatically performs the following tasks:

1. ✅ Installs all required dependencies (Node.js, JDK 21, PostgreSQL, Nginx)
2. ✅ Configures the database and application settings
3. ✅ Sets up Nginx as a reverse proxy
4. ✅ Deploys the application to your server
5. ✅ Starts all necessary services

## Post-Deployment

Once the deployment script completes successfully:

- Your application will be live and accessible
- Access the application using the IP address or domain you provided
- All services will be running and configured automatically

## Accessing Your Application

After successful deployment, open your web browser and navigate to:

```
http://your-ip-address-or-domain
```
