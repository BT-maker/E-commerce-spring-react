package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Belirli bir mağazanın toplam satılan ürün adedi
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.store.id = :storeId")
    Integer getTotalSoldQuantityByStore(@Param("storeId") Long storeId);

    // Belirli bir mağazanın toplam geliri
    @Query("SELECT SUM(oi.price * oi.quantity) FROM OrderItem oi WHERE oi.product.store.id = :storeId")
    Double getTotalRevenueByStore(@Param("storeId") Long storeId);

    // Belirli bir mağazanın günlük satışları (tarihe göre gruplanmış)
    @Query("SELECT DATE(o.createdAt), SUM(oi.quantity), SUM(oi.price * oi.quantity) FROM OrderItem oi JOIN oi.order o WHERE oi.product.store.id = :storeId GROUP BY DATE(o.createdAt) ORDER BY DATE(o.createdAt) DESC")
    List<Object[]> getDailySalesByStore(@Param("storeId") Long storeId);

    // Belirli bir mağazanın en çok satan ürünleri (top N)
    @Query("SELECT oi.product.name, SUM(oi.quantity) as totalSold FROM OrderItem oi WHERE oi.product.store.id = :storeId GROUP BY oi.product.id, oi.product.name ORDER BY totalSold DESC")
    List<Object[]> getBestSellingProductsByStore(@Param("storeId") Long storeId);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: OrderItem entity'si için standart veritabanı işlemleri
     * 2. Satış İstatistikleri: Mağaza bazında satış verilerini hesaplama
     * 3. Toplam Satış: Mağazanın toplam satılan ürün adedi
     * 4. Toplam Gelir: Mağazanın toplam gelir hesaplama
     * 5. Günlük Satışlar: Mağazanın günlük satış raporları
     * 6. En Çok Satanlar: Mağazanın en popüler ürünleri
     * 7. JPA Desteği: Spring Data JPA ile özel sorgular
     * 
     * Bu repository sayesinde satış istatistikleri ve sipariş detayları veritabanında güvenli şekilde yönetilebilir!
     */
} 