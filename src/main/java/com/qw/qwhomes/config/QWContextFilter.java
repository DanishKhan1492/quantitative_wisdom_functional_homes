package com.qw.qwhomes.config;

import com.qw.qwhomes.domains.auth.util.JwtTokenUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class QWContextFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Claims claims = jwtTokenUtil.extractAllClaims(token);
                if (claims != null) {
                    QWContext context = new QWContext();
                    context.setUserId(claims.get("id", Long.class)).
                            setEmail(claims.get("email", String.class)).
                            setFirstName(claims.get("firstName", String.class))
                            .setLastName(claims.get("lastName", String.class));
                    QWContext.set(context);
                }
            }
            filterChain.doFilter(request, response);
        } finally {
            QWContext.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/v3/api-docs") ||
               path.startsWith("/swagger-ui") ||
               path.equals("/swagger-ui.html") ||
               path.equals("/favicon.ico") ||
               path.contains("/auth") ||
               path.contains("/users");
    }
}
