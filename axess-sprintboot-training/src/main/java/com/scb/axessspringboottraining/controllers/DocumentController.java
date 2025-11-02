package com.scb.axessspringboottraining.controllers;

import com.scb.axessspringboottraining.entities.Document;
import com.scb.axessspringboottraining.dto.DocumentIdResponse;
import com.scb.axessspringboottraining.entities.DocumentType;
import com.scb.axessspringboottraining.services.DocumentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @RequestParam("applicationId") String applicationId,
            @RequestParam("documentType") DocumentType documentType,
            @RequestPart("file") MultipartFile file) {
        documentService.uploadDocument(applicationId, documentType, file);
        return ResponseEntity.ok().body("Document uploaded successfully");
    }

    @GetMapping("/{documentId}")
    public void downloadDocument(@PathVariable Integer documentId, HttpServletResponse response) {
        Document document = documentService.getDocument(documentId);
        
        response.setContentType(document.getContentType());
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getDocumentName() + "\"");
        
        try {
            response.getOutputStream().write(document.getDocumentData());
            response.getOutputStream().flush();
        } catch (Exception e) {
            throw new RuntimeException("Error downloading document", e);
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<String>> getDocumentTypesByApplication(@PathVariable String applicationId) {
        List<String> documentTypes = documentService.getDocumentTypesByApplication(applicationId);
        return ResponseEntity.ok(documentTypes);
    }

    @GetMapping("/application/{applicationId}/ids")
    public ResponseEntity<List<DocumentIdResponse>> getDocumentIdsByApplication(@PathVariable String applicationId) {
        List<DocumentIdResponse> ids = documentService.getDocumentIdsByApplication(applicationId);
        return ResponseEntity.ok(ids);
    }
}

