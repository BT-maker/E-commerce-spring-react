package com.bahattintok.e_commerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

/**
 * Swagger/OpenAPI dokümantasyonu için konfigürasyon.
 */
@Configuration
public class OpenApiConfig {
    
    /**
     * OpenAPI ana yapılandırması.
     * API başlığı, açıklaması, iletişim ve güvenlik şeması tanımlar.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce API")
                        .description("Spring Boot REST API for E-Commerce application")
                        .version("1.0")
                        .contact(new Contact()
                                .name("E-Commerce Team")
                                .email("contact@ecommerce.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                // JWT Bearer Authentication gereksinimi ekleniyor
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
    
    /**
     * Bu sınıf şu işlevleri sağlar:
     * 
     * 1. API Dokümantasyonu: Swagger UI'da görünecek API bilgilerini tanımlar
     * 2. Güvenlik Şeması: JWT authentication'ın nasıl kullanılacağını belirtir
     * 3. Test Arayüzü: Geliştiricilerin API'yi test edebilmesi için arayüz sağlar
     * 4. Dokümantasyon: API endpoint'lerinin otomatik dokümantasyonunu oluşturur
     * 
     * Bu konfigürasyon sayesinde:
     * - http://localhost:8080/swagger-ui/index.html adresinden API dokümantasyonuna erişebilirsiniz
     * - Tüm endpoint'leri test edebilirsiniz
     * - JWT token ile authentication yapabilirsiniz
     * - API'nizin nasıl kullanılacağını görebilirsiniz
     */
} 