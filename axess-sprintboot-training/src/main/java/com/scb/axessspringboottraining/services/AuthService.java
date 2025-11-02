package com.scb.axessspringboottraining.services;

import com.scb.axessspringboottraining.dto.LoginRequest;
import com.scb.axessspringboottraining.dto.LoginResponse;
import com.scb.axessspringboottraining.dto.SignUpRequest;
import com.scb.axessspringboottraining.entities.User;
import com.scb.axessspringboottraining.entities.UserRole;
import com.scb.axessspringboottraining.exceptions.BadRequestException;
import com.scb.axessspringboottraining.exceptions.UnauthorizedException;
import com.scb.axessspringboottraining.repositories.UserRepository;
import com.scb.axessspringboottraining.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        UserRole role;
        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified");
        }

        User user = userRepository.findByEmailAndRole(request.getEmail(), role)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or role"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return new LoginResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public User signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        String first = request.getFirstName() != null ? request.getFirstName().trim() : "";
        String middle = request.getMiddleName() != null ? request.getMiddleName().trim() : "";
        String last = request.getLastName() != null ? request.getLastName().trim() : "";
        String fullName = (first + " " + (middle.isEmpty() ? "" : middle + " ") + last).trim().replaceAll("\\s+", " ");
        user.setName(fullName);
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        // Default address to satisfy non-null DB constraint while omitting it from signup
        user.setAddress("Not Provided");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CUSTOMER);
        
        // Set security questions (store as lowercase for case-insensitive comparison)
        if (request.getFavoriteCity() != null && !request.getFavoriteCity().trim().isEmpty()) {
            user.setFavoriteCity(request.getFavoriteCity().trim().toLowerCase());
        }
        if (request.getFavoriteFood() != null && !request.getFavoriteFood().trim().isEmpty()) {
            user.setFavoriteFood(request.getFavoriteFood().trim().toLowerCase());
        }
        if (request.getFavoriteColor() != null && !request.getFavoriteColor().trim().isEmpty()) {
            user.setFavoriteColor(request.getFavoriteColor().trim().toLowerCase());
        }

        return userRepository.save(user);
    }

    public boolean verifySecurityQuestions(String email, String favoriteCity, String favoriteFood, String favoriteColor) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with this email"));
        
        boolean cityMatch = user.getFavoriteCity() != null && 
                           user.getFavoriteCity().equalsIgnoreCase(favoriteCity != null ? favoriteCity.trim() : "");
        boolean foodMatch = user.getFavoriteFood() != null && 
                           user.getFavoriteFood().equalsIgnoreCase(favoriteFood != null ? favoriteFood.trim() : "");
        boolean colorMatch = user.getFavoriteColor() != null && 
                            user.getFavoriteColor().equalsIgnoreCase(favoriteColor != null ? favoriteColor.trim() : "");
        
        // All three answers must match
        return cityMatch && foodMatch && colorMatch;
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with this email"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

