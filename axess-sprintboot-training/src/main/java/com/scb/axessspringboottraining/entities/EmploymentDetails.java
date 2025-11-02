package com.scb.axessspringboottraining.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "employment_details")
public class EmploymentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "occupation_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private OccupationType occupationType;

    @Column(name = "employer_or_business_name", nullable = false)
    private String employerOrBusinessName;

    @Column(name = "designation", nullable = false)
    private String designation;

    @Column(name = "total_work_experience_years", nullable = false)
    private Integer totalWorkExperienceYears;

    @Column(name = "office_address", nullable = false)
    private String officeAddress;

    public EmploymentDetails() {
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

    public OccupationType getOccupationType() {
        return occupationType;
    }

    public void setOccupationType(OccupationType occupationType) {
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

