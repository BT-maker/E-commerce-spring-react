package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findBySeller(User seller);
    Optional<Store> findByNameIgnoreCase(String name);
} 