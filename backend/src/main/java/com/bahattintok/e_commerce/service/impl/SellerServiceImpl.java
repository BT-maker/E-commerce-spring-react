package com.bahattintok.e_commerce.service.impl;

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
} 