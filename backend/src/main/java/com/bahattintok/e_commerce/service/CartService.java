package com.bahattintok.e_commerce.service;

import java.util.List;

import com.bahattintok.e_commerce.model.Cart;
import com.bahattintok.e_commerce.model.CartItem;
import com.bahattintok.e_commerce.model.User;

public interface CartService {
    Cart getOrCreateCart(User user);
    List<CartItem> getCartItems(User user);
    void addToCart(User user, String productId, int quantity);
    void removeFromCart(User user, String productId);
    void updateCartItemQuantity(User user, String productId, int quantity);
    void clearCart(User user);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Sepet Yönetimi: Kullanıcı sepetlerinin oluşturulması ve yönetimi
     * 2. Ürün Ekleme: Sepete ürün ekleme ve miktar güncelleme
     * 3. Ürün Çıkarma: Sepetten ürün kaldırma işlemi
     * 4. Miktar Güncelleme: Sepetteki ürün miktarını değiştirme
     * 5. Sepet Temizleme: Tüm sepet içeriğini silme
     * 6. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 7. String ID Desteği: Performans için String UUID kullanımı
     * 
     * Bu interface sayesinde sepet işlemleri standart ve tutarlı şekilde yapılabilir!
     */
} 