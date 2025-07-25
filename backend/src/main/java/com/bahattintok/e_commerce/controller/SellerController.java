package com.bahattintok.e_commerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.SellerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@Tag(name = "Seller Panel", description = "Seller mağaza ve ürün yönetimi")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {
    private final SellerService sellerService;
    private final UserRepository userRepository;

    @GetMapping("/store")
    @Operation(summary = "Mağaza bilgisi", description = "Satıcının mağaza bilgisini getirir")
    public ResponseEntity<Store> getStore(Authentication authentication) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        Store store = sellerService.getStoreBySeller(seller);
        return ResponseEntity.ok(store);
    }

    @PostMapping("/store")
    @Operation(summary = "Mağaza oluştur", description = "Satıcı için mağaza oluşturur")
    public ResponseEntity<Store> createStore(Authentication authentication, @RequestParam String name) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        Store store = sellerService.getOrCreateStore(seller, name);
        return ResponseEntity.ok(store);
    }

    @GetMapping("/products")
    @Operation(summary = "Mağaza ürünleri", description = "Satıcının mağazasındaki ürünleri getirir")
    public ResponseEntity<List<Product>> getStoreProducts(Authentication authentication) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        List<Product> products = sellerService.getStoreProducts(seller);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/products")
    @Operation(summary = "Ürün ekle", description = "Satıcı mağazasına yeni ürün ekler")
    public ResponseEntity<Product> addProduct(Authentication authentication, @RequestBody Product product) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        Product saved = sellerService.addProduct(seller, product);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/products/{productId}")
    @Operation(summary = "Ürün güncelle", description = "Satıcı mağazasındaki ürünü günceller")
    public ResponseEntity<Product> updateProduct(Authentication authentication, @PathVariable Long productId, @RequestBody Product product) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        Product updated = sellerService.updateProduct(seller, productId, product);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{productId}")
    @Operation(summary = "Ürün sil", description = "Satıcı mağazasındaki ürünü siler")
    public ResponseEntity<Void> deleteProduct(Authentication authentication, @PathVariable Long productId) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        sellerService.deleteProduct(seller, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Satıcı istatistikleri", description = "Satıcının mağazasına ait satış istatistiklerini döner")
    public ResponseEntity<?> getSellerStats(Authentication authentication) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email).orElse(null);
        if (seller == null) return ResponseEntity.status(401).build();
        Store store = sellerService.getStoreBySeller(seller);
        if (store == null) return ResponseEntity.ok(Map.of("message", "Mağaza bulunamadı"));
        Long storeId = store.getId();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSold", sellerService.getTotalSoldQuantityByStore(storeId));
        stats.put("totalRevenue", sellerService.getTotalRevenueByStore(storeId));
        stats.put("dailySales", sellerService.getDailySalesByStore(storeId));
        stats.put("bestSellers", sellerService.getBestSellingProductsByStore(storeId));
        return ResponseEntity.ok(stats);
    }
} 