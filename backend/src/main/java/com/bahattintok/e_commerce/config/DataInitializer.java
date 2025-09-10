package com.bahattintok.e_commerce.config;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.bahattintok.e_commerce.model.Campaign;
import com.bahattintok.e_commerce.model.Cart;
import com.bahattintok.e_commerce.model.CartItem;
import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.Favorite;
import com.bahattintok.e_commerce.model.Notification;
import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.OrderItem;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Review;
import com.bahattintok.e_commerce.model.RoleEntity;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.SystemSettings;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.CampaignRepository;
import com.bahattintok.e_commerce.repository.CartItemRepository;
import com.bahattintok.e_commerce.repository.CartRepository;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.CategoryRequestRepository;
import com.bahattintok.e_commerce.repository.FavoriteRepository;
import com.bahattintok.e_commerce.repository.NotificationRepository;
import com.bahattintok.e_commerce.repository.OrderItemRepository;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.ReviewRepository;
import com.bahattintok.e_commerce.repository.RoleRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.SystemSettingsRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.ElasticsearchService;

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

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CategoryRequestRepository categoryRequestRepository;

    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    @Autowired(required = false)
    private ElasticsearchService elasticsearchService;
    
    /**
     * SHA-256 hashleme fonksiyonu
     */
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    @Override
    public void run(String... args) throws Exception {
        // Eğer veriler zaten varsa ekleme
        if (categoryRepository.count() > 0) {
            log.info("Veriler zaten mevcut, test verileri eklenmeyecek.");
            return;
        }

        log.info("Test verileri ekleniyor...");

        // Rolleri ekle (eğer yoksa)
        RoleEntity userRole = roleRepository.findByName("USER")
            .orElseGet(() -> {
                RoleEntity role = new RoleEntity();
                role.setName("USER");
                role.setSeller(false);
                return roleRepository.save(role);
            });

        RoleEntity adminRole = roleRepository.findByName("ADMIN")
            .orElseGet(() -> {
                RoleEntity role = new RoleEntity();
                role.setName("ADMIN");
                role.setSeller(false);
                return roleRepository.save(role);
            });

        RoleEntity sellerRole = roleRepository.findByName("SELLER")
            .orElseGet(() -> {
                RoleEntity role = new RoleEntity();
                role.setName("SELLER");
                role.setSeller(true);
                return roleRepository.save(role);
            });

        // Kategorileri ekle
        Category elektronik = new Category();
        elektronik.setName("Elektronik");
        elektronik.setDescription("Elektronik ürünler kategorisi");
        elektronik.setImageUrl("https://via.placeholder.com/300x200?text=Elektronik");
        elektronik.setPriority(5); // En yüksek öncelik
        categoryRepository.save(elektronik);

        Category giyim = new Category();
        giyim.setName("Giyim");
        giyim.setDescription("Giyim ve aksesuar ürünleri");
        giyim.setImageUrl("https://via.placeholder.com/300x200?text=Giyim");
        giyim.setPriority(4);
        categoryRepository.save(giyim);

        Category ev = new Category();
        ev.setName("Ev & Yaşam");
        ev.setDescription("Ev ve yaşam ürünleri");
        ev.setImageUrl("https://via.placeholder.com/300x200?text=Ev+Yaşam");
        ev.setPriority(3);
        categoryRepository.save(ev);

        Category spor = new Category();
        spor.setName("Spor & Outdoor");
        spor.setDescription("Spor ve outdoor ürünleri");
        spor.setImageUrl("https://via.placeholder.com/300x200?text=Spor");
        spor.setPriority(2);
        categoryRepository.save(spor);

        Category kitap = new Category();
        kitap.setName("Kitap");
        kitap.setDescription("Kitap ve yayınlar");
        kitap.setImageUrl("https://via.placeholder.com/300x200?text=Kitap");
        kitap.setPriority(1); // En düşük öncelik
        categoryRepository.save(kitap);

        // Test kullanıcısı ekle (şifre: password)
        User testUser = new User();
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@example.com");
        testUser.setPhone("5551234567");
        testUser.setAddress1("Test Mahallesi, Test Sokak No:1, İstanbul");
        
        // "password" şifresini SHA-256 ile hash'le, sonra BCrypt ile hash'le (yeni sistem)
        String plainPassword = "password";
        String sha256Hash = hashPassword(plainPassword);
        String encodedPassword = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(sha256Hash);
        testUser.setPassword(encodedPassword);
        
        testUser.setRole(userRole);
        testUser.setRegistrationDate(LocalDateTime.now().minusDays(30));
        userRepository.save(testUser);

        // Test satıcısı ekle (şifre: password)
        User testSeller = new User();
        testSeller.setFirstName("Test");
        testSeller.setLastName("Seller");
        testSeller.setEmail("seller@example.com");
        testSeller.setPhone("5559876543");
        testSeller.setAddress1("Satıcı Mahallesi, Satıcı Sokak No:5, Ankara");
        
        // "password" şifresini SHA-256 ile hash'le, sonra BCrypt ile hash'le (yeni sistem)
        String sellerSha256Hash = hashPassword(plainPassword);
        String encodedSellerPassword = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(sellerSha256Hash);
        testSeller.setPassword(encodedSellerPassword);
        
        testSeller.setRole(sellerRole);
        testSeller.setRegistrationDate(LocalDateTime.now().minusDays(60));
        testSeller.setSellerStatus(com.bahattintok.e_commerce.model.enums.SellerStatus.APPROVED);
        userRepository.save(testSeller);

        // Test admin kullanıcısı ekle (şifre: password)
        User testAdmin = new User();
        testAdmin.setEmail("admin@example.com");
        testAdmin.setFirstName("Admin");
        testAdmin.setLastName("User");
        testAdmin.setPhone("5551112233");
        testAdmin.setAddress1("Admin Mahallesi, Admin Sokak No:10, İzmir");
        
        // "password" şifresini SHA-256 ile hash'le, sonra BCrypt ile hash'le (yeni sistem)
        String adminSha256Hash = hashPassword(plainPassword);
        String encodedAdminPassword = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(adminSha256Hash);
        testAdmin.setPassword(encodedAdminPassword);
        
        testAdmin.setRole(adminRole);
        testAdmin.setRegistrationDate(LocalDateTime.now().minusDays(90));
        userRepository.save(testAdmin);

        // Test mağazası ekle
        Store testStore = new Store();
        testStore.setName("Test Mağazası");
        testStore.setDescription("Kaliteli ürünler, uygun fiyatlar");
        testStore.setSeller(testSeller);
        testStore.setAddress("Mağaza Mahallesi, Mağaza Sokak No:15, İstanbul");
        testStore.setPhone("5554443322");
        testStore.setEmail("info@testmagaza.com");
        testStore.setWebsite("https://www.testmagaza.com");
        testStore.setLogo("https://via.placeholder.com/150x150?text=Logo");
        testStore.setBanner("https://via.placeholder.com/800x200?text=Banner");
        testStore.setCreatedAt(LocalDateTime.now().minusDays(45));
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
            createProduct("Sony WH-1000XM5", "Sony WH-1000XM5 Kablosuz Kulaklık", new BigDecimal("8999.99"), 35, elektronik.getId(), testStore.getId()),
            createProduct("Nike Spor Ayakkabı", "Nike Air Jordan 1, Erkek basketbol ayakkabısı", new BigDecimal("2499.99"), 45, spor.getId(), testStore.getId()),
            createProduct("Adidas Spor Çanta", "Adidas Spor Çantası, 30L", new BigDecimal("399.99"), 80, spor.getId(), testStore.getId())
        );

        productRepository.saveAll(products);

        // Elasticsearch'e ürünleri indexle
        if (elasticsearchService != null) {
            try {
                log.info("Ürünler Elasticsearch'e indexleniyor...");
                elasticsearchService.indexAllProducts();
                log.info("Elasticsearch indexing tamamlandı!");
            } catch (Exception e) {
                log.warn("Elasticsearch indexing hatası: {}", e.getMessage());
            }
        }

        // Test siparişleri ekle
        Order testOrder1 = new Order();
        testOrder1.setUser(testUser);
        testOrder1.setStatus("COMPLETED");
        testOrder1.setTotalPrice(new BigDecimal("29999.99"));
        testOrder1.setCreatedAt(LocalDateTime.now().minusDays(2));
        orderRepository.save(testOrder1);

        Order testOrder2 = new Order();
        testOrder2.setUser(testUser);
        testOrder2.setStatus("PENDING");
        testOrder2.setTotalPrice(new BigDecimal("24999.99"));
        testOrder2.setCreatedAt(LocalDateTime.now().minusDays(1));
        orderRepository.save(testOrder2);

        Order testOrder3 = new Order();
        testOrder3.setUser(testUser);
        testOrder3.setStatus("COMPLETED");
        testOrder3.setTotalPrice(new BigDecimal("39999.99"));
        testOrder3.setCreatedAt(LocalDateTime.now());
        orderRepository.save(testOrder3);

        // Test sipariş ürünleri ekle
        OrderItem orderItem1 = new OrderItem();
        orderItem1.setOrder(testOrder1);
        orderItem1.setProduct(products.get(0)); // iPhone 15
        orderItem1.setQuantity(1);
        orderItem1.setPrice(new BigDecimal("29999.99"));
        orderItemRepository.save(orderItem1);

        OrderItem orderItem2 = new OrderItem();
        orderItem2.setOrder(testOrder2);
        orderItem2.setProduct(products.get(1)); // Samsung Galaxy S24
        orderItem2.setQuantity(1);
        orderItem2.setPrice(new BigDecimal("24999.99"));
        orderItemRepository.save(orderItem2);

        OrderItem orderItem3 = new OrderItem();
        orderItem3.setOrder(testOrder3);
        orderItem3.setProduct(products.get(2)); // MacBook Air M2
        orderItem3.setQuantity(1);
        orderItem3.setPrice(new BigDecimal("39999.99"));
        orderItemRepository.save(orderItem3);

        // Test yorumları ekle
        Review review1 = new Review();
        review1.setUser(testUser);
        review1.setProduct(products.get(0)); // iPhone 15
        review1.setRating(5);
        review1.setComment("Harika bir telefon! Çok memnunum.");
        review1.setCreatedAt(LocalDateTime.now().minusDays(1));
        reviewRepository.save(review1);

        Review review2 = new Review();
        review2.setUser(testUser);
        review2.setProduct(products.get(1)); // Samsung Galaxy S24
        review2.setRating(4);
        review2.setComment("Güzel telefon ama biraz pahalı.");
        review2.setCreatedAt(LocalDateTime.now().minusDays(2));
        reviewRepository.save(review2);

        Review review3 = new Review();
        review3.setUser(testUser);
        review3.setProduct(products.get(2)); // MacBook Air M2
        review3.setRating(5);
        review3.setComment("Mükemmel performans! Tavsiye ederim.");
        review3.setCreatedAt(LocalDateTime.now().minusDays(3));
        reviewRepository.save(review3);

        // Test sepetleri ekle
        Cart userCart = new Cart();
        userCart.setUser(testUser);
        cartRepository.save(userCart);

        // Test sepet ürünleri ekle
        CartItem cartItem1 = new CartItem();
        cartItem1.setCart(userCart);
        cartItem1.setProduct(products.get(3)); // Nike Air Max
        cartItem1.setQuantity(2);
        cartItemRepository.save(cartItem1);

        CartItem cartItem2 = new CartItem();
        cartItem2.setCart(userCart);
        cartItem2.setProduct(products.get(4)); // Adidas T-Shirt
        cartItem2.setQuantity(3);
        cartItemRepository.save(cartItem2);

        // Test favoriler ekle
        Favorite favorite1 = new Favorite();
        favorite1.setUser(testUser);
        favorite1.setProduct(products.get(0)); // iPhone 15
        favorite1.setCreatedAt(LocalDateTime.now().minusDays(5));
        favoriteRepository.save(favorite1);

        Favorite favorite2 = new Favorite();
        favorite2.setUser(testUser);
        favorite2.setProduct(products.get(2)); // MacBook Air M2
        favorite2.setCreatedAt(LocalDateTime.now().minusDays(3));
        favoriteRepository.save(favorite2);

        // Test kampanyalar ekle
        Campaign campaign1 = new Campaign();
        campaign1.setName("Elektronik İndirimi");
        campaign1.setDescription("Tüm elektronik ürünlerde %15 indirim");
        campaign1.setCampaignType("category");
        campaign1.setTargetId(elektronik.getId());
        campaign1.setDiscountType("percentage");
        campaign1.setDiscountValue(new BigDecimal("15"));
        campaign1.setStartDate(LocalDateTime.now().minusDays(10));
        campaign1.setEndDate(LocalDateTime.now().plusDays(20));
        campaign1.setActive(true);
        campaign1.setStore(testStore);
        campaign1.setCreatedAt(LocalDateTime.now().minusDays(10));
        campaign1.setUpdatedAt(LocalDateTime.now().minusDays(10));
        campaignRepository.save(campaign1);

        Campaign campaign2 = new Campaign();
        campaign2.setName("iPhone 15 Özel Fiyat");
        campaign2.setDescription("iPhone 15'te 1000 TL indirim");
        campaign2.setCampaignType("product");
        campaign2.setTargetId(products.get(0).getId());
        campaign2.setDiscountType("fixed");
        campaign2.setDiscountValue(new BigDecimal("1000"));
        campaign2.setStartDate(LocalDateTime.now().minusDays(5));
        campaign2.setEndDate(LocalDateTime.now().plusDays(15));
        campaign2.setActive(true);
        campaign2.setStore(testStore);
        campaign2.setCreatedAt(LocalDateTime.now().minusDays(5));
        campaign2.setUpdatedAt(LocalDateTime.now().minusDays(5));
        campaignRepository.save(campaign2);

        // Test bildirimleri ekle
        Notification notification1 = new Notification();
        notification1.setTitle("Sipariş Durumu Güncellendi");
        notification1.setMessage("Siparişiniz #" + testOrder1.getId() + " tamamlandı.");
        notification1.setType("ORDER_STATUS");
        notification1.setRead(false);
        notification1.setUser(testUser);
        notification1.setRelatedEntityId(Long.valueOf(testOrder1.getId()));
        notification1.setRelatedEntityType("ORDER");
        notification1.setCreatedAt(LocalDateTime.now().minusHours(2));
        notificationRepository.save(notification1);

        Notification notification2 = new Notification();
        notification2.setTitle("Yeni Kampanya");
        notification2.setMessage("Elektronik ürünlerde %15 indirim başladı!");
        notification2.setType("PROMOTION");
        notification2.setRead(false);
        notification2.setUser(testUser);
        notification2.setCreatedAt(LocalDateTime.now().minusDays(1));
        notificationRepository.save(notification2);

        Notification notification3 = new Notification();
        notification3.setTitle("Hoş Geldiniz");
        notification3.setMessage("E-ticaret sitemize hoş geldiniz!");
        notification3.setType("SYSTEM");
        notification3.setRead(true);
        notification3.setUser(testUser);
        notification3.setCreatedAt(LocalDateTime.now().minusDays(30));
        notificationRepository.save(notification3);

        // Test kategori istekleri ekle
        CategoryRequest categoryRequest1 = new CategoryRequest();
        categoryRequest1.setCategoryName("Oyuncak");
        categoryRequest1.setDescription("Çocuk oyuncakları kategorisi");
        categoryRequest1.setStatus(CategoryRequest.CategoryRequestStatus.PENDING);
        categoryRequest1.setSeller(testSeller);
        categoryRequest1.setCreatedAt(LocalDateTime.now().minusDays(7));
        categoryRequestRepository.save(categoryRequest1);

        CategoryRequest categoryRequest2 = new CategoryRequest();
        categoryRequest2.setCategoryName("Kozmetik");
        categoryRequest2.setDescription("Kozmetik ve kişisel bakım ürünleri");
        categoryRequest2.setStatus(CategoryRequest.CategoryRequestStatus.APPROVED);
        categoryRequest2.setSeller(testSeller);
        categoryRequest2.setAdmin(testAdmin);
        categoryRequest2.setCreatedAt(LocalDateTime.now().minusDays(14));
        categoryRequest2.setProcessedAt(LocalDateTime.now().minusDays(10));
        categoryRequestRepository.save(categoryRequest2);

        CategoryRequest categoryRequest3 = new CategoryRequest();
        categoryRequest3.setCategoryName("Bahçe");
        categoryRequest3.setDescription("Bahçe ve peyzaj ürünleri");
        categoryRequest3.setStatus(CategoryRequest.CategoryRequestStatus.REJECTED);
        categoryRequest3.setRejectionReason("Bu kategori zaten mevcut");
        categoryRequest3.setSeller(testSeller);
        categoryRequest3.setAdmin(testAdmin);
        categoryRequest3.setCreatedAt(LocalDateTime.now().minusDays(21));
        categoryRequest3.setProcessedAt(LocalDateTime.now().minusDays(18));
        categoryRequestRepository.save(categoryRequest3);

        // Test sistem ayarları ekle
        List<SystemSettings> systemSettings = Arrays.asList(
            createSystemSetting("site_name", "E-Ticaret Platformu", "Site adı", "GENERAL", "STRING", "E-Ticaret Platformu", true),
            createSystemSetting("site_description", "Güvenilir e-ticaret platformu", "Site açıklaması", "GENERAL", "STRING", "Güvenilir e-ticaret platformu", true),
            createSystemSetting("contact_email", "info@eticaret.com", "İletişim e-posta adresi", "GENERAL", "STRING", "info@eticaret.com", true),
            createSystemSetting("contact_phone", "5551234567", "İletişim telefon numarası", "GENERAL", "STRING", "5551234567", true),
            createSystemSetting("maintenance_mode", "false", "Bakım modu", "SYSTEM", "BOOLEAN", "false", true),
            createSystemSetting("max_products_per_page", "20", "Sayfa başına maksimum ürün sayısı", "SYSTEM", "NUMBER", "20", true),
            createSystemSetting("auto_approve_sellers", "false", "Satıcıları otomatik onayla", "SYSTEM", "BOOLEAN", "false", true),
            createSystemSetting("commission_rate", "5.0", "Platform komisyon oranı (%)", "FINANCIAL", "NUMBER", "5.0", true),
            createSystemSetting("min_order_amount", "50.0", "Minimum sipariş tutarı", "FINANCIAL", "NUMBER", "50.0", true),
            createSystemSetting("free_shipping_threshold", "200.0", "Ücretsiz kargo eşiği", "FINANCIAL", "NUMBER", "200.0", true),
            createSystemSetting("smtp_host", "smtp.gmail.com", "SMTP sunucu adresi", "EMAIL", "STRING", "smtp.gmail.com", true),
            createSystemSetting("smtp_port", "587", "SMTP port", "EMAIL", "NUMBER", "587", true),
            createSystemSetting("smtp_username", "noreply@eticaret.com", "SMTP kullanıcı adı", "EMAIL", "STRING", "noreply@eticaret.com", true),
            createSystemSetting("smtp_password", "password123", "SMTP şifresi", "EMAIL", "STRING", "password123", true),
            createSystemSetting("email_verification_required", "true", "E-posta doğrulama gerekli", "SECURITY", "BOOLEAN", "true", true),
            createSystemSetting("max_login_attempts", "5", "Maksimum giriş denemesi", "SECURITY", "NUMBER", "5", true),
            createSystemSetting("session_timeout", "3600", "Oturum zaman aşımı (saniye)", "SECURITY", "NUMBER", "3600", true)
        );

        systemSettingsRepository.saveAll(systemSettings);

        log.info("Test verileri başarıyla eklendi!");
        log.info("Eklenen veriler: {} kategori, {} ürün, {} kullanıcı, {} mağaza, {} sipariş, {} yorum, {} sepet, {} favori, {} kampanya, {} bildirim, {} kategori isteği, {} sistem ayarı", 
                categoryRepository.count(), productRepository.count(), userRepository.count(), 
                storeRepository.count(), orderRepository.count(), reviewRepository.count(),
                cartRepository.count(), favoriteRepository.count(), campaignRepository.count(),
                notificationRepository.count(), categoryRequestRepository.count(), systemSettingsRepository.count());
        log.info("Test kullanıcıları:");
        log.info("- Normal Kullanıcı: test@example.com / password");
        log.info("- Satıcı: seller@example.com / password");
        log.info("- Admin: admin@example.com / password");
    }

    private Product createProduct(String name, String description, BigDecimal price, int stock, String categoryId, String storeId) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategoryId(categoryId);
        product.setStoreId(storeId);
        
        // Eski imageUrl alanı (geriye uyumluluk için)
        product.setImageUrl("https://picsum.photos/300/300?random=" + name.hashCode());
        
        // Yeni çoklu resim alanları - Gerçekçi resimler
        product.setImageUrl1("https://picsum.photos/300/300?random=" + (name.hashCode() + 1));
        product.setImageUrl2("https://picsum.photos/300/300?random=" + (name.hashCode() + 2));
        product.setImageUrl3("https://picsum.photos/300/300?random=" + (name.hashCode() + 3));
        product.setImageUrl4("https://picsum.photos/300/300?random=" + (name.hashCode() + 4));
        product.setImageUrl5("https://picsum.photos/300/300?random=" + (name.hashCode() + 5));
        
        product.setStatus("ACTIVE");
        return product;
    }

    private SystemSettings createSystemSetting(String key, String value, String description, String category, String type, String defaultValue, boolean editable) {
        SystemSettings setting = new SystemSettings();
        setting.setKey(key);
        setting.setValue(value);
        setting.setDescription(description);
        setting.setCategory(category);
        setting.setType(type);
        setting.setDefaultValue(defaultValue);
        setting.setEditable(editable);
        setting.setCreatedAt(LocalDateTime.now());
        setting.setUpdatedAt(LocalDateTime.now());
        return setting;
    }
} 