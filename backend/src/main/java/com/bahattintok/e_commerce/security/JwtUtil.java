package com.bahattintok.e_commerce.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * JWT token üretme, çözme ve doğrulama işlemlerini yapan yardımcı sınıf.
 */
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    /**
     * JWT imzalama anahtarını döner.
     */
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    /**
     * Token'dan kullanıcı email'ini (subject) çıkarır.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    /**
     * Token'dan son geçerlilik tarihini çıkarır.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    /**
     * Token'dan istenen claim'i çıkarır.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    /**
     * Token'daki tüm claim'leri çözer.
     */
    @SuppressWarnings("deprecation")
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Token'ın süresi dolmuş mu kontrolü.
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    /**
     * Kullanıcı için JWT token üretir (email ile).
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());
        String email = userDetails.getUsername();
        return createToken(claims, email);
    }

    /**
     * Token'ı oluşturur ve imzalar.
     */
    @SuppressWarnings("deprecation")
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Token'ı doğrular (email eşleşiyor ve süresi dolmamış mı kontrolü).
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractUsername(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * JWT secret anahtarını döner.
     */
    public String getSecret() {
        return secret;
    }
    
    /**
     * Bu utility sınıfı şu işlevleri sağlar:
     * 
     * 1. JWT Token Üretme: Kullanıcı bilgileri ile JWT token oluşturma
     * 2. Token Çözme: JWT token'ından kullanıcı bilgilerini çıkarma
     * 3. Token Doğrulama: Token'ın geçerliliğini ve süresini kontrol etme
     * 4. Rol Yönetimi: JWT içinde kullanıcı rollerini saklama ve okuma
     * 5. Güvenli İmzalama: HMAC-SHA256 algoritması ile token imzalama
     * 6. Süre Yönetimi: Token'ın geçerlilik süresini ayarlama ve kontrol etme
     * 7. Konfigürasyon: Application properties'den secret ve expiration değerlerini alma
     * 
     * Bu utility sayesinde JWT token işlemleri güvenli ve standart şekilde yapılabilir!
     */
} 