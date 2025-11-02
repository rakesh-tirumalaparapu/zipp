package com.scb.axessspringboottraining.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "existing_loan_details")
public class ExistingLoanDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "has_existing_loans", nullable = false)
    private Boolean hasExistingLoans;

    @Column(name = "existing_loan_type")
    private String existingLoanType;

    @Column(name = "lender_name")
    private String lenderName;

    @Column(name = "outstanding_amount")
    private BigDecimal outstandingAmount;

    @Column(name = "monthly_emi")
    private BigDecimal monthlyEmi;

    @Column(name = "tenure_remaining_months")
    private Integer tenureRemainingMonths;

    public ExistingLoanDetails() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public Boolean getHasExistingLoans() {
        return hasExistingLoans;
    }

    public void setHasExistingLoans(Boolean hasExistingLoans) {
        this.hasExistingLoans = hasExistingLoans;
    }

    public String getExistingLoanType() {
        return existingLoanType;
    }

    public void setExistingLoanType(String existingLoanType) {
        this.existingLoanType = existingLoanType;
    }

    public String getLenderName() {
        return lenderName;
    }

    public void setLenderName(String lenderName) {
        this.lenderName = lenderName;
    }

    public BigDecimal getOutstandingAmount() {
        return outstandingAmount;
    }

    public void setOutstandingAmount(BigDecimal outstandingAmount) {
        this.outstandingAmount = outstandingAmount;
    }

    public BigDecimal getMonthlyEmi() {
        return monthlyEmi;
    }

    public void setMonthlyEmi(BigDecimal monthlyEmi) {
        this.monthlyEmi = monthlyEmi;
    }

    public Integer getTenureRemainingMonths() {
        return tenureRemainingMonths;
    }

    public void setTenureRemainingMonths(Integer tenureRemainingMonths) {
        this.tenureRemainingMonths = tenureRemainingMonths;
    }
}

