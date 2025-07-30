package com.bahattintok.e_commerce.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User seller;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products = new ArrayList<>();
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Mağaza Yönetimi: Satıcı mağazalarının tanımlanması
     * 2. Satıcı İlişkisi: Mağaza ile satıcı arasında one-to-one ilişki
     * 3. Ürün Yönetimi: Mağazaya ait ürünlerin listesi
     * 4. Benzersiz İsim: Her mağazanın benzersiz adı
     * 5. Otomatik Temizlik: Mağaza silindiğinde ürünlerin de silinmesi
     * 6. JSON Kontrolü: Sonsuz döngüyü önlemek için JsonIgnore
     * 
     * Bu entity sayesinde satıcı mağazaları ve ürünleri kapsamlı şekilde yönetilebilir!
     */
} 