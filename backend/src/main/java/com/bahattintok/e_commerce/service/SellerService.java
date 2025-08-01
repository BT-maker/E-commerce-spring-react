package com.bahattintok.e_commerce.service;

import java.util.List;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;

public interface SellerService {
    Store getOrCreateStore(User seller, String storeName);
    Store getStoreBySeller(User seller);
    List<Product> getStoreProducts(User seller);
    Product addProduct(User seller, Product product);
    Product updateProduct(User seller, String productId, Product product);
    void deleteProduct(User seller, String productId);
    
    // İndirim işlemleri
    Product addDiscount(User seller, String productId, Integer discountPercentage, String endDateStr);
    Product removeDiscount(User seller, String productId);

    // İstatistikler
    Integer getTotalSoldQuantityByStore(String storeId);
    Double getTotalRevenueByStore(String storeId);
    List<Object[]> getDailySalesByStore(String storeId);
    List<Object[]> getBestSellingProductsByStore(String storeId);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Mağaza Yönetimi: Satıcı mağazalarının oluşturulması ve yönetimi
     * 2. Ürün Yönetimi: Mağaza ürünlerinin eklenmesi, güncellenmesi ve silinmesi
     * 3. Satış İstatistikleri: Mağaza bazında satış verilerini hesaplama
     * 4. Toplam Satış: Mağazanın toplam satılan ürün adedi
     * 5. Toplam Gelir: Mağazanın toplam gelir hesaplama
     * 6. Günlük Satışlar: Mağazanın günlük satış raporları
     * 7. En Çok Satanlar: Mağazanın en popüler ürünleri
     * 8. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 9. String ID Desteği: Performans için String UUID kullanımı
     * 
     * Bu interface sayesinde satıcı mağaza yönetimi standart ve kapsamlı şekilde yapılabilir!
     */
} 