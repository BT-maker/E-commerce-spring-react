package com.bahattintok.e_commerce.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.model.Favorite;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.FavoriteRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteServiceImpl implements FavoriteService {
    
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    @Override
    public List<Favorite> getUserFavorites(String email) {
        try {
            System.out.println("=== FAVORİ SERVİSİ ===");
            System.out.println("Email: " + email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));
            
            System.out.println("Kullanıcı bulundu: " + user.getEmail() + " (ID: " + user.getId() + ")");
            
            List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            System.out.println("Veritabanından favoriler alındı: " + favorites.size() + " adet");
            
            return favorites;
        } catch (Exception e) {
            System.err.println("Favori listesi hatası - Email: " + email + ", Hata: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    @Override
    public Favorite addToFavorites(String email, String productId) {
        try {
            System.out.println("=== FAVORİ EKLEME SERVİSİ ===");
            System.out.println("Email: " + email);
            System.out.println("ProductId: " + productId);
            
            // Kullanıcı ve ürün kontrolü
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));
            
            System.out.println("Kullanıcı bulundu: " + user.getEmail() + " (ID: " + user.getId() + ")");
            
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + productId));
            
            System.out.println("Ürün bulundu: " + product.getName() + " (ID: " + product.getId() + ")");
            
            // Zaten favorilerde mi kontrol et
            if (favoriteRepository.existsByUserIdAndProductId(user.getId(), productId)) {
                System.out.println("Ürün zaten favorilerde!");
                throw new RuntimeException("Ürün zaten favorilerde: " + productId);
            }
            
            // Yeni favori oluştur
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setProduct(product);
            
            Favorite savedFavorite = favoriteRepository.save(favorite);
            System.out.println("Favori başarıyla kaydedildi: " + savedFavorite.getId());
            
            return savedFavorite;
        } catch (Exception e) {
            System.err.println("Favori ekleme hatası - Email: " + email + ", ProductId: " + productId + ", Hata: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Override
    public void removeFromFavorites(String email, String productId) {
        try {
            System.out.println("=== FAVORİ ÇIKARMA SERVİSİ ===");
            System.out.println("Email: " + email);
            System.out.println("ProductId: " + productId);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));
            
            System.out.println("Kullanıcı bulundu: " + user.getEmail() + " (ID: " + user.getId() + ")");
            
            Favorite favorite = favoriteRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Favori bulunamadı: " + productId));
            
            System.out.println("Favori bulundu: " + favorite.getId() + " (Product: " + favorite.getProduct().getName() + ")");
            
            favoriteRepository.delete(favorite);
            System.out.println("Favori başarıyla silindi!");
        } catch (Exception e) {
            System.err.println("Favori çıkarma hatası - Email: " + email + ", ProductId: " + productId + ", Hata: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Override
    public boolean isFavorite(String email, String productId) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));
            return favoriteRepository.existsByUserIdAndProductId(user.getId(), productId);
        } catch (Exception e) {
            System.err.println("Favori kontrolü hatası - Email: " + email + ", ProductId: " + productId + ", Hata: " + e.getMessage());
            return false;
        }
    }
    
    @Override
    public long getFavoriteCount(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return favoriteRepository.countByUserId(user.getId());
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Favori Yönetimi: Kullanıcı favori ürünlerinin listelenmesi ve yönetimi
     * 2. Favori Ekleme: Ürünü favorilere ekleme ve mükerrer kontrolü
     * 3. Favori Çıkarma: Ürünü favorilerden çıkarma işlemi
     * 4. Favori Kontrolü: Ürünün favorilerde olup olmadığını kontrol etme
     * 5. Favori Sayısı: Kullanıcının toplam favori sayısını hesaplama
     * 6. Hata Yönetimi: Kullanıcı ve ürün bulunamadığında uygun exception fırlatma
     * 7. Transaction Yönetimi: Veritabanı işlemlerinin atomik yapılması
     * 
     * Bu servis sayesinde kullanıcı favori işlemleri güvenli ve tutarlı şekilde yönetilebilir!
     */
} 