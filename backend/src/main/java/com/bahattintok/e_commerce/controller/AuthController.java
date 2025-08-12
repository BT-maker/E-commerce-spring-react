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
        cookie.setSecure(false); // localde HTTP için false olmalı!
        cookie.setPath("/");
        // Domain ayarlama - localhost ve network erişimi için
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 gün
        response.addCookie(cookie);

        // authResponse.setToken(null); // Token'ı body'den kaldır (Swagger için yoruma alındı)
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Seller girişi (seller signin) - sadece SELLER rolündeki kullanıcılar için
     */
    @PostMapping("/seller/signin")
    @Operation(summary = "Seller login", description = "Authenticate seller and return JWT token")
    public ResponseEntity<AuthResponse> sellerSignIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signIn(request);
        
        // Seller rolü kontrolü
        if (!"SELLER".equals(authResponse.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new AuthResponse(null, null, null));
        }

        Cookie cookie = new Cookie("token", authResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // localde HTTP için false olmalı!
        cookie.setPath("/");
        // Domain ayarlama - localhost ve network erişimi için
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 gün
        response.addCookie(cookie);

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
        // Domain ayarlama - localhost ve network erişimi için
        cookie.setMaxAge(0); // hemen silinsin
        response.addCookie(cookie);
        return ResponseEntity.ok().body("Çıkış başarılı");
    }

    /**
     * Test endpoint - authentication durumunu kontrol eder.
     */
    @GetMapping("/test")
    public ResponseEntity<?> testAuth(Authentication authentication) {
        System.out.println("=== /test endpoint çağrıldı ===");
        System.out.println("Authentication: " + authentication);
        
        if (authentication != null) {
            System.out.println("Authentication name: " + authentication.getName());
            System.out.println("Authentication authorities: " + authentication.getAuthorities());
            System.out.println("Authentication is authenticated: " + authentication.isAuthenticated());
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Test endpoint",
            "authenticated", authentication != null && authentication.isAuthenticated(),
            "username", authentication != null ? authentication.getName() : "null",
            "authorities", authentication != null ? authentication.getAuthorities().toString() : "null"
        ));
    }

    /**
     * Giriş yapan kullanıcının bilgilerini döner.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            System.out.println("=== /me endpoint çağrıldı ===");
            System.out.println("Authentication: " + authentication);
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("Authentication null veya authenticated değil");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }
            
            String email = authentication.getName();
            System.out.println("Email: " + email);
            
            User user = userRepository.findByEmail(email).orElse(null);
            System.out.println("User: " + user);
            
            if (user == null) {
                System.out.println("User bulunamadı");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }
            
            System.out.println("User role: " + user.getRole().getName());
            System.out.println("=== /me endpoint tamamlandı ===");
            
            // Map.of null değerleri kabul etmez; null olabilecek alanlar için HashMap kullan
            java.util.Map<String, Object> body = new java.util.HashMap<>();
            body.put("email", user.getEmail());
            body.put("username", user.getUsername());
            body.put("role", user.getRole().getName());
            body.put("address", user.getAddress());
            body.put("phone", user.getPhone());
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            System.out.println("=== /me endpoint hatası ===");
            System.out.println("Hata: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred", "message", e.getMessage()));
        }
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
            // Adres güncelleme
            if (request.getAddress() != null) {
                user.setAddress(request.getAddress());
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
    
    /**
     * Şifre değiştirme
     */
    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change user password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Kimlik doğrulama gerekli"));
            }

            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mevcut şifre ve yeni şifre gerekli"));
            }

            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Yeni şifre en az 6 karakter olmalıdır"));
            }

            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            // Mevcut şifreyi kontrol et
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mevcut şifre yanlış"));
            }

            // Yeni şifreyi hashle ve kaydet
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Şifre başarıyla değiştirildi"));
        } catch (Exception e) {
            System.err.println("Change password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Şifre değiştirilirken bir hata oluştu"));
        }
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Kaydı: Yeni kullanıcı oluşturma (/signup)
     * 2. Kullanıcı Girişi: JWT token ile authentication (/signin)
     * 3. Kullanıcı Çıkışı: Güvenli logout (/logout)
     * 4. Profil Bilgileri: Giriş yapan kullanıcının bilgilerini alma (/me - GET)
     * 5. Profil Güncelleme: Kullanıcı bilgilerini değiştirme (/me - PUT)
     * 
     * Bu controller sayesinde kullanıcılar güvenli şekilde kayıt olabilir, 
     * giriş yapabilir ve profil bilgilerini yönetebilir!
     */
}