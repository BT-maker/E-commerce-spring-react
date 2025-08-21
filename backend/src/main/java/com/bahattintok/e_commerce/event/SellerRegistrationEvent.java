package com.bahattintok.e_commerce.event;

import org.springframework.context.ApplicationEvent;

import com.bahattintok.e_commerce.model.User;

/**
 * Satıcı kayıt olduğunda tetiklenen event
 */
public class SellerRegistrationEvent extends ApplicationEvent {
    
    private final User seller;
    
    public SellerRegistrationEvent(Object source, User seller) {
        super(source);
        this.seller = seller;
    }
    
    public User getSeller() {
        return seller;
    }
}
