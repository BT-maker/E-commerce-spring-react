package com.bahattintok.e_commerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ürün kategorilerini temsil eden JPA entity'si.
 */
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    /**
     * Kategori ID'si (otomatik artan)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Kategori adı (benzersiz ve zorunlu)
     */
    @Column(nullable = false, unique = true)
    private String name;
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Kategori Yönetimi: Ürün kategorilerinin tanımlanması
     * 2. Benzersiz İsim: Her kategorinin benzersiz adı
     * 3. Ürün Sınıflandırma: Ürünlerin kategorilere göre gruplandırılması
     * 4. Veritabanı İlişkisi: Ürünler ile many-to-one ilişki
     * 
     * Bu entity sayesinde ürünler kategorilere göre organize edilebilir!
     */
} 