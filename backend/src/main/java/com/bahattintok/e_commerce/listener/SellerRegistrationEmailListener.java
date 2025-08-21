package com.bahattintok.e_commerce.listener;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.bahattintok.e_commerce.event.SellerRegistrationEvent;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.EmailService;

/**
 * Satıcı kayıt olduğunda admin'lere email gönderen listener
 */
@Component
public class SellerRegistrationEmailListener {

    @Autowired
    private EmailService emailService;

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
                System.out.println("Hiç admin bulunamadı, email gönderilemedi.");
                return;
            }

            // Email template'i için verileri hazırla
            String sellerName = seller.getFirstName() + " " + seller.getLastName();
            String sellerEmail = seller.getEmail();
            String sellerPhone = seller.getPhone() != null ? seller.getPhone() : "Belirtilmemiş";
            String registrationDate = seller.getRegistrationDate()
                    .format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm", new Locale("tr", "TR")));
            
            // Admin panel URL'i (production'da gerçek URL kullanılmalı)
            String adminPanelUrl = "http://localhost:3000/admin/sellers";

            // Her admin'e email gönder
            for (User admin : admins) {
                try {
                    emailService.sendSellerRegistrationNotification(
                        admin.getEmail(),
                        sellerName,
                        sellerEmail,
                        sellerPhone,
                        registrationDate,
                        adminPanelUrl
                    );
                    
                    System.out.println("Seller kayıt bildirimi gönderildi: " + admin.getEmail());
                } catch (Exception e) {
                    System.err.println("Admin'e email gönderilemedi: " + admin.getEmail() + " - Hata: " + e.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Seller kayıt email listener hatası: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
