package com.bahattintok.e_commerce.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.event.OrderPlacedEvent;
import com.bahattintok.e_commerce.model.Cart;
import com.bahattintok.e_commerce.model.CartItem;
import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.OrderItem;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.CartRepository;
import com.bahattintok.e_commerce.repository.OrderItemRepository;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public Order createOrder(User user) {
        Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Sepet bulunamadı!"));
        if (cart.getItems().isEmpty()) throw new RuntimeException("Sepetiniz boş!");

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus("COMPLETED");
        order.setItems(new ArrayList<>());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            int newStock = product.getStock() - cartItem.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException(product.getName() + " için stok yetersiz!");
            }
            product.setStock(newStock);
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.getItems().add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        order.setTotalPrice(total);
        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(order.getItems());
        
        // Sipariş onay email'i gönder
        eventPublisher.publishEvent(new OrderPlacedEvent(this, savedOrder));
        
        // Sepeti temizle
        cart.getItems().clear();
        cartRepository.save(cart);
        return savedOrder;
    }

    @Override
    @Transactional
    public Order createOrder(User user, List<Map<String, Object>> items, Double total) {
        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Sipariş öğeleri boş olamaz!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus("COMPLETED");
        order.setItems(new ArrayList<>());
        order.setTotalPrice(BigDecimal.valueOf(total));

        for (Map<String, Object> itemData : items) {
            String productId = itemData.get("productId").toString();
            Integer quantity = ((Number) itemData.get("quantity")).intValue();
            BigDecimal price = BigDecimal.valueOf(((Number) itemData.get("price")).doubleValue());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + productId));

            // Stok kontrolü
            int newStock = product.getStock() - quantity;
            if (newStock < 0) {
                throw new RuntimeException(product.getName() + " için stok yetersiz!");
            }

            // Stok güncelle
            product.setStock(newStock);
            productRepository.save(product);

            // OrderItem oluştur
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(price);
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(order.getItems());
        
        // Sipariş onay email'i gönder
        eventPublisher.publishEvent(new OrderPlacedEvent(this, savedOrder));

        // Sepeti temizle
        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserWithItemsAndProducts(user);
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Sipariş Oluşturma: Sepetten sipariş oluşturma işlemi
     * 2. Stok Kontrolü: Sipariş sırasında stok yeterliliği kontrolü
     * 3. Stok Güncelleme: Sipariş sonrası stok miktarını azaltma
     * 4. Toplam Hesaplama: Sipariş toplam tutarını hesaplama
     * 5. Sepet Temizleme: Sipariş sonrası sepeti temizleme
     * 6. Sipariş Geçmişi: Kullanıcının geçmiş siparişlerini getirme
     * 7. Transaction Yönetimi: Veritabanı işlemlerinin atomik yapılması
     * 
     * Bu servis sayesinde sipariş işlemleri güvenli ve tutarlı şekilde yönetilebilir!
     */
} 