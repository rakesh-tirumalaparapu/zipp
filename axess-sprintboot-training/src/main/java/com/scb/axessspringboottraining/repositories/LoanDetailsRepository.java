package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.LoanDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanDetailsRepository extends JpaRepository<LoanDetails, Integer> {
    Optional<LoanDetails> findByApplication(Application application);
}

