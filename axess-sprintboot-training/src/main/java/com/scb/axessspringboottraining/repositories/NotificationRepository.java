package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Notification;
import com.scb.axessspringboottraining.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, Boolean isRead);
    long countByUserAndIsRead(User user, Boolean isRead);
}

