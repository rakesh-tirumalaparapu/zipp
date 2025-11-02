package com.scb.axessspringboottraining.dto;

import java.time.LocalDate;

public class ApplicationResponse {
    private Integer id;
    private String applicationId;
    private String status;
    private LocalDate submittedDate;
    private PersonalDetailsResponse personalDetails;
    private EmploymentDetailsResponse employmentDetails;
    private LoanDetailsResponse loanDetails;
    private ExistingLoanDetailsResponse existingLoanDetails;
    private java.util.List<ReferenceResponse> references;
    private java.util.List<CommentResponse> comments;

    public ApplicationResponse() {
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

    public PersonalDetailsResponse getPersonalDetails() {
        return personalDetails;
    }

    public void setPersonalDetails(PersonalDetailsResponse personalDetails) {
        this.personalDetails = personalDetails;
    }

    public EmploymentDetailsResponse getEmploymentDetails() {
        return employmentDetails;
    }

    public void setEmploymentDetails(EmploymentDetailsResponse employmentDetails) {
        this.employmentDetails = employmentDetails;
    }

    public LoanDetailsResponse getLoanDetails() {
        return loanDetails;
    }

    public void setLoanDetails(LoanDetailsResponse loanDetails) {
        this.loanDetails = loanDetails;
    }

    public ExistingLoanDetailsResponse getExistingLoanDetails() {
        return existingLoanDetails;
    }

    public void setExistingLoanDetails(ExistingLoanDetailsResponse existingLoanDetails) {
        this.existingLoanDetails = existingLoanDetails;
    }

    public java.util.List<ReferenceResponse> getReferences() {
        return references;
    }

    public void setReferences(java.util.List<ReferenceResponse> references) {
        this.references = references;
    }

    public java.util.List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(java.util.List<CommentResponse> comments) {
        this.comments = comments;
    }

    // Inner response classes
    public static class PersonalDetailsResponse {
        private String firstName;
        private String middleName;
        private String lastName;
        private String phoneNumber;
        private String emailAddress;
        private String currentAddress;
        private String permanentAddress;
        private String maritalStatus;
        private String gender;
        private LocalDate dateOfBirth;
        private Integer age;
        private String aadhaarNumber;
        private String panNumber;
        private String passportNumber;
        private String fatherName;
        private String educationDetails;

        // Getters and setters
        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getMiddleName() {
            return middleName;
        }

        public void setMiddleName(String middleName) {
            this.middleName = middleName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getEmailAddress() {
            return emailAddress;
        }

        public void setEmailAddress(String emailAddress) {
            this.emailAddress = emailAddress;
        }

        public String getCurrentAddress() {
            return currentAddress;
        }

        public void setCurrentAddress(String currentAddress) {
            this.currentAddress = currentAddress;
        }

        public String getPermanentAddress() {
            return permanentAddress;
        }

        public void setPermanentAddress(String permanentAddress) {
            this.permanentAddress = permanentAddress;
        }

        public String getMaritalStatus() {
            return maritalStatus;
        }

        public void setMaritalStatus(String maritalStatus) {
            this.maritalStatus = maritalStatus;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public LocalDate getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getAadhaarNumber() {
            return aadhaarNumber;
        }

        public void setAadhaarNumber(String aadhaarNumber) {
            this.aadhaarNumber = aadhaarNumber;
        }

        public String getPanNumber() {
            return panNumber;
        }

        public void setPanNumber(String panNumber) {
            this.panNumber = panNumber;
        }

        public String getPassportNumber() {
            return passportNumber;
        }

        public void setPassportNumber(String passportNumber) {
            this.passportNumber = passportNumber;
        }

        public String getFatherName() {
            return fatherName;
        }

        public void setFatherName(String fatherName) {
            this.fatherName = fatherName;
        }

        public String getEducationDetails() {
            return educationDetails;
        }

        public void setEducationDetails(String educationDetails) {
            this.educationDetails = educationDetails;
        }
    }

    public static class EmploymentDetailsResponse {
        private String occupationType;
        private String employerOrBusinessName;
        private String designation;
        private Integer totalWorkExperienceYears;
        private String officeAddress;

        public String getOccupationType() {
            return occupationType;
        }

        public void setOccupationType(String occupationType) {
            this.occupationType = occupationType;
        }

        public String getEmployerOrBusinessName() {
            return employerOrBusinessName;
        }

        public void setEmployerOrBusinessName(String employerOrBusinessName) {
            this.employerOrBusinessName = employerOrBusinessName;
        }

        public String getDesignation() {
            return designation;
        }

        public void setDesignation(String designation) {
            this.designation = designation;
        }

        public Integer getTotalWorkExperienceYears() {
            return totalWorkExperienceYears;
        }

        public void setTotalWorkExperienceYears(Integer totalWorkExperienceYears) {
            this.totalWorkExperienceYears = totalWorkExperienceYears;
        }

        public String getOfficeAddress() {
            return officeAddress;
        }

        public void setOfficeAddress(String officeAddress) {
            this.officeAddress = officeAddress;
        }
    }

    public static class LoanDetailsResponse {
        private String loanType;
        private Integer loanAmount;
        private Integer loanDurationMonths;
        private String purposeOfLoan;

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

        public String getPurposeOfLoan() {
            return purposeOfLoan;
        }

        public void setPurposeOfLoan(String purposeOfLoan) {
            this.purposeOfLoan = purposeOfLoan;
        }
    }

    public static class ExistingLoanDetailsResponse {
        private Boolean hasExistingLoans;
        private String existingLoanType;
        private String lenderName;
        private Integer outstandingAmount;
        private Integer monthlyEmi;
        private Integer tenureRemainingMonths;

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

        public Integer getOutstandingAmount() {
            return outstandingAmount;
        }

        public void setOutstandingAmount(Integer outstandingAmount) {
            this.outstandingAmount = outstandingAmount;
        }

        public Integer getMonthlyEmi() {
            return monthlyEmi;
        }

        public void setMonthlyEmi(Integer monthlyEmi) {
            this.monthlyEmi = monthlyEmi;
        }

        public Integer getTenureRemainingMonths() {
            return tenureRemainingMonths;
        }

        public void setTenureRemainingMonths(Integer tenureRemainingMonths) {
            this.tenureRemainingMonths = tenureRemainingMonths;
        }
    }

    public static class ReferenceResponse {
        private Integer referenceNumber;
        private String name;
        private String relationship;
        private String contactNumber;
        private String address;

        public Integer getReferenceNumber() {
            return referenceNumber;
        }

        public void setReferenceNumber(Integer referenceNumber) {
            this.referenceNumber = referenceNumber;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRelationship() {
            return relationship;
        }

        public void setRelationship(String relationship) {
            this.relationship = relationship;
        }

        public String getContactNumber() {
            return contactNumber;
        }

        public void setContactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class CommentResponse {
        private String commentText;
        private String commentType;
        private String userName;
        private String createdAt;

        public String getCommentText() {
            return commentText;
        }

        public void setCommentText(String commentText) {
            this.commentText = commentText;
        }

        public String getCommentType() {
            return commentType;
        }

        public void setCommentType(String commentType) {
            this.commentType = commentType;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }
}

