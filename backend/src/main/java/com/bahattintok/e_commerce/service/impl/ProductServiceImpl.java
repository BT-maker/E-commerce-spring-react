package com.bahattintok.e_commerce.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.dto.ProductRequest;
import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.service.ElasticsearchService;
import com.bahattintok.e_commerce.service.ProductService;

import lombok.RequiredArgsConstructor;

/**
 * Ürün işlemlerini yöneten servis implementasyonu.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    
    @Autowired(required = false)
    private ElasticsearchService elasticsearchService;
    
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
    public Product getProductById(String id) {
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
        
        Product savedProduct = productRepository.save(product);
        
        // Elasticsearch'e indexle (eğer varsa)
        if (elasticsearchService != null) {
            try {
                elasticsearchService.indexProduct(savedProduct);
            } catch (Exception e) {
                // Elasticsearch hatası ürün oluşturmayı engellemez
                System.err.println("Elasticsearch indexing failed: " + e.getMessage());
            }
        }
        
        return savedProduct;
    }
    
    /**
     * Ürünü günceller.
     */
    @Override
    public Product updateProduct(String id, ProductRequest request) {
        Product product = getProductById(id);
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        
        Product updatedProduct = productRepository.save(product);
        
        // Elasticsearch'i güncelle (eğer varsa)
        if (elasticsearchService != null) {
            try {
                elasticsearchService.updateProduct(updatedProduct);
            } catch (Exception e) {
                // Elasticsearch hatası ürün güncellemeyi engellemez
                System.err.println("Elasticsearch update failed: " + e.getMessage());
            }
        }
        
        return updatedProduct;
    }
    
    /**
     * Ürünü siler.
     */
    @Override
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        
        // Önce Elasticsearch'ten sil (eğer varsa)
        if (elasticsearchService != null) {
            try {
                elasticsearchService.deleteProduct(id);
            } catch (Exception e) {
                // Elasticsearch hatası ürün silmeyi engellemez
                System.err.println("Elasticsearch delete failed: " + e.getMessage());
            }
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
    public List<Product> getProductsByCategoryId(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    /**
     * Kategori ID'sine göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByCategoryId(String categoryId, Pageable pageable) {
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