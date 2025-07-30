package com.bahattintok.e_commerce.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.repository.StoreRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@Tag(name = "Stores", description = "Store public APIs")
public class StoreController {
    private final StoreRepository storeRepository;

    @GetMapping("/{name}")
    @Operation(summary = "Get store by name", description = "Mağaza adına göre mağaza bilgisini döner")
    public ResponseEntity<?> getStoreByName(@PathVariable String name) {
        var storeOpt = storeRepository.findByNameIgnoreCase(name);
        if (storeOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "Mağaza bulunamadı"));
        var store = storeOpt.get();
        Map<String, Object> dto = Map.of(
            "id", store.getId(),
            "name", store.getName()
        );
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Mağaza Bilgisi: Mağaza adına göre mağaza bilgisini getirir (GET /api/stores/{name})
     * 
     * Bu controller sayesinde kullanıcılar mağaza bilgilerine erişebilir!
     */
} 