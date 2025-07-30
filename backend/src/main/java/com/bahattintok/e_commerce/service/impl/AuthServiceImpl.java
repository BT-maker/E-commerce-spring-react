package com.bahattintok.e_commerce.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.dto.AuthResponse;
import com.bahattintok.e_commerce.dto.SignInRequest;
import com.bahattintok.e_commerce.dto.SignUpRequest;
import com.bahattintok.e_commerce.model.RoleEntity;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.RoleRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.security.CustomUserDetailsService;
import com.bahattintok.e_commerce.security.JwtUtil;
import com.bahattintok.e_commerce.service.AuthService;

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
    
    /**
     * Kullanıcı kaydı (signup) işlemi. Yeni kullanıcı oluşturur ve JWT token döner.
     */
    @Override
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Kullanıcı tipine göre rol belirleme
        RoleEntity role;
        if ("seller".equals(request.getUserType())) {
            role = roleRepository.findByName("SELLER")
                    .orElseThrow(() -> new RuntimeException("SELLER role not found"));
        } else {
            role = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("USER role not found"));
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
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
        
        return new AuthResponse(token, savedUser.getUsername(), savedUser.getRole().getName());
    }
    
    /**
     * Kullanıcı girişi (signin) işlemi. Kimlik doğrulama yapar ve JWT token döner.
     */
    @Override
    public AuthResponse signIn(SignInRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, user.getUsername(), user.getRole().getName());
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Kaydı: Yeni kullanıcı oluşturma ve JWT token üretme
     * 2. Kullanıcı Girişi: Kimlik doğrulama ve JWT token üretme
     * 3. Rol Yönetimi: Kullanıcı tipine göre rol atama (USER/SELLER)
     * 4. Mağaza Oluşturma: Seller tipi kullanıcılar için otomatik mağaza oluşturma
     * 5. Benzersizlik Kontrolü: Kullanıcı adı ve email benzersizlik kontrolü
     * 6. Şifre Güvenliği: BCrypt ile şifre hash'leme
     * 7. Transaction Yönetimi: Veritabanı işlemlerinin atomik yapılması
     * 
     * Bu servis sayesinde kullanıcı kayıt ve giriş işlemleri güvenli şekilde yapılabilir!
     */
} 