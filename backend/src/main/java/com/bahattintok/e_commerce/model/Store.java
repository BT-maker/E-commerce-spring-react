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

    @Column(name = "logo_url")
    private String logo;

    @Column(name = "banner_url")
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