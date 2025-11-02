package com.scb.axessspringboottraining.controllers;

import com.scb.axessspringboottraining.dto.*;
import com.scb.axessspringboottraining.services.ApplicationService;
import com.scb.axessspringboottraining.services.UserService;
import com.scb.axessspringboottraining.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private JwtUtil jwtUtil;

    private Integer getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        UserProfileResponse profile = userService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(@RequestBody UpdateProfileRequest updateRequest, HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        UserProfileResponse profile = userService.updateProfile(userId, updateRequest);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/applications")
    public ResponseEntity<ApplicationResponse> submitApplication(@RequestBody LoanApplicationRequest request, HttpServletRequest httpRequest) {
        Integer customerId = getUserIdFromRequest(httpRequest);
        ApplicationResponse response = applicationService.submitApplication(customerId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationSummaryResponse>> getMyApplications(HttpServletRequest request) {
        Integer customerId = getUserIdFromRequest(request);
        List<ApplicationSummaryResponse> applications = applicationService.getCustomerApplications(customerId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationDetails(@PathVariable String applicationId, HttpServletRequest request) {
        ApplicationResponse application = applicationService.getApplicationByApplicationId(applicationId);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/applications/{applicationId}")
    public ResponseEntity<ApplicationResponse> resubmitApplication(
            @PathVariable String applicationId,
            @RequestBody LoanApplicationRequest request,
            HttpServletRequest httpRequest
    ) {
        Integer customerId = getUserIdFromRequest(httpRequest);
        ApplicationResponse response = applicationService.resubmitRejectedApplication(customerId, applicationId, request);
        return ResponseEntity.ok(response);
    }
}

