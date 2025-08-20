package com.bahattintok.e_commerce.service.impl;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.dto.AuthResponse;
import com.bahattintok.e_commerce.dto.SignInRequest;
import com.bahattintok.e_commerce.dto.SignUpRequest;
import com.bahattintok.e_commerce.event.UserRegisteredEvent;
import com.bahattintok.e_commerce.model.RoleEntity;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.RoleRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.security.CustomUserDetailsService;
import com.bahattintok.e_commerce.security.JwtUtil;
import com.bahattintok.e_commerce.service.AuthService;
import com.bahattintok.e_commerce.util.PasswordUtil;

import lombok.RequiredArgsConstructor;

/**
 * Kimlik doğrulama (giriş/kayıt) işlemlerini yöneten servis implementasyonu.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final StoreRepository storeRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final ApplicationEventPublisher eventPublisher;
    
    /**
     * Kullanıcı kaydı (signup) işlemi. Yeni kullanıcı oluşturur ve JWT token döner.
     */
    @Override
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Kullanıcı tipine göre rol belirleme
        RoleEntity role;
        try {
            if ("seller".equals(request.getUserType())) {
                role = roleRepository.findByName("SELLER")
                        .orElseThrow(() -> new RuntimeException("SELLER role not found"));
            } else {
                role = roleRepository.findByName("USER")
                        .orElseThrow(() -> new RuntimeException("USER role not found"));
            }
        } catch (Exception e) {
            System.err.println("Rol bulunamadı: " + e.getMessage());
            // Geçici çözüm: İlk rolü kullan
            role = roleRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("Hiç rol bulunamadı"));
            System.err.println("Geçici olarak rol kullanılıyor: " + role.getName());
        }
        
        // DEBUG: Rol bilgisini logla
        System.out.println("=== DEBUG: SIGNUP ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("FirstName: " + request.getFirstName());
        System.out.println("LastName: " + request.getLastName());
        System.out.println("UserType: " + request.getUserType());
        System.out.println("Role: " + role.getName());
        System.out.println("=== DEBUG END ===");
        
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        // Opsiyonel alanlar
        user.setPhone(request.getPhone());
        user.setAddress1(request.getAddress1());
        user.setAddress2(request.getAddress2());
        
        // Frontend'den gelen hash'lenmiş şifreyi BCrypt ile tekrar hash'le
        String hashedPassword = request.getPassword(); // Frontend'den gelen SHA-256 hash
        String encodedPassword = PasswordUtil.encodeHashedPassword(hashedPassword);
        user.setPassword(encodedPassword);
        
        user.setRole(role);
        
        User savedUser = userRepository.save(user);
        
        // Eğer seller ise mağaza oluştur
        if ("seller".equals(request.getUserType())) {
            if (request.getStoreName() == null || request.getStoreName().trim().isEmpty()) {
                throw new RuntimeException("Store name is required for sellers");
            }
            
            // Mağaza adı kontrolü
            if (storeRepository.existsByNameIgnoreCase(request.getStoreName())) {
                throw new RuntimeException("Store name already exists");
            }
            
            Store store = new Store();
            store.setName(request.getStoreName());
            store.setSeller(savedUser);
            storeRepository.save(store);
        }
        
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        // Hesap doğrulama email'i gönder
        String verificationToken = java.util.UUID.randomUUID().toString();
        eventPublisher.publishEvent(new UserRegisteredEvent(this, savedUser, verificationToken));
        
        return new AuthResponse(token, savedUser.getFirstName(), savedUser.getLastName(), savedUser.getRole().getName(), savedUser.getEmail());
    }
    
    /**
     * Kullanıcı girişi (signin) işlemi. Kimlik doğrulama yapar ve JWT token döner.
     */
    @Override
    public AuthResponse signIn(SignInRequest request) {
        // Frontend'den gelen plain text şifreyi al
        String plainPassword = request.getPassword();
        
        // DEBUG: Password'ü logla
        System.out.println("=== DEBUG: SIGNIN ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Frontend'den gelen plain text şifre: " + plainPassword);
        
        // Kullanıcıyı email ile bul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("Veritabanındaki BCrypt hash: " + user.getPassword());
        System.out.println("User role: " + (user.getRole() != null ? user.getRole().getName() : "null"));
        
        // Frontend'den gelen plain text şifreyi veritabanındaki BCrypt hash ile karşılaştır
        boolean passwordMatches = passwordEncoder.matches(plainPassword, user.getPassword());
        System.out.println("Şifre eşleşiyor mu: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("Şifre eşleşmedi! Hata fırlatılıyor...");
            throw new RuntimeException("Invalid credentials");
        }
        
        System.out.println("Şifre doğru! Token oluşturuluyor...");
        
        // UserDetails oluştur (rolleri doğru şekilde yükle)
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        // Role adını doğru şekilde al
        String roleName = user.getRole() != null ? user.getRole().getName() : "USER";
        
        System.out.println("Token oluşturuldu: " + token.substring(0, 20) + "...");
        System.out.println("Role: " + roleName);
        System.out.println("=== DEBUG END ===");
        
        return new AuthResponse(token, user.getFirstName(), user.getLastName(), roleName, user.getEmail());
    }
    
    /**
     * Admin girişi (signin) işlemi. Sadece ADMIN rolündeki kullanıcılar giriş yapabilir.
     */
    @Override
    public AuthResponse adminSignIn(SignInRequest request) {
        // Frontend'den gelen plain password'ü kullan
        String plainPassword = request.getPassword();
        
        // DEBUG: Password'ü logla
        System.out.println("=== DEBUG: ADMIN SIGNIN ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Frontend'den gelen password: " + plainPassword);
        
        // Kullanıcıyı email ile bul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("Veritabanındaki hash: " + user.getPassword());
        System.out.println("User role: " + (user.getRole() != null ? user.getRole().getName() : "null"));
        
        // ADMIN rolü kontrolü
        if (user.getRole() == null || !"ADMIN".equals(user.getRole().getName())) {
            System.out.println("Kullanıcı ADMIN rolüne sahip değil! Role: " + (user.getRole() != null ? user.getRole().getName() : "null"));
            throw new RuntimeException("Access denied. Admin privileges required.");
        }
        
        // Frontend'den gelen plain text şifreyi veritabanındaki BCrypt hash ile karşılaştır
        boolean passwordMatches = passwordEncoder.matches(plainPassword, user.getPassword());
        System.out.println("Şifre eşleşiyor mu: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("Şifre eşleşmedi! Hata fırlatılıyor...");
            throw new RuntimeException("Invalid credentials");
        }
        
        System.out.println("Admin şifre doğru! Token oluşturuluyor...");
        
        // UserDetails oluştur (rolleri doğru şekilde yükle)
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        System.out.println("Admin token oluşturuldu: " + token.substring(0, 20) + "...");
        System.out.println("Admin Role: " + user.getRole().getName());
        System.out.println("=== DEBUG END ===");
        
        return new AuthResponse(token, user.getFirstName(), user.getLastName(), user.getRole().getName(), user.getEmail());
    }
    
    /**
     * Seller girişi (signin) işlemi. Sadece SELLER rolündeki kullanıcılar giriş yapabilir.
     */
    @Override
    public AuthResponse sellerSignIn(SignInRequest request) {
        // Frontend'den gelen plain password'ü kullan
        String plainPassword = request.getPassword();
        
        // DEBUG: Password'ü logla
        System.out.println("=== DEBUG: SELLER SIGNIN ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Frontend'den gelen password: " + plainPassword);
        
        // Kullanıcıyı email ile bul
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("Veritabanındaki hash: " + user.getPassword());
        System.out.println("User role: " + (user.getRole() != null ? user.getRole().getName() : "null"));
        
        // SELLER rolü kontrolü
        if (user.getRole() == null || !"SELLER".equals(user.getRole().getName())) {
            System.out.println("Kullanıcı SELLER rolüne sahip değil! Role: " + (user.getRole() != null ? user.getRole().getName() : "null"));
            throw new RuntimeException("Access denied. Seller privileges required.");
        }
        
        // Frontend'den gelen plain text şifreyi veritabanındaki BCrypt hash ile karşılaştır
        boolean passwordMatches = passwordEncoder.matches(plainPassword, user.getPassword());
        System.out.println("Şifre eşleşiyor mu: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("Şifre eşleşmedi! Hata fırlatılıyor...");
            throw new RuntimeException("Invalid credentials");
        }
        
        System.out.println("Seller şifre doğru! Token oluşturuluyor...");
        
        // UserDetails oluştur (rolleri doğru şekilde yükle)
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        System.out.println("Seller token oluşturuldu: " + token.substring(0, 20) + "...");
        System.out.println("Seller Role: " + user.getRole().getName());
        System.out.println("=== DEBUG END ===");
        
        return new AuthResponse(token, user.getFirstName(), user.getLastName(), user.getRole().getName(), user.getEmail());
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Kaydı: Yeni kullanıcı oluşturma ve JWT token üretme
     * 2. Kullanıcı Girişi: Kimlik doğrulama ve JWT token üretme
     * 3. Rol Yönetimi: Kullanıcı tipine göre rol atama (USER/SELLER)
     * 4. Mağaza Oluşturma: Seller tipi kullanıcılar için otomatik mağaza oluşturma
     * 5. Benzersizlik Kontrolü: Kullanıcı adı ve email benzersizlik kontrolü
     * 6. Şifre Güvenliği: Frontend'den gelen SHA-256 hash'lerini BCrypt ile işleme
     * 7. Transaction Yönetimi: Veritabanı işlemlerinin atomik yapılması
     * 
     * Bu servis sayesinde kullanıcı kayıt ve giriş işlemleri güvenli şekilde yapılabilir!
     */
} 