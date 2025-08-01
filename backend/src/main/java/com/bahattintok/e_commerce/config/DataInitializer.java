package com.bahattintok.e_commerce.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.RoleEntity;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.RoleRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Uygulama başladığında test verilerini otomatik olarak ekler.
 */
@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Eğer veriler zaten varsa ekleme
        if (categoryRepository.count() > 0) {
            log.info("Veriler zaten mevcut, test verileri eklenmeyecek.");
            return;
        }

        log.info("Test verileri ekleniyor...");

        // Rolleri ekle
        RoleEntity userRole = new RoleEntity();
        userRole.setName("USER");
        userRole.setSeller(false);
        roleRepository.save(userRole);

        RoleEntity adminRole = new RoleEntity();
        adminRole.setName("ADMIN");
        adminRole.setSeller(false);
        roleRepository.save(adminRole);

        RoleEntity sellerRole = new RoleEntity();
        sellerRole.setName("SELLER");
        sellerRole.setSeller(true);
        roleRepository.save(sellerRole);

        // Kategorileri ekle
        Category elektronik = new Category();
        elektronik.setName("Elektronik");
        categoryRepository.save(elektronik);

        Category giyim = new Category();
        giyim.setName("Giyim");
        categoryRepository.save(giyim);

        Category kitap = new Category();
        kitap.setName("Kitap");
        categoryRepository.save(kitap);

        Category ev = new Category();
        ev.setName("Ev & Yaşam");
        categoryRepository.save(ev);

        // Test kullanıcısı ekle
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"); // password
        testUser.setRole(userRole);
        userRepository.save(testUser);

        // Test satıcısı ekle
        User testSeller = new User();
        testSeller.setUsername("testseller");
        testSeller.setEmail("seller@example.com");
        testSeller.setPassword("$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"); // password
        testSeller.setRole(sellerRole);
        userRepository.save(testSeller);

        // Test mağazası ekle
        Store testStore = new Store();
        testStore.setName("Test Mağazası");
        testStore.setSeller(testSeller);
        storeRepository.save(testStore);

        // Ürünleri ekle
        List<Product> products = Arrays.asList(
            createProduct("iPhone 15", "Apple iPhone 15 128GB, A16 Bionic çip", new BigDecimal("29999.99"), 50, elektronik.getId(), testStore.getId()),
            createProduct("Samsung Galaxy S24", "Samsung Galaxy S24 256GB, Snapdragon 8 Gen 3", new BigDecimal("24999.99"), 30, elektronik.getId(), testStore.getId()),
            createProduct("MacBook Air M2", "Apple MacBook Air M2 13.6 inç, 8GB RAM, 256GB SSD", new BigDecimal("39999.99"), 20, elektronik.getId(), testStore.getId()),
            createProduct("Nike Air Max", "Nike Air Max 270, Erkek spor ayakkabı", new BigDecimal("1299.99"), 100, giyim.getId(), testStore.getId()),
            createProduct("Adidas T-Shirt", "Adidas Erkek pamuklu t-shirt", new BigDecimal("299.99"), 200, giyim.getId(), testStore.getId()),
            createProduct("Harry Potter Set", "Harry Potter 7 Kitap Seti", new BigDecimal("899.99"), 25, kitap.getId(), testStore.getId()),
            createProduct("Lord of the Rings", "Yüzüklerin Efendisi 3 Kitap Seti", new BigDecimal("699.99"), 15, kitap.getId(), testStore.getId()),
            createProduct("Philips Airfryer", "Philips Airfryer XXL, 6.2L", new BigDecimal("2499.99"), 40, ev.getId(), testStore.getId()),
            createProduct("IKEA Masa", "IKEA Çalışma Masası, Beyaz", new BigDecimal("899.99"), 60, ev.getId(), testStore.getId()),
            createProduct("Sony WH-1000XM5", "Sony WH-1000XM5 Kablosuz Kulaklık", new BigDecimal("8999.99"), 35, elektronik.getId(), testStore.getId())
        );

        productRepository.saveAll(products);

        log.info("Test verileri başarıyla eklendi!");
        log.info("Eklenen veriler: {} kategori, {} ürün, {} kullanıcı, {} mağaza", 
                categoryRepository.count(), productRepository.count(), userRepository.count(), storeRepository.count());
    }

    private Product createProduct(String name, String description, BigDecimal price, int stock, String categoryId, String storeId) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategoryId(categoryId);
        product.setStoreId(storeId);
        product.setImageUrl("https://via.placeholder.com/300x300?text=" + name.replace(" ", "+"));
        return product;
    }
} 