package com.qw.qwhomes.domains.user.service.impl;

import com.qw.qwhomes.domains.user.data.entity.User;
import com.qw.qwhomes.domains.user.data.repository.UserRepository;
import com.qw.qwhomes.domains.user.dto.CustomUserDetails;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MessageSource messageSource;

    public CustomUserDetailsService(UserRepository userRepository, MessageSource messageSource) {
        this.userRepository = userRepository;
        this.messageSource = messageSource;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                    messageSource.getMessage("user.not.found", new Object[]{username}, LocaleContextHolder.getLocale())
                ));
        var customUserDetails = new CustomUserDetails(
                user.getUsername(),
                user.getPasswordHash(),
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName().toUpperCase()))
                        .collect(Collectors.toList())
        );

        customUserDetails.setEmail(user.getEmail());
        customUserDetails.setUserId(user.getId());
        customUserDetails.setFirstName(user.getFirstName());
        customUserDetails.setLastName(user.getLastName());

        return customUserDetails;
    }
}
