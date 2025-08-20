package com.bahattintok.e_commerce.event;

import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.User;

/**
 * Kategori istek email event'leri
 */
public class CategoryRequestEvent {
    
    private final CategoryRequest categoryRequest;
    private final User recipient;
    private final String eventType;
    
    public CategoryRequestEvent(CategoryRequest categoryRequest, User recipient, String eventType) {
        this.categoryRequest = categoryRequest;
        this.recipient = recipient;
        this.eventType = eventType;
    }
    
    public CategoryRequest getCategoryRequest() {
        return categoryRequest;
    }
    
    public User getRecipient() {
        return recipient;
    }
    
    public String getEventType() {
        return eventType;
    }
    
    /**
     * Event tipleri
     */
    public static class EventTypes {
        public static final String REQUEST_CREATED = "CATEGORY_REQUEST_CREATED";
        public static final String REQUEST_APPROVED = "CATEGORY_REQUEST_APPROVED";
        public static final String REQUEST_REJECTED = "CATEGORY_REQUEST_REJECTED";
    }
}
