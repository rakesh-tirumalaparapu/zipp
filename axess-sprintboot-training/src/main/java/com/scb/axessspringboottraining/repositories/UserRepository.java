package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.User;
import com.scb.axessspringboottraining.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
    boolean existsByEmail(String email);
    Optional<User> findByEmailAndRole(String email, UserRole role);
}

