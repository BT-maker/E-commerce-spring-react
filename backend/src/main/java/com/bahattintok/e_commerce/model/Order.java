package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "orders", "cart", "favorites"})
    private User user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String status; // örn: PENDING, COMPLETED, CANCELLED

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("order")
    private List<OrderItem> items = new ArrayList<>();
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Sipariş Yönetimi: Kullanıcı siparişlerinin saklanması
     * 2. Kullanıcı İlişkisi: Sipariş ile kullanıcı arasında many-to-one ilişki
     * 3. Sipariş Durumu: Siparişin durumunun takip edilmesi (PENDING, COMPLETED, CANCELLED)
     * 4. Toplam Fiyat: Siparişin toplam tutarı
     * 5. Sipariş Ürünleri: Siparişteki ürünlerin listesi (OrderItem'lar)
     * 6. Zaman Damgası: Sipariş oluşturma zamanı
     * 
     * Bu entity sayesinde kullanıcı siparişleri detaylı şekilde yönetilebilir!
     */
}