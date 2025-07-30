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
 * Roller için JPA entity'si (veritabanı tablosu).
 */
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleEntity {
    /**
     * Rol ID'si (otomatik artan)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Rol adı (benzersiz ve zorunlu)
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Rol satıcı mı?
     */
    @Column(nullable = false)
    private boolean isSeller = false;
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Rol Yönetimi: Veritabanında kullanıcı rollerinin saklanması
     * 2. Dinamik Roller: Yeni rollerin sistem yöneticisi tarafından eklenebilmesi
     * 3. Satıcı Kontrolü: Rolün satıcı yetkisine sahip olup olmadığının kontrolü
     * 4. Benzersiz İsim: Her rolün benzersiz adı
     * 5. Veritabanı İlişkisi: Kullanıcılar ile many-to-one ilişki
     * 
     * Bu entity sayesinde kullanıcı rolleri esnek ve dinamik şekilde yönetilebilir!
     */
} 