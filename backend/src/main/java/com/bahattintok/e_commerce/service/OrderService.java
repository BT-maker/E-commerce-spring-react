package com.bahattintok.e_commerce.service;

import java.util.List;
import java.util.Map;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.User;

public interface OrderService {
    Order createOrder(User user);
    Order createOrder(User user, List<Map<String, Object>> items, Double total);
    List<Order> getUserOrders(User user);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Sipariş Oluşturma: Sepetten sipariş oluşturma işlemi
     * 2. Sipariş Geçmişi: Kullanıcının geçmiş siparişlerini getirme
     * 3. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 
     * Bu interface sayesinde sipariş işlemleri standart ve tutarlı şekilde yapılabilir!
     */
} 