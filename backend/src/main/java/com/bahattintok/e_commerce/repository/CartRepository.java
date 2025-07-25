package com.bahattintok.e_commerce.repository;

import com.bahattintok.e_commerce.model.Cart;
import com.bahattintok.e_commerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
} 