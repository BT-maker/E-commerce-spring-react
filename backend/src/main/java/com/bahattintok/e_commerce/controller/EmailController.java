package com.bahattintok.e_commerce.controller;

import com.bahattintok.e_commerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * Test emaili gönderir
     */
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            emailService.sendTestEmail(to);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Test emaili başarıyla gönderildi");
            response.put("to", to);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Email gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Basit email gönderir
     */
    @PostMapping("/simple")
    public ResponseEntity<Map<String, Object>> sendSimpleEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String subject = request.get("subject");
            String content = request.get("content");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (subject == null || subject.trim().isEmpty()) {
                subject = "E-Commerce Platform";
            }

            if (content == null || content.trim().isEmpty()) {
                content = "Bu bir test mesajıdır.";
            }

            emailService.sendSimpleEmail(to, subject, content);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email başarıyla gönderildi");
            response.put("to", to);
            response.put("subject", subject);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Email gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * HTML email gönderir
     */
    @PostMapping("/html")
    public ResponseEntity<Map<String, Object>> sendHtmlEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String subject = request.get("subject");
            String htmlContent = request.get("htmlContent");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (subject == null || subject.trim().isEmpty()) {
                subject = "E-Commerce Platform";
            }

            if (htmlContent == null || htmlContent.trim().isEmpty()) {
                htmlContent = "<h1>Test Email</h1><p>Bu bir test mesajıdır.</p>";
            }

            emailService.sendHtmlEmail(to, subject, htmlContent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "HTML email başarıyla gönderildi");
            response.put("to", to);
            response.put("subject", subject);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "HTML email gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Sipariş onay emaili gönderir
     */
    @PostMapping("/order-confirmation")
    public ResponseEntity<Map<String, Object>> sendOrderConfirmation(@RequestBody Map<String, Object> request) {
        try {
            String to = (String) request.get("to");
            String customerName = (String) request.get("customerName");
            String orderNumber = (String) request.get("orderNumber");
            Double totalAmount = (Double) request.get("totalAmount");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (customerName == null || customerName.trim().isEmpty()) {
                customerName = "Değerli Müşterimiz";
            }

            if (orderNumber == null || orderNumber.trim().isEmpty()) {
                orderNumber = "ORD-" + System.currentTimeMillis();
            }

            if (totalAmount == null) {
                totalAmount = 0.0;
            }

            emailService.sendOrderConfirmationEmail(to, customerName, orderNumber, totalAmount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Sipariş onay emaili başarıyla gönderildi");
            response.put("to", to);
            response.put("orderNumber", orderNumber);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Sipariş onay emaili gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Şifre sıfırlama emaili gönderir
     */
    @PostMapping("/password-reset")
    public ResponseEntity<Map<String, Object>> sendPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String resetToken = request.get("resetToken");
            String username = request.get("username");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (resetToken == null || resetToken.trim().isEmpty()) {
                resetToken = "reset-" + System.currentTimeMillis();
            }

            if (username == null || username.trim().isEmpty()) {
                username = "Kullanıcı";
            }

            emailService.sendPasswordResetEmail(to, resetToken, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Şifre sıfırlama emaili başarıyla gönderildi");
            response.put("to", to);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Şifre sıfırlama emaili gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Hoş geldin emaili gönderir
     */
    @PostMapping("/welcome")
    public ResponseEntity<Map<String, Object>> sendWelcomeEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String customerName = request.get("customerName");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (customerName == null || customerName.trim().isEmpty()) {
                customerName = "Değerli Müşterimiz";
            }

            emailService.sendWelcomeEmail(to, customerName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Hoş geldin emaili başarıyla gönderildi");
            response.put("to", to);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Hoş geldin emaili gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Sipariş durumu güncelleme emaili gönderir
     */
    @PostMapping("/order-status-update")
    public ResponseEntity<Map<String, Object>> sendOrderStatusUpdate(@RequestBody Map<String, Object> request) {
        try {
            String to = (String) request.get("to");
            String customerName = (String) request.get("customerName");
            String orderNumber = (String) request.get("orderNumber");
            String status = (String) request.get("status");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (customerName == null || customerName.trim().isEmpty()) {
                customerName = "Değerli Müşterimiz";
            }

            if (orderNumber == null || orderNumber.trim().isEmpty()) {
                orderNumber = "ORD-" + System.currentTimeMillis();
            }

            if (status == null || status.trim().isEmpty()) {
                status = "Güncellendi";
            }

            emailService.sendOrderStatusUpdateEmail(to, customerName, orderNumber, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Sipariş durumu güncelleme emaili başarıyla gönderildi");
            response.put("to", to);
            response.put("orderNumber", orderNumber);
            response.put("status", status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Sipariş durumu güncelleme emaili gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Düşük stok uyarısı emaili gönderir
     */
    @PostMapping("/low-stock-alert")
    public ResponseEntity<Map<String, Object>> sendLowStockAlert(@RequestBody Map<String, Object> request) {
        try {
            String to = (String) request.get("to");
            String productName = (String) request.get("productName");
            Integer currentStock = (Integer) request.get("currentStock");

            if (to == null || to.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email adresi gerekli");
                return ResponseEntity.badRequest().body(error);
            }

            if (productName == null || productName.trim().isEmpty()) {
                productName = "Ürün";
            }

            if (currentStock == null) {
                currentStock = 0;
            }

            emailService.sendLowStockAlertEmail(to, productName, currentStock);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Düşük stok uyarısı emaili başarıyla gönderildi");
            response.put("to", to);
            response.put("productName", productName);
            response.put("currentStock", currentStock);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Düşük stok uyarısı emaili gönderilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
