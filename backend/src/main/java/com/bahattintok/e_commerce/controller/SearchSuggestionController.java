package com.bahattintok.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.service.SearchSuggestionService;

import lombok.RequiredArgsConstructor;

/**
 * Arama önerileri için REST API endpoint'leri.
 * Kullanıcı yazarken otomatik öneriler sunar.
 */
@RestController
@RequestMapping("/api/search-suggestions")
@RequiredArgsConstructor
public class SearchSuggestionController {
    
    private final SearchSuggestionService searchSuggestionService;
    
    /**
     * Ürün adı önerileri getirir.
     * Kullanıcı yazmaya başladığında benzer ürün adlarını önerir.
     */
    @GetMapping("/product-names")
    public ResponseEntity<List<String>> getProductNameSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        
        List<String> suggestions = searchSuggestionService.getProductNameSuggestions(query, limit);
        return ResponseEntity.ok(suggestions);
    }
    
    /**
     * Kategori önerileri getirir.
     * Kullanıcı kategori araması yaparken öneriler sunar.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategorySuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        
        List<String> suggestions = searchSuggestionService.getCategorySuggestions(query, limit);
        return ResponseEntity.ok(suggestions);
    }
    
    /**
     * Mağaza önerileri getirir.
     * Kullanıcı mağaza araması yaparken öneriler sunar.
     */
    @GetMapping("/stores")
    public ResponseEntity<List<String>> getStoreSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        
        List<String> suggestions = searchSuggestionService.getStoreSuggestions(query, limit);
        return ResponseEntity.ok(suggestions);
    }
    
    /**
     * Genel arama önerileri getirir.
     * Ürün adı, kategori ve mağaza önerilerini birleştirir.
     */
    @GetMapping("/general")
    public ResponseEntity<List<String>> getGeneralSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<String> suggestions = searchSuggestionService.getGeneralSuggestions(query, limit);
        return ResponseEntity.ok(suggestions);
    }
    
    /**
     * Popüler arama terimleri getirir.
     * En çok aranan terimleri listeler.
     */
    @GetMapping("/popular")
    public ResponseEntity<List<String>> getPopularSearchTerms(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<String> popularTerms = searchSuggestionService.getPopularSearchTerms(limit);
        return ResponseEntity.ok(popularTerms);
    }
} 