package com.fashion.repositories;

import com.fashion.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByUsername(String name);
    Optional<Customer> findByEmail(String email);
}
