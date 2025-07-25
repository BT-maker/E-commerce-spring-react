package com.bahattintok.e_commerce.service;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.User;
import java.util.List;

public interface OrderService {
    Order createOrder(User user);
    List<Order> getUserOrders(User user);
} 