package com.bahattintok.e_commerce.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${email.from}")
    private String fromEmail;

    @Value("${email.from.name}")
    private String fromName;

    /**
     * Basit text email gönderir
     */
    public void sendSimpleEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, false); // false = plain text
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Error sending email: " + e.getMessage());
            throw new RuntimeException("Email gönderilemedi", e);
        }
    }

    /**
     * HTML email gönderir
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML
            
            mailSender.send(message);
            System.out.println("HTML email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Error sending HTML email: " + e.getMessage());
            throw new RuntimeException("HTML email gönderilemedi", e);
        }
    }

    /**
     * Thymeleaf template kullanarak email gönderir
     */
    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            Context context = new Context();
            context.setVariables(variables);
            
            String htmlContent = templateEngine.process(templateName, context);
            sendHtmlEmail(to, subject, htmlContent);
        } catch (Exception e) {
            System.err.println("Error sending template email: " + e.getMessage());
            throw new RuntimeException("Template email gönderilemedi", e);
        }
    }

    /**
     * Sipariş onay emaili gönderir (Order objesi ile)
     */
    public void sendOrderConfirmationEmail(com.bahattintok.e_commerce.model.Order order) {
        Map<String, Object> variables = Map.of(
            "customerName", order.getUser().getFirstName() + " " + order.getUser().getLastName(),
            "orderNumber", order.getId().toString(),
            "totalAmount", String.format("%.2f", order.getTotalPrice()),
            "orderDate", order.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
            "orderItems", order.getOrderItems()
        );
        
        sendTemplateEmail(order.getUser().getEmail(), "Sipariş Onayı - #" + order.getId(), "email/order-confirmation", variables);
    }

    /**
     * Sipariş onay emaili gönderir (eski metod - geriye uyumluluk için)
     */
    public void sendOrderConfirmationEmail(String to, String customerName, String orderNumber, double totalAmount) {
        Map<String, Object> variables = Map.of(
            "customerName", customerName,
            "orderNumber", orderNumber,
            "totalAmount", String.format("%.2f", totalAmount),
            "orderDate", java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
        );
        
        sendTemplateEmail(to, "Sipariş Onayı - #" + orderNumber, "email/order-confirmation", variables);
    }

    /**
     * Şifre sıfırlama emaili gönderir
     */
    public void sendPasswordResetEmail(String to, String resetToken, String customerName) {
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        
        Map<String, Object> variables = Map.of(
            "customerName", customerName,
            "resetLink", resetLink,
            "expiryTime", "24 saat"
        );
        
        sendTemplateEmail(to, "Şifre Sıfırlama", "email/password-reset", variables);
    }

    /**
     * Hoş geldin emaili gönderir
     */
    public void sendWelcomeEmail(String to, String customerName) {
        Map<String, Object> variables = Map.of(
            "customerName", customerName,
            "loginLink", "http://localhost:5173/login"
        );
        
        sendTemplateEmail(to, "E-Commerce Platform'a Hoş Geldiniz!", "email/welcome", variables);
    }

    /**
     * Sipariş durumu güncelleme emaili gönderir
     */
    public void sendOrderStatusUpdateEmail(String to, String customerName, String orderNumber, String status) {
        Map<String, Object> variables = Map.of(
            "customerName", customerName,
            "orderNumber", orderNumber,
            "status", status,
            "orderLink", "http://localhost:5173/orders"
        );
        
        sendTemplateEmail(to, "Sipariş Durumu Güncellendi - #" + orderNumber, "email/order-status-update", variables);
    }

    /**
     * Ürün stok uyarısı emaili gönderir
     */
    public void sendLowStockAlertEmail(String to, String productName, int currentStock) {
        Map<String, Object> variables = Map.of(
            "productName", productName,
            "currentStock", currentStock,
            "adminPanelLink", "http://localhost:5173/admin/products"
        );
        
        sendTemplateEmail(to, "Düşük Stok Uyarısı - " + productName, "email/low-stock-alert", variables);
    }

    /**
     * Sipariş kargoya verildi emaili gönderir
     */
    public void sendOrderShippedEmail(com.bahattintok.e_commerce.model.Order order, String trackingNumber) {
        Map<String, Object> variables = Map.of(
            "customerName", order.getUser().getFirstName() + " " + order.getUser().getLastName(),
            "orderNumber", order.getId().toString(),
            "trackingNumber", trackingNumber,
            "orderDate", order.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
            "orderItems", order.getOrderItems()
        );
        
        sendTemplateEmail(order.getUser().getEmail(), "Siparişiniz Kargoya Verildi - #" + order.getId(), "email/order-shipped", variables);
    }

    /**
     * Hesap doğrulama emaili gönderir
     */
    public void sendAccountVerificationEmail(com.bahattintok.e_commerce.model.User user, String verificationToken) {
        String verificationLink = "http://localhost:5173/verify-account?token=" + verificationToken;
        
        Map<String, Object> variables = Map.of(
            "customerName", user.getFirstName() + " " + user.getLastName(),
            "verificationLink", verificationLink,
            "expiryTime", "24 saat"
        );
        
        sendTemplateEmail(user.getEmail(), "Hesabınızı Doğrulayın - " + user.getFirstName(), "email/account-verification", variables);
    }

    /**
     * Test emaili gönderir
     */
    public void sendTestEmail(String to) {
        String subject = "Test Email - E-Commerce Platform";
        String content = """
            Merhaba!
            
            Bu bir test emailidir. E-Commerce platform email sistemi çalışıyor.
            
            Tarih: %s
            Saat: %s
            
            Saygılarımızla,
            E-Commerce Platform
            """.formatted(
                java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                java.time.LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
            );
        
        sendSimpleEmail(to, subject, content);
    }

    /**
     * Kategori isteği oluşturulduğunda admin'e email gönderir
     */
    public void sendCategoryRequestCreatedEmail(String to, String subject, String categoryName, 
                                               String description, String sellerName, String createdAt) {
        Map<String, Object> variables = Map.of(
            "categoryName", categoryName,
            "description", description != null ? description : "Açıklama belirtilmemiş",
            "sellerName", sellerName,
            "createdAt", createdAt
        );
        
        sendTemplateEmail(to, subject, "email/category-request-created", variables);
    }

    /**
     * Kategori isteği onaylandığında satıcıya email gönderir
     */
    public void sendCategoryRequestApprovedEmail(String to, String subject, String categoryName, 
                                                String description, String approvedAt, String adminName, String sellerName) {
        Map<String, Object> variables = Map.of(
            "categoryName", categoryName,
            "description", description != null ? description : "Açıklama belirtilmemiş",
            "approvedAt", approvedAt,
            "adminName", adminName,
            "sellerName", sellerName
        );
        
        sendTemplateEmail(to, subject, "email/category-request-approved", variables);
    }

    /**
     * Kategori isteği reddedildiğinde satıcıya email gönderir
     */
    public void sendCategoryRequestRejectedEmail(String to, String subject, String categoryName, 
                                                String description, String rejectedAt, String adminName, 
                                                String sellerName, String rejectionReason) {
        Map<String, Object> variables = Map.of(
            "categoryName", categoryName,
            "description", description != null ? description : "Açıklama belirtilmemiş",
            "rejectedAt", rejectedAt,
            "adminName", adminName,
            "sellerName", sellerName,
            "rejectionReason", rejectionReason
        );
        
        sendTemplateEmail(to, subject, "email/category-request-rejected", variables);
    }

    /**
     * Yeni satıcı kaydı olduğunda admin'e bildirim emaili gönderir
     */
    public void sendSellerRegistrationNotification(String to, String sellerName, String sellerEmail, 
                                                  String sellerPhone, String registrationDate, String adminPanelUrl) {
        Map<String, Object> variables = Map.of(
            "sellerName", sellerName,
            "sellerEmail", sellerEmail,
            "sellerPhone", sellerPhone,
            "registrationDate", registrationDate,
            "adminPanelUrl", adminPanelUrl
        );
        
        sendTemplateEmail(to, "🆕 Yeni Satıcı Kaydı - " + sellerName, "email/seller-registration-notification", variables);
    }
}
