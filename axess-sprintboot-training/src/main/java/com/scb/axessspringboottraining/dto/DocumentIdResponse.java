package com.scb.axessspringboottraining.dto;

import com.scb.axessspringboottraining.entities.DocumentType;

public class DocumentIdResponse {
    private Integer id;
    private DocumentType documentType;

    public DocumentIdResponse() {}

    public DocumentIdResponse(Integer id, DocumentType documentType) {
        this.id = id;
        this.documentType = documentType;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }
}


