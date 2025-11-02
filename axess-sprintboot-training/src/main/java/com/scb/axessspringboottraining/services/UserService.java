package com.scb.axessspringboottraining.services;

import com.scb.axessspringboottraining.dto.UpdateProfileRequest;
import com.scb.axessspringboottraining.dto.UserProfileResponse;
import com.scb.axessspringboottraining.entities.User;
import com.scb.axessspringboottraining.exceptions.ResourceNotFoundException;
import com.scb.axessspringboottraining.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserProfileResponse getProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String[] parts = user.getName() != null ? user.getName().trim().split("\\s+") : new String[0];
        String firstName = parts.length > 0 ? parts[0] : "";
        String lastName = parts.length > 1 ? parts[parts.length - 1] : "";
        String middleName = parts.length > 2 ? String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length - 1)) : "";

        return new UserProfileResponse(
                user.getId(),
                firstName,
                middleName,
                lastName,
                user.getEmail(),
                user.getPhoneNumber()
        );
    }

    public UserProfileResponse updateProfile(Integer userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String first = request.getFirstName() != null ? request.getFirstName().trim() : "";
        String middle = request.getMiddleName() != null ? request.getMiddleName().trim() : "";
        String last = request.getLastName() != null ? request.getLastName().trim() : "";
        String fullName = (first + " " + (middle.isEmpty() ? "" : middle + " ") + last).trim().replaceAll("\\s+", " ");
        user.setName(fullName);
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());

        user = userRepository.save(user);

        String[] parts2 = user.getName() != null ? user.getName().trim().split("\\s+") : new String[0];
        String firstName2 = parts2.length > 0 ? parts2[0] : "";
        String lastName2 = parts2.length > 1 ? parts2[parts2.length - 1] : "";
        String middleName2 = parts2.length > 2 ? String.join(" ", java.util.Arrays.copyOfRange(parts2, 1, parts2.length - 1)) : "";

        return new UserProfileResponse(
                user.getId(),
                firstName2,
                middleName2,
                lastName2,
                user.getEmail(),
                user.getPhoneNumber()
        );
    }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

