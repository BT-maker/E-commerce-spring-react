package com.bahattintok.e_commerce.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bahattintok.e_commerce.dto.ProductRequest;
import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.service.ProductService;

import lombok.RequiredArgsConstructor;

/**
 * Ürün işlemlerini yöneten servis implementasyonu.
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    
    /**
     * Tüm ürünleri getirir.
     */
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    /**
     * Tüm ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    /**
     * ID'ye göre ürün getirir.
     */
    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    /**
     * Yeni ürün oluşturur.
     */
    @Override
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        return productRepository.save(product);
    }
    
    /**
     * Ürünü günceller.
     */
    @Override
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        return productRepository.save(product);
    }
    
    /**
     * Ürünü siler.
     */
    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
    
    /**
     * Kategori adına göre ürünleri getirir.
     */
    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    /**
     * İsme göre arama yapar (sayfalı).
     */
    @Override
    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable);
    }
    
    /**
     * Fiyat aralığına göre ürünleri getirir.
     */
    @Override
    public List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }

    /**
     * Fiyat aralığına göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByPriceRange(Double minPrice, Double maxPrice, Pageable pageable) {
        return productRepository.findByPriceRange(minPrice, maxPrice, pageable);
    }

    /**
     * Kategori ID'sine göre ürünleri getirir.
     */
    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    /**
     * Kategori ID'sine göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByCategoryId(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }

    /**
     * Mağaza adına göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByStoreName(String storeName, Pageable pageable) {
        var storeOpt = storeRepository.findByNameIgnoreCase(storeName);
        if (storeOpt.isEmpty()) return Page.empty(pageable);
        return productRepository.findByStore(storeOpt.get(), pageable);
    }
    
    @Override
    public Page<Product> getMostPopularProducts(Pageable pageable) {
        return productRepository.findMostPopularProducts(pageable);
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Ürün CRUD İşlemleri: Ürün oluşturma, okuma, güncelleme ve silme
     * 2. Ürün Arama: İsme ve açıklamaya göre arama yapma
     * 3. Kategori Filtreleme: Kategoriye göre ürün listeleme
     * 4. Fiyat Filtreleme: Fiyat aralığına göre ürün filtreleme
     * 5. Mağaza Filtreleme: Mağazaya göre ürün listeleme
     * 6. Popülerlik Sıralaması: En çok satan ürünleri getirme
     * 7. Sayfalama Desteği: Büyük veri setleri için sayfalama
     * 8. Hata Yönetimi: Ürün bulunamadığında uygun exception fırlatma
     * 
     * Bu servis sayesinde ürün yönetimi kapsamlı ve güvenli şekilde yapılabilir!
     */
} 