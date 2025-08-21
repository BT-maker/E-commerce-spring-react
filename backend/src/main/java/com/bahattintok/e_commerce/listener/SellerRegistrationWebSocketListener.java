package com.bahattintok.e_commerce.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.bahattintok.e_commerce.event.SellerRegistrationEvent;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Satıcı kayıt olduğunda WebSocket ile real-time bildirim gönderen listener
 */
@Component
public class SellerRegistrationWebSocketListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @EventListener
    @Async
    public void handleSellerRegistration(SellerRegistrationEvent event) {
        User seller = event.getSeller();
        
        try {
            // Tüm admin'leri bul
            List<User> admins = userRepository.findByRoleName("ADMIN");
            
            if (admins.isEmpty()) {
                System.out.println("Hiç admin bulunamadı, WebSocket bildirimi gönderilemedi.");
                return;
            }

            // WebSocket bildirimi için veri hazırla
            Map<String, Object> notification = new HashMap<>();
            notification.put("id", "SELLER-" + seller.getId());
            notification.put("title", "🆕 Yeni Satıcı Kaydı");
            notification.put("message", String.format("'%s %s' satıcı olarak kayıt oldu (Email: %s)",
                    seller.getFirstName(), seller.getLastName(), seller.getEmail()));
            notification.put("type", "warning");
            notification.put("createdAt", seller.getRegistrationDate() != null ? 
                seller.getRegistrationDate().toString() : java.time.LocalDateTime.now().toString());
            notification.put("sellerId", seller.getId());
            notification.put("isNewRegistration", true);
            notification.put("action", "navigate");
            notification.put("target", "/admin/sellers");

            // Her admin'e WebSocket bildirimi gönder
            for (User admin : admins) {
                try {
                    messagingTemplate.convertAndSendToUser(
                        admin.getEmail(),
                        "/queue/notifications",
                        notification
                    );
                    
                    System.out.println("Seller kayıt WebSocket bildirimi gönderildi: " + admin.getEmail());
                } catch (Exception e) {
                    System.err.println("Admin'e WebSocket bildirimi gönderilemedi: " + admin.getEmail() + " - Hata: " + e.getMessage());
                }
            }
            
            // Genel topic'e de gönder (tüm admin'ler dinleyebilir)
            try {
                messagingTemplate.convertAndSend("/topic/admin-notifications", notification);
                System.out.println("Genel admin bildirimi gönderildi");
            } catch (Exception e) {
                System.err.println("Genel WebSocket bildirimi gönderilemedi: " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.err.println("Seller kayıt WebSocket listener hatası: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
