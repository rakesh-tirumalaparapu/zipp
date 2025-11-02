package com.scb.axessspringboottraining.entities;

import com.fasterxml.jackson.annotation.JsonValue;

public enum DocumentType {
    // Personal Details Documents
    PHOTOGRAPH,
    IDENTITY_PROOF,
    ADDRESS_PROOF,
    
    // Employment Documents - Salaried
    SALARY_SLIPS,
    ITR_SALARIED,
    BANK_STATEMENTS_SALARIED,
    EMPLOYMENT_PROOF,
    
    // Employment Documents - Self-Employed
    BUSINESS_PROOF_GST,
    ITR_SELF_EMPLOYED,
    BANK_STATEMENTS_SELF_EMPLOYED,
    
    // Loan Documents - Home Loan
    SALE_AGREEMENT,
    EC_CERTIFICATE,
    
    // Loan Documents - Vehicle Loan
    INVOICE_FROM_DEALER,
    QUOTATION,
    
    // Loan Documents - Personal Loan
    INCOME_PROOF,
    
    // Existing Loan Documents
    CIBIL_REPORT;
    
    @JsonValue
    public String getName() {
        return this.name();
    }
}

