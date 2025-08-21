package com.bahattintok.e_commerce.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.bahattintok.e_commerce.model.enums.SellerStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
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
@ToString(exclude = {"favorites", "reviews", "role"})
@EqualsAndHashCode(of = "id")
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
     * Kullanıcının adı (zorunlu)
     */
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    /**
     * Kullanıcının soyadı (zorunlu)
     */
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
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
     * Kullanıcının telefon numarası
     */
    @Column(name = "phone")
    private String phone;

    /**
     * Kullanıcının birinci adresi
     */
    @Column(name = "address1", length = 255)
    private String address1;

    /**
     * Kullanıcının ikinci adresi
     */
    @Column(name = "address2")
    private String address2;
    
    /**
     * Kullanıcının doğum tarihi
     */
    @Column(name = "birth_date")
    private String birthDate;
    
    /**
     * Kullanıcının kayıt tarihi
     */
    @Column(name = "registration_date", nullable = false)
    private java.time.LocalDateTime registrationDate = java.time.LocalDateTime.now();
    
    /**
     * Satıcı durumu (sadece SELLER rolündeki kullanıcılar için)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "seller_status")
    private SellerStatus sellerStatus = SellerStatus.PENDING;
    
    /**
     * Satıcı başvuru tarihi
     */
    @Column(name = "seller_application_date")
    private java.time.LocalDateTime sellerApplicationDate;
    
    /**
     * Onay tarihi
     */
    @Column(name = "approval_date")
    private java.time.LocalDateTime approvalDate;
    
    /**
     * Onaylayan admin
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    /**
     * Red sebebi
     */
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
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
     * Email'i username olarak kullanıyoruz
     */
    @Override
    public String getUsername() {
        return email;
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
     * Username setter metodu (artık kullanılmıyor, email kullanılıyor)
     */
    public void setUsername(String username) {
        // Username artık kullanılmıyor, email kullanılıyor
        // Bu metod geriye uyumluluk için bırakıldı
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
     * Address1 getter metodu
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * Address1 setter metodu
     */
    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    /**
     * Address2 getter metodu
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * Address2 setter metodu
     */
    public void setAddress2(String address2) {
        this.address2 = address2;
    }
    
    /**
     * RegistrationDate getter metodu
     */
    public java.time.LocalDateTime getRegistrationDate() {
        return registrationDate;
    }
    
    /**
     * RegistrationDate setter metodu
     */
    public void setRegistrationDate(java.time.LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }
    
    /**
     * SellerStatus getter metodu
     */
    public SellerStatus getSellerStatus() {
        return sellerStatus;
    }
    
    /**
     * SellerStatus setter metodu
     */
    public void setSellerStatus(SellerStatus sellerStatus) {
        this.sellerStatus = sellerStatus;
    }
    
    /**
     * SellerApplicationDate getter metodu
     */
    public java.time.LocalDateTime getSellerApplicationDate() {
        return sellerApplicationDate;
    }
    
    /**
     * SellerApplicationDate setter metodu
     */
    public void setSellerApplicationDate(java.time.LocalDateTime sellerApplicationDate) {
        this.sellerApplicationDate = sellerApplicationDate;
    }
    
    /**
     * ApprovalDate getter metodu
     */
    public java.time.LocalDateTime getApprovalDate() {
        return approvalDate;
    }
    
    /**
     * ApprovalDate setter metodu
     */
    public void setApprovalDate(java.time.LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }
    
    /**
     * ApprovedBy getter metodu
     */
    public User getApprovedBy() {
        return approvedBy;
    }
    
    /**
     * ApprovedBy setter metodu
     */
    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    /**
     * RejectionReason getter metodu
     */
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    /**
     * RejectionReason setter metodu
     */
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
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