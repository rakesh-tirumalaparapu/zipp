package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.Document;
import com.scb.axessspringboottraining.entities.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByApplication(Application application);
    List<Document> findByApplicationAndDocumentType(Application application, DocumentType documentType);
}

