package com.scb.axessspringboottraining.controllers;

import com.scb.axessspringboottraining.dto.*;
import com.scb.axessspringboottraining.entities.ApplicationStatus;
import com.scb.axessspringboottraining.services.ApplicationService;
import com.scb.axessspringboottraining.services.UserService;
import com.scb.axessspringboottraining.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/maker")
@CrossOrigin(origins = "*")
public class MakerController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private Integer getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Integer>> getDashboardStats() {
        DashboardStatsResponse stats = applicationService.getMakerDashboardStats();
        Map<String, Integer> resp = new HashMap<>();
        resp.put("pendingApplications", stats.getPendingApplications());
        resp.put("withCheckerApplications", stats.getWithCheckerApplications());
        resp.put("approvedApplications", stats.getApprovedApplications());
        resp.put("rejectedApplications", stats.getRejectedApplications());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationSummaryResponse>> getAllApplications(
            @RequestParam(required = false) String status) {
        List<ApplicationSummaryResponse> applications;
        if (status != null && !status.isEmpty()) {
            try {
                ApplicationStatus appStatus = ApplicationStatus.valueOf(status.toUpperCase());
                applications = applicationService.getApplicationsByStatus(appStatus);
            } catch (IllegalArgumentException e) {
                applications = applicationService.getAllApplications();
            }
        } else {
            applications = applicationService.getAllApplications();
        }
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationDetails(@PathVariable String applicationId) {
        ApplicationResponse application = applicationService.getApplicationByApplicationId(applicationId);
        return ResponseEntity.ok(application);
    }

    @PostMapping("/applications/{applicationId}/review")
    public ResponseEntity<ApplicationResponse> reviewApplication(
            @PathVariable String applicationId,
            @RequestBody ReviewActionRequest request,
            HttpServletRequest httpRequest) {
        Integer makerId = getUserIdFromRequest(httpRequest);
        ApplicationResponse response = applicationService.makerReview(applicationId, makerId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        UserProfileResponse profile = userService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }
}

