package com.bahattintok.e_commerce.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.dto.AuthResponse;
import com.bahattintok.e_commerce.dto.SignInRequest;
import com.bahattintok.e_commerce.dto.SignUpRequest;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.AuthService;
import com.bahattintok.e_commerce.service.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.signUp(request);
            
            // Hoş geldin maili gönder
            try {
                String customerName = (request.getFirstName() != null && request.getLastName() != null) 
                    ? request.getFirstName() + " " + request.getLastName()
                    : "Değerli Müşterimiz";
                emailService.sendWelcomeEmail(request.getEmail(), customerName);
            } catch (Exception emailError) {
                System.err.println("Hoş geldin maili gönderilemedi: " + emailError.getMessage());
                // Mail hatası kayıt işlemini durdurmasın
            }
            
            // JWT token'ı cookie olarak set et
            ResponseCookie cookie = ResponseCookie.from("jwt_token", response.getToken())
                    .httpOnly(true)
                    .secure(false) // Development için false, production'da true olmalı
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 saat
                    .sameSite("Lax")
                    .build();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            throw new RuntimeException("Kayıt işlemi başarısız: " + e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody SignInRequest request) {
        try {
            AuthResponse response = authService.signIn(request);
            
            // JWT token'ı cookie olarak set et
            ResponseCookie cookie = ResponseCookie.from("jwt_token", response.getToken())
                    .httpOnly(true)
                    .secure(false) // Development için false, production'da true olmalı
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 saat
                    .sameSite("Lax")
                    .build();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            throw new RuntimeException("Giriş işlemi başarısız: " + e.getMessage());
        }
    }

    @PostMapping("/admin/signin")
    public ResponseEntity<AuthResponse> adminSignIn(@RequestBody SignInRequest request) {
        try {
            AuthResponse response = authService.adminSignIn(request);
            
            // JWT token'ı cookie olarak set et
            ResponseCookie cookie = ResponseCookie.from("jwt_token", response.getToken())
                    .httpOnly(true)
                    .secure(false) // Development için false, production'da true olmalı
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 saat
                    .sameSite("Lax")
                    .build();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            throw new RuntimeException("Admin giriş işlemi başarısız: " + e.getMessage());
        }
    }

    @PostMapping("/seller/signin")
    public ResponseEntity<AuthResponse> sellerSignIn(@RequestBody SignInRequest request) {
        try {
            AuthResponse response = authService.sellerSignIn(request);
            
            // JWT token'ı cookie olarak set et
            ResponseCookie cookie = ResponseCookie.from("jwt_token", response.getToken())
                    .httpOnly(true)
                    .secure(false) // Development için false, production'da true olmalı
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 saat
                    .sameSite("Lax")
                    .build();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            throw new RuntimeException("Seller giriş işlemi başarısız: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }
            
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(404).build();
            }
            
            // Frontend için uygun formatta user bilgilerini döndür
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("firstName", user.getFirstName());
            userResponse.put("lastName", user.getLastName());
            userResponse.put("email", user.getEmail());
            userResponse.put("phone", user.getPhone());
            userResponse.put("address1", user.getAddress1());
            userResponse.put("address2", user.getAddress2());
            userResponse.put("birthDate", user.getBirthDate());
            userResponse.put("role", user.getRole().getName()); // RoleEntity'den name'i al
            
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.err.println("getCurrentUser hatası: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        try {
            // JWT token cookie'sini sil
            ResponseCookie cookie = ResponseCookie.from("jwt_token", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(0) // Cookie'yi hemen sil
                    .sameSite("Lax")
                    .build();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Başarıyla çıkış yapıldı");
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Çıkış işlemi başarısız: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/verify-account")
    public ResponseEntity<Map<String, Object>> verifyAccount(@RequestParam String token) {
        try {
            // Token'ı kullanarak kullanıcıyı bul ve doğrula
            // Bu basit bir implementasyon - gerçek uygulamada token'ı veritabanında saklamanız gerekir
            
            Map<String, Object> response = new HashMap<>();
            
            // Token'ı UUID olarak parse etmeye çalış
            try {
                java.util.UUID.fromString(token);
                
                // Burada token'ı veritabanında arayıp kullanıcıyı doğrulayabilirsiniz
                // Şimdilik başarılı olarak kabul ediyoruz
                
                response.put("success", true);
                response.put("message", "Hesap başarıyla doğrulandı");
                
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                response.put("success", false);
                response.put("message", "Geçersiz doğrulama token'ı");
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Hesap doğrulama işlemi başarısız: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}