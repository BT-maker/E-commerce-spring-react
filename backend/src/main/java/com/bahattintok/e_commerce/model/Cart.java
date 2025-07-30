package com.bahattintok.e_commerce.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
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
@Table(name = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItem> items = new ArrayList<>();
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Sepeti: Her kullanıcının benzersiz sepeti
     * 2. Sepet İlişkisi: Kullanıcı ile sepet arasında one-to-one ilişki
     * 3. Sepet Ürünleri: Sepetteki ürünlerin listesi (CartItem'lar)
     * 4. Otomatik Temizlik: Sepet silindiğinde ürünlerin de silinmesi
     * 
     * Bu entity sayesinde kullanıcıların alışveriş sepetleri yönetilebilir!
     */
} 