package com.scb.axessspringboottraining.config;

import com.scb.axessspringboottraining.entities.User;
import com.scb.axessspringboottraining.entities.UserRole;
import com.scb.axessspringboottraining.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Maker
        if (!userRepository.findByEmail("sameer.maker@example.com").isPresent()) {
            User maker = new User();
            maker.setName("Sameer Maker");
            maker.setEmail("sameer.maker@example.com");
            maker.setPhoneNumber("9876543210");
            maker.setAddress("Mumbai, Maharashtra");
            maker.setPassword(passwordEncoder.encode("maker123"));
            maker.setRole(UserRole.MAKER);
            // Set default security questions for password reset
            maker.setFavoriteCity("mumbai");
            maker.setFavoriteFood("pizza");
            maker.setFavoriteColor("blue");
            userRepository.save(maker);
        }

        // Initialize Checker
        if (!userRepository.findByEmail("rakesh.checker@example.com").isPresent()) {
            User checker = new User();
            checker.setName("Rakesh Checker");
            checker.setEmail("rakesh.checker@example.com");
            checker.setPhoneNumber("9876543211");
            checker.setAddress("Bangalore, Karnataka");
            checker.setPassword(passwordEncoder.encode("checker123"));
            checker.setRole(UserRole.CHECKER);
            // Set default security questions for password reset
            checker.setFavoriteCity("bangalore");
            checker.setFavoriteFood("burger");
            checker.setFavoriteColor("green");
            userRepository.save(checker);
        }
        
        // Also update existing maker/checker if they don't have security questions
        userRepository.findByEmail("sameer.maker@example.com").ifPresent(maker -> {
            if (maker.getFavoriteCity() == null || maker.getFavoriteCity().trim().isEmpty()) {
                maker.setFavoriteCity("mumbai");
                maker.setFavoriteFood("pizza");
                maker.setFavoriteColor("blue");
                userRepository.save(maker);
            }
        });
        
        userRepository.findByEmail("rakesh.checker@example.com").ifPresent(checker -> {
            if (checker.getFavoriteCity() == null || checker.getFavoriteCity().trim().isEmpty()) {
                checker.setFavoriteCity("bangalore");
                checker.setFavoriteFood("burger");
                checker.setFavoriteColor("green");
                userRepository.save(checker);
            }
        });
    }
}

