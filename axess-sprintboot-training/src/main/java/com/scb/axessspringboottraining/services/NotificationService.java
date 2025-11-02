package com.scb.axessspringboottraining.services;

import com.scb.axessspringboottraining.dto.NotificationResponse;
import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.Notification;
import com.scb.axessspringboottraining.entities.User;
import com.scb.axessspringboottraining.entities.UserRole;
import com.scb.axessspringboottraining.repositories.NotificationRepository;
import com.scb.axessspringboottraining.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void notifyMakers(Application application) {
        List<User> makers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.MAKER)
                .collect(Collectors.toList());

        String message = "New loan application " + application.getApplicationId() + " submitted by " + 
                        application.getCustomer().getName();

        for (User maker : makers) {
            Notification notification = new Notification();
            notification.setUser(maker);
            notification.setApplication(application);
            notification.setMessage(message);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyChecker(Application application) {
        List<User> checkers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.CHECKER)
                .collect(Collectors.toList());

        String message = "Application " + application.getApplicationId() + " approved by maker and sent for checker review";

        for (User checker : checkers) {
            Notification notification = new Notification();
            notification.setUser(checker);
            notification.setApplication(application);
            notification.setMessage(message);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyApproval(Application application) {
        // Notify customer
        Notification customerNotification = new Notification();
        customerNotification.setUser(application.getCustomer());
        customerNotification.setApplication(application);
        customerNotification.setMessage("Your loan application " + application.getApplicationId() + " has been approved");
        customerNotification.setIsRead(false);
        customerNotification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(customerNotification);

        // Notify maker
        List<User> makers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.MAKER)
                .collect(Collectors.toList());

        String message = "Application " + application.getApplicationId() + " has been approved by checker";

        for (User maker : makers) {
            Notification notification = new Notification();
            notification.setUser(maker);
            notification.setApplication(application);
            notification.setMessage(message);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyRejection(Application application) {
        // Notify customer
        Notification customerNotification = new Notification();
        customerNotification.setUser(application.getCustomer());
        customerNotification.setApplication(application);
        customerNotification.setMessage("Your loan application " + application.getApplicationId() + " has been rejected by checker");
        customerNotification.setIsRead(false);
        customerNotification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(customerNotification);

        // Notify maker
        List<User> makers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.MAKER)
                .collect(Collectors.toList());

        String message = "Application " + application.getApplicationId() + " has been rejected by checker";

        for (User maker : makers) {
            Notification notification = new Notification();
            notification.setUser(maker);
            notification.setApplication(application);
            notification.setMessage(message);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void notifyCustomerRejection(Application application, String message) {
        Notification notification = new Notification();
        notification.setUser(application.getCustomer());
        notification.setApplication(application);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUserNotifications(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);

        return notifications.stream().map(notification -> {
            NotificationResponse response = new NotificationResponse();
            response.setId(notification.getId());
            response.setMessage(notification.getMessage());
            response.setIsRead(notification.getIsRead());
            response.setCreatedAt(notification.getCreatedAt());
            if (notification.getApplication() != null) {
                response.setApplicationId(notification.getApplication().getApplicationId());
            }
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Integer notificationId, Integer userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public long getUnreadCount(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countByUserAndIsRead(user, false);
    }
}

