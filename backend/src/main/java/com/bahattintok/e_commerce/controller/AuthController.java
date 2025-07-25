package com.bahattintok.e_commerce.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.dto.AuthResponse;
import com.bahattintok.e_commerce.dto.SignInRequest;
import com.bahattintok.e_commerce.dto.SignUpRequest;
import com.bahattintok.e_commerce.dto.UpdateProfileRequest;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Kullanıcı kimlik doğrulama ve profil işlemlerini yöneten controller.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Kullanıcı kaydı (signup)
     */
    @PostMapping("/signup")
    @Operation(summary = "User registration", description = "Register a new user")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signUp(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Kullanıcı girişi (signin) ve JWT token'ı cookie'ye ekler.
     */
    @PostMapping("/signin")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signIn(request);

        Cookie cookie = new Cookie("token", authResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // localde test için gerekirse false yapabilirsin
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 gün
        response.addCookie(cookie);

        // authResponse.setToken(null); // Token'ı body'den kaldır (Swagger için yoruma alındı)
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Kullanıcı çıkışı (logout) - JWT cookie'sini siler.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // prod'da true olmalı
        cookie.setPath("/");
        cookie.setMaxAge(0); // hemen silinsin
        response.addCookie(cookie);
        return ResponseEntity.ok().body("Çıkış başarılı");
    }

    /**
     * Giriş yapan kullanıcının bilgilerini döner.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "username", user.getUsername(),
            "role", user.getRole().getName()
        ));

    }

    /**
     * Kullanıcı profilini günceller (isim, email, şifre).
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }
            // Kullanıcı adı ve email güncelle
            if (request.getUsername() != null && !request.getUsername().isBlank()) {
                user.setUsername(request.getUsername());
            }
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                user.setEmail(request.getEmail());
            }
            // Şifre güncelleme
            if (request.getCurrentPassword() != null && !request.getCurrentPassword().isBlank()
                    && request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                    return ResponseEntity.badRequest().body("Mevcut şifre yanlış");
                }
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }
            userRepository.save(user);
            return ResponseEntity.ok("Profil başarıyla güncellendi");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Beklenmeyen hata: " + ex.getMessage());
        }
    }
} 