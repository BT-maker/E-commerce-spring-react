package com.bahattintok.e_commerce.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import org.hibernate.annotations.Type;
import java.util.ArrayList;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kullanıcıları temsil eden JPA entity'si ve Spring Security UserDetails implementasyonu.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    
    /**
     * Kullanıcı ID'si (otomatik artan)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Kullanıcı adı (benzersiz ve zorunlu)
     */
    @Column(unique = true, nullable = false)
    private String username;
    
    /**
     * Kullanıcı şifresi (hash'li)
     */
    @Column(nullable = false)
    private String password;
    
    /**
     * Kullanıcı email adresi (benzersiz ve zorunlu)
     */
    @Column(unique = true, nullable = false)
    private String email;
    
    /**
     * Kullanıcının rolü (RoleEntity ile ilişki)
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private RoleEntity role;
    
    /**
     * Kullanıcının sepeti kaldırıldı (artık ayrı bir tablo olacak)
     */
    
    /**
     * Kullanıcının rollerini Spring Security'ye uygun şekilde döner.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getName()));
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
} 