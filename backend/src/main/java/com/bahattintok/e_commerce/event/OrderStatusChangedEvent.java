package com.bahattintok.e_commerce.event;

import com.bahattintok.e_commerce.model.Order;

import lombok.Getter;

@Getter
public class OrderStatusChangedEvent extends EmailEvent {
    private final Order order;
    private final String oldStatus;
    private final String newStatus;
    
    public OrderStatusChangedEvent(Object source, Order order, String oldStatus, String newStatus) {
        super(source, order.getUser().getEmail(), "Sipariş Durumu Güncellendi - #" + order.getId());
        this.order = order;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
}
