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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.dto.AuthResponse;
import com.bahattintok.e_commerce.dto.SignInRequest;
import com.bahattintok.e_commerce.dto.SignUpRequest;
import com.bahattintok.e_commerce.dto.UpdateProfileRequest;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.AuthService;
import com.bahattintok.e_commerce.service.EmailService;
import com.bahattintok.e_commerce.util.PasswordUtil;

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
    
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    // Şifre sıfırlama token'larını geçici olarak sakla (gerçek uygulamada veritabanında saklanmalı)
    private final Map<String, String> passwordResetTokens = new HashMap<>();

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
                    .httpOnly(false) // JavaScript'ten okunabilir olması için false
                    .secure(false) // Development için false, production'da true olmalı
                    .domain("localhost") // Frontend ile aynı domain
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
                    .httpOnly(false) // JavaScript'ten okunabilir olması için false
                    .secure(false) // Development için false, production'da true olmalı
                    .domain("localhost") // Frontend ile aynı domain
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
                    .httpOnly(false) // JavaScript'ten okunabilir olması için false
                    .secure(false) // Development için false, production'da true olmalı
                    .domain("localhost") // Frontend ile aynı domain
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
                    .httpOnly(false) // JavaScript'ten okunabilir olması için false
                    .secure(false) // Development için false, production'da true olmalı
                    .domain("localhost") // Frontend ile aynı domain
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
            userResponse.put("registrationDate", user.getRegistrationDate());
            userResponse.put("role", user.getRole().getName()); // RoleEntity'den name'i al
            
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.err.println("getCurrentUser hatası: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            String email = authentication.getName();
            User updatedUser = authService.updateProfile(email, request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", updatedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Profile update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        try {
            // JWT token cookie'sini sil
            ResponseCookie cookie = ResponseCookie.from("jwt_token", "")
                    .httpOnly(false) // JavaScript'ten okunabilir olması için false
                    .secure(false)
                    .domain("localhost") // Frontend ile aynı domain
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

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            System.out.println("=== ŞİFRE UNUTTUM DEBUG ===");
            System.out.println("Gelen email: " + email);
            
            if (email == null || email.trim().isEmpty()) {
                System.out.println("Email null veya boş");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "E-posta adresi gerekli");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Kullanıcıyı bul
            User user = userRepository.findByEmail(email).orElse(null);
            System.out.println("Bulunan kullanıcı: " + (user != null ? user.getEmail() : "null"));
            
            if (user == null) {
                // Güvenlik için kullanıcı bulunamasa bile başarılı mesajı döndür
                System.out.println("Kullanıcı bulunamadı, güvenlik mesajı döndürülüyor");
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
                return ResponseEntity.ok(response);
            }

            // Şifre sıfırlama token'ı oluştur
            String resetToken = java.util.UUID.randomUUID().toString();
            System.out.println("Oluşturulan token: " + resetToken);
            
            // Token'ı geçici olarak sakla
            passwordResetTokens.put(resetToken, email);
            System.out.println("Token saklandı. Toplam token sayısı: " + passwordResetTokens.size());
            
            // Şifre sıfırlama e-postası gönder
            try {
                emailService.sendPasswordResetEmail(email, resetToken, user.getFirstName() + " " + user.getLastName());
            } catch (Exception emailError) {
                System.err.println("Şifre sıfırlama e-postası gönderilemedi: " + emailError.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Şifre sıfırlama işlemi başarısız: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            System.out.println("=== ŞİFRE SIFIRLAMA DEBUG ===");
            System.out.println("Gelen token: " + token);
            System.out.println("Mevcut token'lar: " + passwordResetTokens.keySet());
            
            if (token == null || token.trim().isEmpty()) {
                System.out.println("Token null veya boş");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Geçersiz token");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                System.out.println("Yeni şifre null veya boş");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Yeni şifre gerekli");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Token'dan e-posta adresini al
            String email = passwordResetTokens.get(token);
            System.out.println("Token için bulunan email: " + email);
            
            if (email == null) {
                System.out.println("Token bulunamadı!");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Geçersiz veya süresi dolmuş token");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Kullanıcıyı bul
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Kullanıcı bulunamadı");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Şifreyi güncelle - Frontend'den gelen SHA-256 hash'ini BCrypt ile tekrar hash'le
            System.out.println("Frontend'den gelen SHA-256 hash uzunluğu: " + newPassword.length());
            String hashedPassword = passwordEncoder.encode(newPassword); // SHA-256 hash'ini BCrypt ile hash'le
            user.setPassword(hashedPassword);
            userRepository.save(user);

            // Token'ı sil
            passwordResetTokens.remove(token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Şifreniz başarıyla güncellendi");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Şifre güncelleme işlemi başarısız: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Test endpoint'i - sadece geliştirme için
    @GetMapping("/debug/tokens")
    public ResponseEntity<Map<String, Object>> debugTokens() {
        Map<String, Object> response = new HashMap<>();
        response.put("tokenCount", passwordResetTokens.size());
        response.put("tokens", passwordResetTokens);
        return ResponseEntity.ok(response);
    }
    
    // Debug endpoint'i - şifre test için
    @GetMapping("/debug/password-test")
    public ResponseEntity<Map<String, Object>> debugPasswordTest() {
        try {
            User user = userRepository.findByEmail("bahattok5@gmail.com").orElse(null);
            if (user == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Kullanıcı bulunamadı");
                return ResponseEntity.ok(response);
            }
            
            String dbHash = user.getPassword();
            String testHash = "13d5894c7cfe9b3f085f8591faf676c280d147447b641645db9d61d675d4fcd0";
            
            // Test 1: Direkt karşılaştırma
            boolean directMatch = passwordEncoder.matches(testHash, dbHash);
            
            // Test 2: SHA-256 hash'ini BCrypt'e çevirip karşılaştırma
            String bcryptFromSha256 = PasswordUtil.encodeHashedPassword(testHash);
            boolean bcryptMatch = passwordEncoder.matches(testHash, bcryptFromSha256);
            
            Map<String, Object> response = new HashMap<>();
            response.put("userEmail", user.getEmail());
            response.put("dbHash", dbHash);
            response.put("testHash", testHash);
            response.put("directMatch", directMatch);
            response.put("bcryptFromSha256", bcryptFromSha256);
            response.put("bcryptMatch", bcryptMatch);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}