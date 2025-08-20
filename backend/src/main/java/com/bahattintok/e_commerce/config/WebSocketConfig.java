package com.bahattintok.e_commerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket konfigürasyonu - STOMP ve SockJS desteği
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket endpoint'i - SockJS fallback ile
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // CORS için
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Client'tan server'a mesaj gönderme prefix'i
        registry.setApplicationDestinationPrefixes("/app");
        
        // Server'dan client'a mesaj gönderme prefix'i
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        
        // User-specific mesajlar için
        registry.setUserDestinationPrefix("/user");
    }
}
