package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.ApplicationStatus;
import com.scb.axessspringboottraining.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    Optional<Application> findByApplicationId(String applicationId);
    List<Application> findByCustomer(User customer);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByCustomerOrderBySubmittedDateDesc(User customer);
    boolean existsByApplicationId(String applicationId);
}

