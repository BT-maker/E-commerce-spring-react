package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
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
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();
    
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
     * Items getter metodu
     */
    public List<OrderItem> getItems() {
        return items;
    }
    
    /**
     * Items setter metodu
     */
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    
    /**
     * Order items'ları döner
     */
    public List<OrderItem> getOrderItems() {
        return items;
    }
    
    /**
     * User getter metodu
     */
    public User getUser() {
        return user;
    }
    
    /**
     * User setter metodu
     */
    public void setUser(User user) {
        this.user = user;
    }
    
    /**
     * Status getter metodu
     */
    public String getStatus() {
        return status;
    }
    
    /**
     * Status setter metodu
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    /**
     * TotalPrice getter metodu
     */
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    /**
     * TotalPrice setter metodu
     */
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
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
     * Müşteri adını döner
     */
    public String getCustomerName() {
        if (user != null) {
            return user.getFirstName() + " " + user.getLastName();
        }
        return null;
    }
    
    /**
     * Müşteri email'ini döner
     */
    public String getCustomerEmail() {
        if (user != null) {
            return user.getEmail();
        }
        return null;
    }
    
    /**
     * Sipariş tarihini döner (orderDate olarak)
     */
    public LocalDateTime getOrderDate() {
        return createdAt;
    }
    
    /**
     * Toplam tutarı döner (totalAmount olarak)
     */
    public BigDecimal getTotalAmount() {
        return totalPrice;
    }
    
    /**
     * Ürün sayısını döner
     */
    public Integer getItemCount() {
        if (items != null) {
            return items.stream().mapToInt(OrderItem::getQuantity).sum();
        }
        return 0;
    }
    
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