package com.scb.axessspringboottraining.controllers;

import com.scb.axessspringboottraining.dto.ForgotPasswordRequest;
import com.scb.axessspringboottraining.dto.LoginRequest;
import com.scb.axessspringboottraining.dto.LoginResponse;
import com.scb.axessspringboottraining.dto.ResetPasswordRequest;
import com.scb.axessspringboottraining.dto.SignUpRequest;
import com.scb.axessspringboottraining.exceptions.BadRequestException;
import com.scb.axessspringboottraining.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
        authService.signUp(request);
        return ResponseEntity.ok().body("Customer registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> verifySecurityQuestions(@RequestBody ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getFavoriteCity() == null || request.getFavoriteCity().trim().isEmpty() ||
            request.getFavoriteFood() == null || request.getFavoriteFood().trim().isEmpty() ||
            request.getFavoriteColor() == null || request.getFavoriteColor().trim().isEmpty()) {
            throw new BadRequestException("All security questions must be answered");
        }
        
        boolean verified = authService.verifySecurityQuestions(
            request.getEmail(),
            request.getFavoriteCity(),
            request.getFavoriteFood(),
            request.getFavoriteColor()
        );
        
        if (verified) {
            return ResponseEntity.ok().body("Security questions verified successfully");
        } else {
            throw new BadRequestException("Security questions verification failed");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            throw new BadRequestException("New password is required");
        }
        if (request.getConfirmPassword() == null || request.getConfirmPassword().trim().isEmpty()) {
            throw new BadRequestException("Confirm password is required");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        
        authService.resetPassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok().body("Password reset successfully");
    }
}

