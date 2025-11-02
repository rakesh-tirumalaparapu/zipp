package com.scb.axessspringboottraining.controllers;

import com.scb.axessspringboottraining.dto.NotificationResponse;
import com.scb.axessspringboottraining.services.NotificationService;
import com.scb.axessspringboottraining.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    private Integer getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer notificationId, HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok().body("Notification marked as read");
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(HttpServletRequest request) {
        Integer userId = getUserIdFromRequest(request);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }
}

