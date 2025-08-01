package com.bahattintok.e_commerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

/**
 * Elasticsearch konfigürasyon sınıfı.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@Configuration
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
@EnableElasticsearchRepositories(basePackages = "com.bahattintok.e_commerce.repository")
public class ElasticsearchConfig extends ElasticsearchConfiguration {
    
    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUrl;
    
    @Value("${spring.elasticsearch.username:}")
    private String username;
    
    @Value("${spring.elasticsearch.password:}")
    private String password;
    
    @Value("${spring.elasticsearch.connection-timeout:5s}")
    private String connectionTimeout;
    
    @Value("${spring.elasticsearch.socket-timeout:30s}")
    private String socketTimeout;
    
    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(extractHostAndPort(elasticsearchUrl))
                .withConnectTimeout(parseDuration(connectionTimeout))
                .withSocketTimeout(parseDuration(socketTimeout))
                .build();
    }
    
    /**
     * URL'den host ve port'u çıkarır
     */
    private String extractHostAndPort(String url) {
        String cleanUrl = url.replace("http://", "").replace("https://", "");
        return cleanUrl;
    }
    
    /**
     * Duration string'ini parse eder
     */
    private long parseDuration(String duration) {
        if (duration.endsWith("s")) {
            return Long.parseLong(duration.substring(0, duration.length() - 1)) * 1000;
        } else if (duration.endsWith("ms")) {
            return Long.parseLong(duration.substring(0, duration.length() - 2));
        }
        return Long.parseLong(duration) * 1000; // Default olarak saniye kabul et
    }
} 