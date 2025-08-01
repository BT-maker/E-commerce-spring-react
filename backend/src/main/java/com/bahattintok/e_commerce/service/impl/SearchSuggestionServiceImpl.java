package com.bahattintok.e_commerce.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.service.SearchSuggestionService;

import lombok.RequiredArgsConstructor;

/**
 * Arama önerileri servisi implementasyonu.
 * Kullanıcı yazarken otomatik öneriler sunar.
 */
@Service
@RequiredArgsConstructor
public class SearchSuggestionServiceImpl implements SearchSuggestionService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    
    @Override
    public List<String> getProductNameSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String searchQuery = query.toLowerCase().trim();
        
        return productRepository.findAll().stream()
                .map(product -> product.getName())
                .filter(name -> name != null && name.toLowerCase().contains(searchQuery))
                .distinct()
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> getCategorySuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String searchQuery = query.toLowerCase().trim();
        
        return categoryRepository.findAll().stream()
                .map(category -> category.getName())
                .filter(name -> name != null && name.toLowerCase().contains(searchQuery))
                .distinct()
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> getStoreSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String searchQuery = query.toLowerCase().trim();
        
        return storeRepository.findAll().stream()
                .map(store -> store.getName())
                .filter(name -> name != null && name.toLowerCase().contains(searchQuery))
                .distinct()
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> getGeneralSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        List<String> suggestions = new ArrayList<>();
        
        // Ürün adı önerileri (öncelikli)
        List<String> productSuggestions = getProductNameSuggestions(query, limit / 2);
        suggestions.addAll(productSuggestions);
        
        // Kategori önerileri
        if (suggestions.size() < limit) {
            List<String> categorySuggestions = getCategorySuggestions(query, limit - suggestions.size());
            suggestions.addAll(categorySuggestions);
        }
        
        // Mağaza önerileri
        if (suggestions.size() < limit) {
            List<String> storeSuggestions = getStoreSuggestions(query, limit - suggestions.size());
            suggestions.addAll(storeSuggestions);
        }
        
        return suggestions.stream()
                .distinct()
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> getPopularSearchTerms(int limit) {
        // Şimdilik sabit popüler terimler döndürüyoruz
        // İleride arama geçmişi tablosu eklenebilir
        List<String> popularTerms = new ArrayList<>();
        popularTerms.add("telefon");
        popularTerms.add("laptop");
        popularTerms.add("giyim");
        popularTerms.add("elektronik");
        popularTerms.add("kitap");
        popularTerms.add("spor");
        popularTerms.add("ev");
        popularTerms.add("oyun");
        popularTerms.add("kozmetik");
        popularTerms.add("sağlık");
        
        return popularTerms.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
} 