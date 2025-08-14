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
                .body(new AuthResponse(null, null, null, null));
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
     * Admin girişi (admin signin) - sadece ADMIN rolündeki kullanıcılar için
     */
    @PostMapping("/admin/signin")
    @Operation(summary = "Admin login", description = "Authenticate admin and return JWT token")
    public ResponseEntity<AuthResponse> adminSignIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signIn(request);
        
        // Admin rolü kontrolü
        if (!"ADMIN".equals(authResponse.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new AuthResponse(null, null, null, null));
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
            body.put("firstName", user.getFirstName());
            body.put("lastName", user.getLastName());
            body.put("role", user.getRole().getName());
            body.put("address1", user.getAddress1());
            body.put("address2", user.getAddress2());
            body.put("phone", user.getPhone());
            body.put("birthDate", user.getBirthDate());
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
            System.out.println("=== /me PUT endpoint çağrıldı ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("Request: " + request);
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("Authentication null veya authenticated değil");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }
            
            String email = authentication.getName();
            System.out.println("Email: " + email);
            
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                System.out.println("User bulunamadı");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }
            
            System.out.println("User bulundu: " + user.getFirstName() + " " + user.getLastName());
            
            // Ad, soyad ve email güncelle
            if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
                System.out.println("FirstName güncelleniyor: " + request.getFirstName());
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null && !request.getLastName().isBlank()) {
                System.out.println("LastName güncelleniyor: " + request.getLastName());
                user.setLastName(request.getLastName());
            }
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                System.out.println("Email güncelleniyor: " + request.getEmail());
                user.setEmail(request.getEmail());
            }
            
            // Telefon güncelleme
            if (request.getPhone() != null) {
                System.out.println("Phone güncelleniyor: " + request.getPhone());
                user.setPhone(request.getPhone());
            }
            
            // Doğum tarihi güncelleme
            if (request.getBirthDate() != null) {
                System.out.println("BirthDate güncelleniyor: " + request.getBirthDate());
                user.setBirthDate(request.getBirthDate());
            }
            
            // Adres güncelleme
            if (request.getAddress1() != null) {
                System.out.println("Address1 güncelleniyor: " + request.getAddress1());
                user.setAddress1(request.getAddress1());
            }
            if (request.getAddress2() != null) {
                System.out.println("Address2 güncelleniyor: " + request.getAddress2());
                user.setAddress2(request.getAddress2());
            }
            
            // Şifre güncelleme
            if (request.getCurrentPassword() != null && !request.getCurrentPassword().isBlank()
                    && request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
                System.out.println("Şifre güncelleniyor");
                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                    System.out.println("Mevcut şifre yanlış");
                    return ResponseEntity.badRequest().body("Mevcut şifre yanlış");
                }
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }
            
            System.out.println("User kaydediliyor...");
            userRepository.save(user);
            System.out.println("User başarıyla kaydedildi");
            System.out.println("=== /me PUT endpoint tamamlandı ===");
            
            // Güncellenmiş kullanıcı bilgilerini döndür
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Profil başarıyla güncellendi");
            response.put("user", Map.of(
                "id", user.getId(),
                "firstName", user.getFirstName() != null ? user.getFirstName() : "Belirtilmemiş",
                "lastName", user.getLastName() != null ? user.getLastName() : "Belirtilmemiş",
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "Belirtilmemiş",
                "birthDate", user.getBirthDate() != null ? user.getBirthDate() : "Belirtilmemiş",
                "address1", user.getAddress1() != null ? user.getAddress1() : "Belirtilmemiş",
                "address2", user.getAddress2() != null ? user.getAddress2() : "Belirtilmemiş",
                "role", user.getRole().getName()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            System.out.println("=== /me PUT endpoint hatası ===");
            System.out.println("Hata: " + ex.getMessage());
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