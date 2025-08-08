package com.bahattintok.e_commerce.config;

import org.springframework.beans.factory.annotation.Autowired;
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

/**
 * Spring Security için gerekli bean'lerin konfigürasyonu.
 */
@Configuration
public class ApplicationConfig {
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    
    /**
     * Password encoder bean'i
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * UserDetailsService bean'i
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return customUserDetailsService;
    }
    
    /**
     * Authentication provider bean'i
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    /**
     * Authentication manager bean'i
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    /**
     * Bu konfigürasyon şu işlevleri sağlar:
     * 
     * 1. Password Encoding: BCrypt ile şifre hash'leme
     * 2. UserDetailsService: Kullanıcı bilgilerini yükleme servisi
     * 3. Authentication Provider: Kimlik doğrulama sağlayıcısı
     * 4. Authentication Manager: Kimlik doğrulama yöneticisi
     * 
     * Bu konfigürasyon sayesinde Spring Security düzgün şekilde çalışır!
     */
} 