package com.bahattintok.e_commerce.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * JWT token doğrulama ve kullanıcı kimliğini SecurityContext'e yerleştiren filter.
 * Hem Authorization header hem de cookie'den token okur.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    
    /**
     * Her istekte JWT token'ı kontrol eder, doğrular ve kullanıcıyı authenticate eder.
     */
    @SuppressWarnings("deprecation")
    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String servletPath = request.getServletPath();
        // Giriş ve kayıt endpoint'lerinde filtreyi atla
        if (servletPath.equals("/api/auth/signin") || servletPath.equals("/api/auth/signup")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String jwt = null;

        // Önce Authorization header'ı kontrol et
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            // Cookie'den token al
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt != null) {
            try {
                System.out.println("=== JWT Filter - Token bulundu ===");
                String username = jwtUtil.extractUsername(jwt);
                System.out.println("Extracted username: " + username);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    System.out.println("Username null değil ve authentication yok");
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                    System.out.println("UserDetails loaded: " + userDetails.getUsername());
                    
                    if (jwtUtil.validateToken(jwt, userDetails)) {
                        System.out.println("Token geçerli");
                        
                        // JWT içindeki rolü oku
                        String role = jwtUtil.extractRole(jwt);
                        System.out.println("Token'dan çıkarılan rol: " + role);
                        
                        List<SimpleGrantedAuthority> authorities;
                        
                        if (role != null) {
                            // Token'dan gelen rolü kullan, ROLE_ prefix'i ekle
                            String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                            authorities = List.of(new SimpleGrantedAuthority(formattedRole));
                            System.out.println("Token'dan gelen rol kullanılıyor: " + formattedRole);
                        } else {
                            // UserDetails'dan rolleri al
                            authorities = userDetails.getAuthorities().stream()
                                    .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                                    .collect(Collectors.toList());
                            System.out.println("UserDetails'dan roller alınıyor: " + authorities);
                        }
                        
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities
                        );
                        
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("Authentication SecurityContext'e yerleştirildi");
                    } else {
                        System.out.println("Token geçersiz");
                    }
                } else {
                    System.out.println("Username null veya zaten authentication var");
                }
                System.out.println("=== JWT Filter tamamlandı ===");
            } catch (Exception e) {
                // Hatalı token
                System.out.println("JWT Filter hatası: " + e.getMessage());
                e.printStackTrace();
                // Hata durumunda authentication'ı temizle
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("JWT token bulunamadı");
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Bu filter şu işlevleri sağlar:
     * 
     * 1. JWT Token Doğrulama: Her istekte JWT token'ının geçerliliğini kontrol etme
     * 2. Çoklu Token Kaynağı: Hem Authorization header hem de cookie'den token okuma
     * 3. Kullanıcı Kimlik Doğrulama: Token geçerliyse kullanıcıyı authenticate etme
     * 4. Rol Yönetimi: JWT içindeki roller ile kullanıcı yetkilerini belirleme
     * 5. SecurityContext Yönetimi: Kimlik doğrulanmış kullanıcıyı SecurityContext'e yerleştirme
     * 6. Endpoint Filtreleme: Giriş/kayıt endpoint'lerinde filtreyi atlama
     * 7. Hata Toleransı: Geçersiz token durumunda sessizce devam etme
     * 
     * Bu filter sayesinde JWT tabanlı stateless authentication sistemi güvenli şekilde çalışır!
     */
} 