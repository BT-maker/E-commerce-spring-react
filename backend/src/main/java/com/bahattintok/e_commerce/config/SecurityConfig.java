package com.bahattintok.e_commerce.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.bahattintok.e_commerce.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * Uygulamanın güvenlik (security) ayarlarını içerir.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    
    /**
     * HTTP güvenlik zinciri: CORS, CSRF, endpoint erişim izinleri, JWT filtreleri vs.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF koruması devre dışı
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS ayarları
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/admin/signin", // Admin login endpoint'i public
                    "/api/products/**", "/api/categories/**", "/api/auth/**", "/api/stores/**", "/api/elasticsearch/**", "/api/search-suggestions/**",
                    "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v3/api-docs.yaml",
                    "/swagger-resources/**", "/webjars/**",
                    "/v3/api-docs/swagger-config", "/api-docs/swagger-config",
                    "/api-docs"
                ).permitAll() // Public endpointler
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin endpoint'leri sadece admin erişebilir
                .anyRequest().authenticated() // Diğer tüm endpointler için authentication gerekli
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless oturum yönetimi (JWT)
            )
            .authenticationProvider(authenticationProvider) // Authentication provider
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // JWT filter'ı ekle
        
        return http.build();
    }
    
    /**
     * CORS (Cross-Origin Resource Sharing) ayarları.
     * Frontend'in farklı portlardan erişimine izin verir.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Lokal geliştirme ve ağ erişimi için localhost ve IP adreslerini kabul et
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://192.168.*:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    /**
     * Bu sınıf şu güvenlik özelliklerini sağlar:
     * 
     * 1. Endpoint Güvenliği: Hangi endpoint'lere kimlerin erişebileceğini belirler
     * 2. JWT Authentication: Token tabanlı kimlik doğrulama
     * 3. CORS Desteği: Frontend'den güvenli erişim
     * 4. Role-Based Access: Rol tabanlı erişim kontrolü
     * 5. Stateless Session: Oturum bilgisi tutmaz (JWT kullanır)
     * 
     * Bu konfigürasyon sayesinde API'niz güvenli ve frontend ile uyumlu çalışır!
     */
} 