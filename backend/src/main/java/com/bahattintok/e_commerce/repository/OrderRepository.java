package com.bahattintok.e_commerce.repository;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

    // Find orders for a specific user, ordered by creation date descending.
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    // Custom query to fetch orders with all their items and associated products eagerly.
    // This helps prevent LazyInitializationException.
    @Query("SELECT o FROM Order o JOIN FETCH o.items oi LEFT JOIN FETCH oi.product WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<Order> findByUserWithItemsAndProducts(@Param("user") User user);

    List<Order> findByStatus(String status);

    @Query("SELECT o FROM Order o JOIN FETCH o.user JOIN FETCH o.items")
    List<Order> findAllWithUserAndItems();

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}