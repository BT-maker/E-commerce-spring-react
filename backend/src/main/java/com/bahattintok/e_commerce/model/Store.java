package com.bahattintok.e_commerce.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String address;

    @Column
    private String phone;

    @Column
    private String email;

    @Column
    private String website;

    @Column(name = "working_hours")
    private String workingHours;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logo;

    @Column(name = "banner_url", columnDefinition = "TEXT")
    private String banner;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User seller;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
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
     * Name getter metodu
     */
    public String getName() {
        return name;
    }
    
    /**
     * Name setter metodu
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * Seller getter metodu
     */
    public User getSeller() {
        return seller;
    }
    
    /**
     * Seller setter metodu
     */
    public void setSeller(User seller) {
        this.seller = seller;
    }
    
    /**
     * Description getter metodu
     */
    public String getDescription() {
        return description;
    }
    
    /**
     * Description setter metodu
     */
    public void setDescription(String description) {
        this.description = description;
    }
    
    /**
     * Address getter metodu
     */
    public String getAddress() {
        return address;
    }
    
    /**
     * Address setter metodu
     */
    public void setAddress(String address) {
        this.address = address;
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
     * Email getter metodu
     */
    public String getEmail() {
        return email;
    }
    
    /**
     * Email setter metodu
     */
    public void setEmail(String email) {
        this.email = email;
    }
    
    /**
     * Website getter metodu
     */
    public String getWebsite() {
        return website;
    }
    
    /**
     * Website setter metodu
     */
    public void setWebsite(String website) {
        this.website = website;
    }
    
    /**
     * WorkingHours getter metodu
     */
    public String getWorkingHours() {
        return workingHours;
    }
    
    /**
     * WorkingHours setter metodu
     */
    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }
    
    /**
     * Logo getter metodu
     */
    public String getLogo() {
        return logo;
    }
    
    /**
     * Logo setter metodu
     */
    public void setLogo(String logo) {
        this.logo = logo;
    }
    
    /**
     * Banner getter metodu
     */
    public String getBanner() {
        return banner;
    }
    
    /**
     * Banner setter metodu
     */
    public void setBanner(String banner) {
        this.banner = banner;
    }
    
    /**
     * CreatedAt getter metodu
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    /**
     * CreatedAt setter metodu
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    /**
     * UpdatedAt getter metodu
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    /**
     * UpdatedAt setter metodu
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Mağaza Yönetimi: Satıcı mağazalarının tanımlanması
     * 2. Satıcı İlişkisi: Mağaza ile satıcı arasında one-to-one ilişki
     * 3. Ürün Yönetimi: Mağazaya ait ürünlerin listesi
     * 4. Benzersiz İsim: Her mağazanın benzersiz adı
     * 5. Otomatik Temizlik: Mağaza silindiğinde ürünlerin de silinmesi
     * 6. JSON Kontrolü: Sonsuz döngüyü önlemek için JsonIgnore
     * 7. UUID ID: Performans için String UUID kullanımı
     * 8. Mağaza Bilgileri: Açıklama, adres, telefon, e-posta, web sitesi
     * 9. Çalışma Saatleri: Mağaza çalışma saatleri
     * 10. Görsel Öğeler: Logo ve banner URL'leri
     * 11. Zaman Damgası: Oluşturma ve güncelleme zamanları
     * 
     * Bu entity sayesinde satıcı mağazaları ve ürünleri kapsamlı şekilde yönetilebilir!
     */
} 