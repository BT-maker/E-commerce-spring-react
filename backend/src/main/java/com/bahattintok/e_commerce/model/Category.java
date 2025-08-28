package com.bahattintok.e_commerce.model;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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
     * Kategori ID'si (UUID)
     */
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    /**
     * Kategori adı (benzersiz ve zorunlu)
     */
    @Column(nullable = false, unique = true)
    private String name;
    
    /**
     * Kategori açıklaması (opsiyonel)
     */
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Kategori resim URL'i (opsiyonel)
     */
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    /**
     * Kategori öncelik sırası (yüksek sayı = yüksek öncelik)
     */
    @Column(nullable = true)
    private Integer priority = 0;
    
    /**
     * Id getter metodu
     */
    public String getId() {
        return id;
    }
    
    /**
     * Id setter metodu
     */
    public void setId(String id) {
        this.id = id;
    }
    
    /**
     * Name getter metodu
     */
    public String getName() {
        return name;
    }
    
    /**
     * Name setter metodu
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Kategori Yönetimi: Ürün kategorilerinin tanımlanması
     * 2. Benzersiz İsim: Her kategorinin benzersiz adı
     * 3. Ürün Sınıflandırma: Ürünlerin kategorilere göre gruplandırılması
     * 4. Veritabanı İlişkisi: Ürünler ile many-to-one ilişki
     * 5. UUID ID: Performans için String UUID kullanımı
     * 
     * Bu entity sayesinde ürünler kategorilere göre organize edilebilir!
     */
} 