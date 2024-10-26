package com.qw.qwhomes.domains.auth.service;

import com.qw.qwhomes.domains.auth.dto.LoginRequest;
import com.qw.qwhomes.domains.auth.dto.TokenResponse;
import com.qw.qwhomes.domains.auth.util.JwtTokenUtil;
import com.qw.qwhomes.domains.user.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final CacheManager cacheManager;

    public TokenResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String jwt = jwtTokenUtil.generateToken(userDetails);
        return new TokenResponse(jwt, jwtTokenUtil.extractExpiration(jwt).getTime());
    }

    public void logout(String token) {
        Objects.requireNonNull(cacheManager.getCache("logoutTokens")).put(token, true);
        SecurityContextHolder.clearContext();
    }

    public boolean isTokenLoggedOut(String token) {
        return cacheManager.getCache("logoutTokens").get(token) != null;
    }
}
