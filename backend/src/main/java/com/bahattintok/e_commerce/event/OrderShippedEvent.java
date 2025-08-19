package com.bahattintok.e_commerce.event;

import com.bahattintok.e_commerce.model.Order;

import lombok.Getter;

@Getter
public class OrderShippedEvent extends EmailEvent {
    private final Order order;
    private final String trackingNumber;
    
    public OrderShippedEvent(Object source, Order order, String trackingNumber) {
        super(source, order.getUser().getEmail(), "Siparişiniz Kargoya Verildi - #" + order.getId());
        this.order = order;
        this.trackingNumber = trackingNumber;
    }
}
