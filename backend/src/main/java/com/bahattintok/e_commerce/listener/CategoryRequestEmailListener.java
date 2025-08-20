package com.bahattintok.e_commerce.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.bahattintok.e_commerce.event.CategoryRequestEvent;
import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.service.EmailService;

/**
 * Kategori istek email event'lerini dinleyen listener
 */
@Component
public class CategoryRequestEmailListener {
    
    @Autowired
    private EmailService emailService;
    
    /**
     * Kategori isteği oluşturulduğunda admin'lere email gönderir
     */
    @EventListener
    @Async
    public void handleCategoryRequestCreated(CategoryRequestEvent event) {
        if (CategoryRequestEvent.EventTypes.REQUEST_CREATED.equals(event.getEventType())) {
            CategoryRequest request = event.getCategoryRequest();
            User admin = event.getRecipient();
            
            // Admin'e email gönder
            String subject = "Yeni Kategori İsteği - " + request.getCategoryName();
            
            emailService.sendCategoryRequestCreatedEmail(
                admin.getEmail(),
                subject,
                request.getCategoryName(),
                request.getDescription(),
                request.getSeller().getFirstName() + " " + request.getSeller().getLastName(),
                request.getCreatedAt().toString()
            );
        }
    }
    
    /**
     * Kategori isteği onaylandığında satıcıya email gönderir
     */
    @EventListener
    @Async
    public void handleCategoryRequestApproved(CategoryRequestEvent event) {
        if (CategoryRequestEvent.EventTypes.REQUEST_APPROVED.equals(event.getEventType())) {
            CategoryRequest request = event.getCategoryRequest();
            User seller = event.getRecipient();
            
            // Satıcıya email gönder
            String subject = "Kategori İsteği Onaylandı - " + request.getCategoryName();
            
            emailService.sendCategoryRequestApprovedEmail(
                seller.getEmail(),
                subject,
                request.getCategoryName(),
                request.getDescription(),
                request.getProcessedAt().toString(),
                request.getAdmin().getFirstName() + " " + request.getAdmin().getLastName(),
                seller.getFirstName() + " " + seller.getLastName()
            );
        }
    }
    
    /**
     * Kategori isteği reddedildiğinde satıcıya email gönderir
     */
    @EventListener
    @Async
    public void handleCategoryRequestRejected(CategoryRequestEvent event) {
        if (CategoryRequestEvent.EventTypes.REQUEST_REJECTED.equals(event.getEventType())) {
            CategoryRequest request = event.getCategoryRequest();
            User seller = event.getRecipient();
            
            // Satıcıya email gönder
            String subject = "Kategori İsteği Reddedildi - " + request.getCategoryName();
            
            emailService.sendCategoryRequestRejectedEmail(
                seller.getEmail(),
                subject,
                request.getCategoryName(),
                request.getDescription(),
                request.getProcessedAt().toString(),
                request.getAdmin().getFirstName() + " " + request.getAdmin().getLastName(),
                seller.getFirstName() + " " + seller.getLastName(),
                request.getRejectionReason()
            );
        }
    }
}
