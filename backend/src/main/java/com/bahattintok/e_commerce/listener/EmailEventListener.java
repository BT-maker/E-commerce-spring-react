package com.bahattintok.e_commerce.listener;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.bahattintok.e_commerce.event.OrderPlacedEvent;
import com.bahattintok.e_commerce.event.OrderShippedEvent;
import com.bahattintok.e_commerce.event.OrderStatusChangedEvent;
import com.bahattintok.e_commerce.event.UserRegisteredEvent;
import com.bahattintok.e_commerce.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailEventListener {
    
    private final EmailService emailService;
    
    @Async("emailTaskExecutor")
    @EventListener
    public void handleOrderPlaced(OrderPlacedEvent event) {
        try {
            log.info("Sipariş onay email'i gönderiliyor: {}", event.getEmail());
            emailService.sendOrderConfirmationEmail(event.getOrder());
        } catch (Exception e) {
            log.error("Sipariş onay email'i gönderilemedi: {}", e.getMessage(), e);
        }
    }
    
    @Async("emailTaskExecutor")
    @EventListener
    public void handleOrderShipped(OrderShippedEvent event) {
        try {
            log.info("Kargo bilgisi email'i gönderiliyor: {}", event.getEmail());
            emailService.sendOrderShippedEmail(event.getOrder(), event.getTrackingNumber());
        } catch (Exception e) {
            log.error("Kargo bilgisi email'i gönderilemedi: {}", e.getMessage(), e);
        }
    }
    
    @Async("emailTaskExecutor")
    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        try {
            log.info("Hesap doğrulama email'i gönderiliyor: {}", event.getEmail());
            emailService.sendAccountVerificationEmail(event.getUser(), event.getVerificationToken());
        } catch (Exception e) {
            log.error("Hesap doğrulama email'i gönderilemedi: {}", e.getMessage(), e);
        }
    }
    
    @Async("emailTaskExecutor")
    @EventListener
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {
        try {
            // Aynı durum ise email gönderme
            if (event.getOldStatus().equals(event.getNewStatus())) {
                log.info("Durum değişmedi, email gönderilmiyor: {} -> {}", event.getOldStatus(), event.getNewStatus());
                return;
            }
            
            log.info("Sipariş durumu güncelleme email'i gönderiliyor: {} - Durum: {} -> {}", 
                    event.getEmail(), event.getOldStatus(), event.getNewStatus());
            emailService.sendOrderStatusUpdateEmail(
                event.getOrder().getUser().getEmail(),
                event.getOrder().getUser().getFirstName() + " " + event.getOrder().getUser().getLastName(),
                event.getOrder().getId().toString(),
                event.getNewStatus()
            );
        } catch (Exception e) {
            log.error("Sipariş durumu güncelleme email'i gönderilemedi: {}", e.getMessage(), e);
        }
    }
}
