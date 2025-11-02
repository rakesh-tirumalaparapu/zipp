package com.scb.axessspringboottraining.services;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.Document;
import com.scb.axessspringboottraining.entities.DocumentType;
import com.scb.axessspringboottraining.exceptions.ResourceNotFoundException;
import com.scb.axessspringboottraining.repositories.ApplicationRepository;
import com.scb.axessspringboottraining.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.scb.axessspringboottraining.dto.DocumentIdResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Transactional
    public void uploadDocument(String applicationId, DocumentType documentType, MultipartFile file) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        try {
            // Check if a document of this type already exists for this application
            List<Document> existingDocuments = documentRepository.findByApplicationAndDocumentType(application, documentType);
            
            // Delete existing documents of the same type (replace, not add)
            if (!existingDocuments.isEmpty()) {
                documentRepository.deleteAll(existingDocuments);
            }
            
            // Create and save the new document
            Document document = new Document();
            document.setApplication(application);
            document.setDocumentType(documentType);
            document.setDocumentName(file.getOriginalFilename());
            document.setDocumentData(file.getBytes());
            document.setContentType(file.getContentType());

            documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Error uploading document: " + e.getMessage());
        }
    }

    public Document getDocument(Integer documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    public List<Document> getDocumentsByApplication(String applicationId) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return documentRepository.findByApplication(application);
    }

    public List<String> getDocumentTypesByApplication(String applicationId) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return documentRepository.findByApplication(application).stream()
                .map(doc -> doc.getDocumentType().name())
                .collect(Collectors.toList());
    }

    public List<DocumentIdResponse> getDocumentIdsByApplication(String applicationId) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return documentRepository.findByApplication(application).stream()
                .map(doc -> new DocumentIdResponse(doc.getId(), doc.getDocumentType()))
                .collect(Collectors.toList());
    }
}

