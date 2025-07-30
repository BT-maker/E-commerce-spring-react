package com.bahattintok.e_commerce.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.OrderItemRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.service.SellerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public Store getOrCreateStore(User seller, String storeName) {
        return storeRepository.findBySeller(seller).orElseGet(() -> {
            Store store = new Store();
            store.setName(storeName);
            store.setSeller(seller);
            return storeRepository.save(store);
        });
    }

    @Override
    public Store getStoreBySeller(User seller) {
        return storeRepository.findBySeller(seller).orElse(null);
    }

    @Override
    public List<Product> getStoreProducts(User seller) {
        Store store = getStoreBySeller(seller);
        if (store == null) return List.of();
        return store.getProducts();
    }

    @Override
    @Transactional
    public Product addProduct(User seller, Product product) {
        Store store = getStoreBySeller(seller);
        if (store == null) throw new RuntimeException("Mağaza bulunamadı!");
        product.setStore(store);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(User seller, Long productId, Product updatedProduct) {
        Store store = getStoreBySeller(seller);
        if (store == null) throw new RuntimeException("Mağaza bulunamadı!");
        Product product = productRepository.findById(productId)
                .filter(p -> p.getStore().getId().equals(store.getId()))
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı veya yetkiniz yok!"));
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setDescription(updatedProduct.getDescription());
        product.setStock(updatedProduct.getStock());
        product.setImageUrl(updatedProduct.getImageUrl());
        product.setCategory(updatedProduct.getCategory());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(User seller, Long productId) {
        Store store = getStoreBySeller(seller);
        if (store == null) throw new RuntimeException("Mağaza bulunamadı!");
        Product product = productRepository.findById(productId)
                .filter(p -> p.getStore().getId().equals(store.getId()))
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı veya yetkiniz yok!"));
        productRepository.delete(product);
    }

    // İstatistikler
    @Override
    public Integer getTotalSoldQuantityByStore(Long storeId) {
        return orderItemRepository.getTotalSoldQuantityByStore(storeId);
    }

    @Override
    public Double getTotalRevenueByStore(Long storeId) {
        return orderItemRepository.getTotalRevenueByStore(storeId);
    }

    @Override
    public List<Object[]> getDailySalesByStore(Long storeId) {
        return orderItemRepository.getDailySalesByStore(storeId);
    }

    @Override
    public List<Object[]> getBestSellingProductsByStore(Long storeId) {
        return orderItemRepository.getBestSellingProductsByStore(storeId);
    }

    @Override
    @Transactional
    public Product addDiscount(User seller, Long productId, Integer discountPercentage, String endDateStr) {
        System.out.println("=== İNDİRİM EKLEME BAŞLADI ===");
        System.out.println("Ürün ID: " + productId);
        System.out.println("İndirim Yüzdesi: " + discountPercentage);
        System.out.println("Bitiş Tarihi: " + endDateStr);
        
        Store store = getStoreBySeller(seller);
        if (store == null) throw new RuntimeException("Mağaza bulunamadı!");
        
        Product product = productRepository.findById(productId)
                .filter(p -> p.getStore().getId().equals(store.getId()))
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı veya yetkiniz yok!"));
        
        System.out.println("Ürün bulundu: " + product.getName() + " (Fiyat: " + product.getPrice() + ")");
        
        // İndirim yüzdesini kontrol et
        if (discountPercentage == null || discountPercentage < 0 || discountPercentage > 100) {
            throw new RuntimeException("İndirim yüzdesi 0-100 arasında olmalıdır!");
        }
        
        product.setDiscountPercentage(discountPercentage);
        System.out.println("İndirim yüzdesi ayarlandı: " + product.getDiscountPercentage());
        
        // Bitiş tarihini ayarla
        if (endDateStr != null && !endDateStr.trim().isEmpty()) {
            try {
                LocalDateTime endDate;
                // Farklı tarih formatlarını dene
                if (endDateStr.contains("T")) {
                    // ISO format: 2024-01-15T14:30
                    endDate = LocalDateTime.parse(endDateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } else {
                    // Sadece tarih formatı: 2024-01-15 14:30
                    endDate = LocalDateTime.parse(endDateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
                }
                product.setDiscountEndDate(endDate);
                System.out.println("Bitiş tarihi ayarlandı: " + product.getDiscountEndDate());
            } catch (Exception e) {
                System.err.println("Tarih parsing hatası: " + endDateStr + " - " + e.getMessage());
                throw new RuntimeException("Geçersiz tarih formatı! Tarih formatı: yyyy-MM-ddTHH:mm veya yyyy-MM-dd HH:mm");
            }
        }
        
        // İndirimli fiyatı hesapla
        BigDecimal discountedPrice = product.getPrice()
                .multiply(BigDecimal.valueOf(100 - discountPercentage))
                .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        product.setDiscountedPrice(discountedPrice);
        
        System.out.println("İndirimli fiyat hesaplandı: " + product.getDiscountedPrice());
        System.out.println("İndirim aktif mi: " + product.isDiscountActive());
        
        Product savedProduct = productRepository.save(product);
        System.out.println("Ürün kaydedildi. Yeni indirim yüzdesi: " + savedProduct.getDiscountPercentage());
        System.out.println("Yeni indirimli fiyat: " + savedProduct.getDiscountedPrice());
        System.out.println("Yeni indirim aktif mi: " + savedProduct.isDiscountActive());
        System.out.println("=== İNDİRİM EKLEME TAMAMLANDI ===");
        
        return savedProduct;
    }

    @Override
    @Transactional
    public Product removeDiscount(User seller, Long productId) {
        Store store = getStoreBySeller(seller);
        if (store == null) throw new RuntimeException("Mağaza bulunamadı!");
        
        Product product = productRepository.findById(productId)
                .filter(p -> p.getStore().getId().equals(store.getId()))
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı veya yetkiniz yok!"));
        
        // İndirim bilgilerini temizle
        product.setDiscountPercentage(null);
        product.setDiscountedPrice(null);
        product.setDiscountEndDate(null);
        
        return productRepository.save(product);
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Mağaza Yönetimi: Satıcı mağazalarının oluşturulması ve yönetimi
     * 2. Ürün Yönetimi: Mağaza ürünlerinin eklenmesi, güncellenmesi ve silinmesi
     * 3. Yetki Kontrolü: Satıcının sadece kendi mağazasındaki ürünleri yönetebilmesi
     * 4. Satış İstatistikleri: Mağaza bazında satış verilerini hesaplama
     * 5. Toplam Satış: Mağazanın toplam satılan ürün adedi
     * 6. Toplam Gelir: Mağazanın toplam gelir hesaplama
     * 7. Günlük Satışlar: Mağazanın günlük satış raporları
     * 8. En Çok Satanlar: Mağazanın en popüler ürünleri
     * 
     * Bu servis sayesinde satıcı mağaza yönetimi kapsamlı ve güvenli şekilde yapılabilir!
     */
} 