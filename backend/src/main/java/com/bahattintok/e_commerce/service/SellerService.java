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
    Product updateProduct(User seller, Long productId, Product product);
    void deleteProduct(User seller, Long productId);

    // İstatistikler
    Integer getTotalSoldQuantityByStore(Long storeId);
    Double getTotalRevenueByStore(Long storeId);
    List<Object[]> getDailySalesByStore(Long storeId);
    List<Object[]> getBestSellingProductsByStore(Long storeId);
} 