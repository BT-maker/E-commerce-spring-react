package com.bahattintok.e_commerce.event;

import com.bahattintok.e_commerce.model.Order;

import lombok.Getter;

@Getter
public class OrderPlacedEvent extends EmailEvent {
    private final Order order;
    
    public OrderPlacedEvent(Object source, Order order) {
        super(source, order.getUser().getEmail(), "Siparişiniz Alındı - #" + order.getId());
        this.order = order;
    }
}
