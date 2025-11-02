package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.EmploymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmploymentDetailsRepository extends JpaRepository<EmploymentDetails, Integer> {
    Optional<EmploymentDetails> findByApplication(Application application);
}

