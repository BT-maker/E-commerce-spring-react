package com.bahattintok.e_commerce.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bahattintok.e_commerce.dto.AddressRequest;
import com.bahattintok.e_commerce.dto.CheckoutRequest;
import com.bahattintok.e_commerce.dto.CreditCardRequest;
import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.OrderItem;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.CheckoutService;

/**
 * Teslimat ve ödeme işlemleri için service implementasyonu
 */
@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Map<String, Object> updateUserAddress(String userEmail, AddressRequest addressRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Kullanıcı bulunamadı");
                return response;
            }
            
            User user = userOpt.get();
            user.setAddress1(addressRequest.getAddress1());
            user.setAddress2(addressRequest.getAddress2());
            user.setPhone(addressRequest.getPhone());
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Adres bilgileri güncellendi");
            response.put("address", addressRequest);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Adres güncellenirken hata oluştu: " + e.getMessage());
        }
        
        return response;
    }

    @Override
    public Map<String, Object> getUserAddress(String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Kullanıcı bulunamadı");
                return response;
            }
            
            User user = userOpt.get();
            Map<String, Object> address = new HashMap<>();
            address.put("address1", user.getAddress1());
            address.put("address2", user.getAddress2());
            address.put("phone", user.getPhone());
            
            response.put("success", true);
            response.put("address", address);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Adres bilgileri alınırken hata oluştu: " + e.getMessage());
        }
        
        return response;
    }

    @Override
    public Map<String, Object> getDeliveryOptions() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Map<String, Object>> options = new ArrayList<>();
            
            // Standart teslimat
            Map<String, Object> standard = new HashMap<>();
            standard.put("id", "STANDARD");
            standard.put("name", "Standart Teslimat");
            standard.put("description", "3-5 iş günü içinde teslimat");
            standard.put("price", 0.0);
            standard.put("estimatedDays", "3-5 iş günü");
            options.add(standard);
            
            // Hızlı teslimat
            Map<String, Object> express = new HashMap<>();
            express.put("id", "EXPRESS");
            express.put("name", "Hızlı Teslimat");
            express.put("description", "1-2 iş günü içinde teslimat");
            express.put("price", 15.0);
            express.put("estimatedDays", "1-2 iş günü");
            options.add(express);
            
            response.put("success", true);
            response.put("options", options);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Teslimat seçenekleri alınırken hata oluştu: " + e.getMessage());
        }
        
        return response;
    }

    @Override
    public Map<String, Object> getPaymentMethods() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Map<String, Object>> methods = new ArrayList<>();
            
            // Kredi kartı
            Map<String, Object> creditCard = new HashMap<>();
            creditCard.put("id", "CREDIT_CARD");
            creditCard.put("name", "Kredi Kartı");
            creditCard.put("description", "Güvenli kredi kartı ile ödeme");
            creditCard.put("icon", "credit-card");
            methods.add(creditCard);
            
            // Banka havalesi
            Map<String, Object> bankTransfer = new HashMap<>();
            bankTransfer.put("id", "BANK_TRANSFER");
            bankTransfer.put("name", "Banka Havalesi");
            bankTransfer.put("description", "EFT/Havale ile ödeme");
            bankTransfer.put("icon", "bank");
            methods.add(bankTransfer);
            
            // Kapıda ödeme
            Map<String, Object> cashOnDelivery = new HashMap<>();
            cashOnDelivery.put("id", "CASH_ON_DELIVERY");
            cashOnDelivery.put("name", "Kapıda Ödeme");
            cashOnDelivery.put("description", "Teslimat sırasında nakit ödeme");
            cashOnDelivery.put("icon", "cash");
            methods.add(cashOnDelivery);
            
            response.put("success", true);
            response.put("methods", methods);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Ödeme yöntemleri alınırken hata oluştu: " + e.getMessage());
        }
        
        return response;
    }

    /**
     * Kredi kartı bilgilerini doğrular
     */
    private String validateCreditCard(CreditCardRequest creditCard) {
        if (creditCard == null) {
            return "Kredi kartı bilgileri gerekli";
        }
        
        // Kart numarası kontrolü
        if (creditCard.getCardNumber() == null || creditCard.getCardNumber().replaceAll("\\s", "").length() < 13) {
            return "Geçerli bir kart numarası giriniz";
        }
        
        // Kart sahibi kontrolü
        if (creditCard.getCardHolder() == null || creditCard.getCardHolder().trim().length() < 3) {
            return "Kart sahibi adını giriniz";
        }
        
        // Son kullanma tarihi kontrolü
        if (creditCard.getExpiryMonth() == null || creditCard.getExpiryMonth().length() != 5) {
            return "Geçerli bir son kullanma tarihi giriniz";
        }
        
        try {
            String[] expiryParts = creditCard.getExpiryMonth().split("/");
            if (expiryParts.length != 2) {
                return "Son kullanma tarihi formatı hatalı (AA/YY)";
            }
            
            int month = Integer.parseInt(expiryParts[0]);
            int year = Integer.parseInt(expiryParts[1]);
            
            if (month < 1 || month > 12) {
                return "Geçerli bir ay giriniz (01-12)";
            }
            
            // Tarih kontrolü
            LocalDateTime now = LocalDateTime.now();
            int currentYear = now.getYear() % 100;
            int currentMonth = now.getMonthValue();
            
            if (year < currentYear || (year == currentYear && month < currentMonth)) {
                return "Kartınızın son kullanma tarihi geçmiş";
            }
            
        } catch (NumberFormatException e) {
            return "Son kullanma tarihi formatı hatalı";
        }
        
        // CVV kontrolü
        if (creditCard.getCvv() == null || creditCard.getCvv().length() < 3) {
            return "Geçerli bir güvenlik kodu giriniz";
        }
        
        return null; // Geçerli
    }

    /**
     * Kredi kartı ödeme işlemini simüle eder
     */
    private boolean processCreditCardPayment(CreditCardRequest creditCard, double amount) {
        // Burada gerçek bir ödeme işlemi entegrasyonu yapılabilir
        // Şimdilik sadece simülasyon yapıyoruz
        
        try {
            // Kart numarasının son 4 hanesi kontrol edilir
            String lastFourDigits = creditCard.getCardNumber().replaceAll("\\s", "").substring(
                creditCard.getCardNumber().replaceAll("\\s", "").length() - 4
            );
            
            // Test kartları için özel kontrol
            if (lastFourDigits.equals("0000")) {
                throw new RuntimeException("Test kartı - ödeme reddedildi");
            }
            
            // Simüle edilmiş işlem gecikmesi
            Thread.sleep(1000);
            
            // Başarılı ödeme simülasyonu
            return true;
            
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Map<String, Object> completeOrder(String userEmail, CheckoutRequest checkoutRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Kullanıcı bulunamadı");
                return response;
            }
            
            User user = userOpt.get();
            
            // Kredi kartı ödeme kontrolü
            if ("CREDIT_CARD".equals(checkoutRequest.getPaymentMethod())) {
                String cardValidationError = validateCreditCard(checkoutRequest.getCreditCard());
                if (cardValidationError != null) {
                    response.put("success", false);
                    response.put("message", cardValidationError);
                    return response;
                }
                
                // Kredi kartı ödeme işlemi
                boolean paymentSuccess = processCreditCardPayment(
                    checkoutRequest.getCreditCard(), 
                    checkoutRequest.getTotal().doubleValue()
                );
                
                if (!paymentSuccess) {
                    response.put("success", false);
                    response.put("message", "Ödeme işlemi başarısız. Lütfen kart bilgilerinizi kontrol edin.");
                    return response;
                }
            }
            
            // Sipariş oluştur
            Order order = new Order();
            order.setUser(user);
            order.setTotalPrice(checkoutRequest.getTotal());
            order.setStatus("BEKLİYOR");
            order.setCreatedAt(LocalDateTime.now());
            
            // Sipariş öğelerini oluştur
            List<OrderItem> orderItems = new ArrayList<>();
            for (var item : checkoutRequest.getItems()) {
                Optional<Product> productOpt = productRepository.findById(item.getProductId());
                if (productOpt.isPresent()) {
                    Product product = productOpt.get();
                    
                    // Stok kontrolü
                    if (product.getStock() < item.getQuantity()) {
                        response.put("success", false);
                        response.put("message", product.getName() + " ürünü için yeterli stok bulunmuyor");
                        return response;
                    }
                    
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setPrice(item.getPrice());
                    
                    orderItems.add(orderItem);
                    
                    // Stok güncelle
                    product.setStock(product.getStock() - item.getQuantity());
                    productRepository.save(product);
                }
            }
            
            order.setItems(orderItems);
            Order savedOrder = orderRepository.save(order);
            
            response.put("success", true);
            response.put("message", "Sipariş başarıyla oluşturuldu");
            response.put("orderId", savedOrder.getId());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Sipariş oluşturulurken hata oluştu: " + e.getMessage());
        }
        
        return response;
    }
}
