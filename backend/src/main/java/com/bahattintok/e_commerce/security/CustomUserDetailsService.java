package com.bahattintok.e_commerce.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Spring Security için kullanıcı detaylarını (UserDetails) yükleyen servis.
 * Email ile kullanıcıyı bulur ve UserDetails döner.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    /**
     * Email ile kullanıcıyı bulur ve UserDetails döner.
     *
     * @param email Kullanıcı email adresi
     * @return UserDetails
     * @throws UsernameNotFoundException kullanıcı bulunamazsa fırlatılır
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().getName())
                .build();
    }
} 