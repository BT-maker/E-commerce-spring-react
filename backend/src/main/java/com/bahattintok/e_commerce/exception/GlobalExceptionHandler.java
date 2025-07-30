package com.bahattintok.e_commerce.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Uygulama genelinde oluşan istisnaları (exception) yakalayıp uygun HTTP yanıtı döner.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * RuntimeException türündeki hataları yakalar ve 400 döner.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        System.err.println("=== RUNTIME EXCEPTION YAKALANDI ===");
        System.err.println("Hata mesajı: " + ex.getMessage());
        System.err.println("Hata türü: " + ex.getClass().getSimpleName());
        ex.printStackTrace();
        
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
    
    /**
     * Yetkisiz erişim (AccessDeniedException) durumunda 403 döner.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
        System.err.println("=== ACCESS DENIED EXCEPTION YAKALANDI ===");
        System.err.println("Hata mesajı: " + ex.getMessage());
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Access denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    /**
     * Validation (doğrulama) hatalarını yakalar ve alan bazlı hata mesajları döner.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        System.err.println("=== VALIDATION EXCEPTION YAKALANDI ===");
        System.err.println("Hata mesajı: " + ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
    
    /**
     * Diğer tüm beklenmeyen hataları yakalar ve 500 döner.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        System.err.println("=== GENERIC EXCEPTION YAKALANDI ===");
        System.err.println("Hata mesajı: " + ex.getMessage());
        System.err.println("Hata türü: " + ex.getClass().getSimpleName());
        ex.printStackTrace();
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    /**
     * Bu sınıf şu işlevleri sağlar:
     * 
     * 1. Hata Yakalama: Uygulama genelinde oluşan tüm istisnaları yakalar
     * 2. HTTP Yanıtları: Her hata türü için uygun HTTP status kodu döner
     * 3. Validation Hataları: Form doğrulama hatalarını alan bazlı olarak işler
     * 4. Güvenlik Hataları: Yetkisiz erişim durumlarını yönetir
     * 5. Genel Hata Yönetimi: Beklenmeyen hataları güvenli şekilde ele alır
     * 
     * Bu sınıf sayesinde uygulama daha stabil çalışır ve kullanıcılara anlamlı hata mesajları döner!
     */
} 