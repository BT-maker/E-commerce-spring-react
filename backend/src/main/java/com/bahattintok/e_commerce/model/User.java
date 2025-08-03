package com.bahattintok.e_commerce.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Kullanıcıları temsil eden JPA entity'si ve Spring Security UserDetails implementasyonu.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"favorites", "reviews"})
public class User implements UserDetails {
    
    /**
     * Kullanıcı ID'si (UUID)
     */
    @Id
    @GeneratedValue(generator = "uuid2")
    @org.hibernate.annotations.GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;
    
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
     * Kullanıcının favorileri
     */
    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Favorite> favorites = new ArrayList<>();
    
    /**
     * Kullanıcının yorumları
     */
    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();
    
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
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Yönetimi: Sistem kullanıcılarının temel bilgileri
     * 2. Spring Security Entegrasyonu: UserDetails interface implementasyonu
     * 3. Rol Yönetimi: Kullanıcının rolü ve yetkileri
     * 4. Güvenlik Kontrolü: Hesap durumu kontrolleri (aktif, kilitli vs.)
     * 5. İlişki Yönetimi: Favori, review ve diğer kullanıcı verileri
     * 6. Benzersiz Bilgiler: Email ve kullanıcı adının benzersiz olması
     * 7. Şifre Güvenliği: Hash'lenmiş şifre saklama
     * 
     * Bu entity sayesinde kullanıcı yönetimi güvenli ve kapsamlı şekilde yapılabilir!
     */
} 