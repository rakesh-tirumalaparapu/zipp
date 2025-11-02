package com.scb.axessspringboottraining.dto;

import java.time.LocalDate;

public class ApplicationSummaryResponse {
    private Integer id;
    private String applicationId;
    private String customerName;
    private String loanType;
    private Integer loanAmount;
    private Integer loanDurationMonths;
    private String status;
    private LocalDate submittedDate;

    public ApplicationSummaryResponse() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Integer getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(Integer loanAmount) {
        this.loanAmount = loanAmount;
    }

    public Integer getLoanDurationMonths() {
        return loanDurationMonths;
    }

    public void setLoanDurationMonths(Integer loanDurationMonths) {
        this.loanDurationMonths = loanDurationMonths;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDate submittedDate) {
        this.submittedDate = submittedDate;
    }
}

