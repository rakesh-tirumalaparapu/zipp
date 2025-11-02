package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.ExistingLoanDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExistingLoanDetailsRepository extends JpaRepository<ExistingLoanDetails, Integer> {
    Optional<ExistingLoanDetails> findByApplication(Application application);
}

