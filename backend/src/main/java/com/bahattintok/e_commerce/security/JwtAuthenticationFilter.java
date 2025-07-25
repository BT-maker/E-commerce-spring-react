package com.bahattintok.e_commerce.security;

import java.io.IOException;
import java.util.List;
import java.util.Map;
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

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
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
        String username = null;

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
            username = jwtUtil.extractUsername(jwt);
        }

        // Eğer kullanıcı authenticate edilmemişse ve token geçerliyse SecurityContext'e yerleştir
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(jwt, userDetails)) {
                // JWT içindeki rolleri oku
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtUtil.getSecret().getBytes())
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();
                @SuppressWarnings("unchecked")
                List<Map<String, String>> roles = (List<Map<String, String>>) claims.get("roles");
                List<SimpleGrantedAuthority> authorities = roles != null ?
                        roles.stream().map(role -> {
                            String auth = role.get("authority");
                            return new SimpleGrantedAuthority(auth.startsWith("ROLE_") ? auth : "ROLE_" + auth);
                        }).collect(Collectors.toList()) :
                        userDetails.getAuthorities().stream().map(a -> new SimpleGrantedAuthority(a.getAuthority())).collect(Collectors.toList());
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
} 