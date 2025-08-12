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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Kullanıcıları temsil eden JPA entity'si ve Spring Security UserDetails implementasyonu.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
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
     * Kullanıcının adı
     */
    @Column(name = "first_name")
    private String firstName;
    
    /**
     * Kullanıcının soyadı
     */
    @Column(name = "last_name")
    private String lastName;
    
    /**
     * Kullanıcının telefon numarası
     */
    @Column(name = "phone")
    private String phone;

    /**
     * Kullanıcının adresi
     */
    @Column(name = "address", length = 255)
    private String address;
    
    /**
     * Kullanıcının doğum tarihi
     */
    @Column(name = "birth_date")
    private String birthDate;
    
    /**
     * Kullanıcının adresi
     */
    @Column(name = "adress")
    private String adress;
    
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
     * Email getter metodu
     */
    public String getEmail() {
        return email;
    }
    
    /**
     * Username getter metodu (UserDetails interface requirement)
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * Password getter metodu (UserDetails interface requirement)
     */
    public String getPassword() {
        return password;
    }
    
    /**
     * Role getter metodu
     */
    public RoleEntity getRole() {
        return role;
    }
    
    /**
     * Username setter metodu
     */
    public void setUsername(String username) {
        this.username = username;
    }
    
    /**
     * Email setter metodu
     */
    public void setEmail(String email) {
        this.email = email;
    }
    
    /**
     * Password setter metodu
     */
    public void setPassword(String password) {
        this.password = password;
    }
    
    /**
     * Role setter metodu
     */
    public void setRole(RoleEntity role) {
        this.role = role;
    }
    
    /**
     * Id getter metodu
     */
    public String getId() {
        return id;
    }
    
    /**
     * Id setter metodu
     */
    public void setId(String id) {
        this.id = id;
    }
    
    /**
     * FirstName getter metodu
     */
    public String getFirstName() {
        return firstName;
    }
    
    /**
     * FirstName setter metodu
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    /**
     * LastName getter metodu
     */
    public String getLastName() {
        return lastName;
    }
    
    /**
     * LastName setter metodu
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    /**
     * Phone getter metodu
     */
    public String getPhone() {
        return phone;
    }
    
    /**
     * Phone setter metodu
     */
    public void setPhone(String phone) {
        this.phone = phone;
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