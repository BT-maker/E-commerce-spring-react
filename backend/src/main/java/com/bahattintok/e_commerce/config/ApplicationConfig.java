package com.bahattintok.e_commerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bahattintok.e_commerce.security.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

/**
 * Uygulamanın authentication ve user details ile ilgili Spring bean konfigürasyonlarını içerir.
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    
    private final CustomUserDetailsService customUserDetailsService;
    
    /**
     * Kullanıcı detaylarını yüklemek için özel servis.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return customUserDetailsService;
    }
    
    /**
     * Authentication işlemlerinde kullanılacak provider.
     * UserDetailsService ve PasswordEncoder ile çalışır.
     */
    @SuppressWarnings("deprecation")
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    /**
     * Authentication işlemlerini yöneten ana bean.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    /**
     * Şifreleri hash'lemek için BCrypt algoritması kullanılır.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
} 