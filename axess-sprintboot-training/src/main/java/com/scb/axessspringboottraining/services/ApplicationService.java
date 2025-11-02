package com.scb.axessspringboottraining.services;

import com.scb.axessspringboottraining.dto.*;
import com.scb.axessspringboottraining.entities.*;
import com.scb.axessspringboottraining.exceptions.BadRequestException;
import com.scb.axessspringboottraining.exceptions.ResourceNotFoundException;
import com.scb.axessspringboottraining.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PersonalDetailsRepository personalDetailsRepository;

    @Autowired
    private EmploymentDetailsRepository employmentDetailsRepository;

    @Autowired
    private LoanDetailsRepository loanDetailsRepository;

    @Autowired
    private ExistingLoanDetailsRepository existingLoanDetailsRepository;

    @Autowired
    private ReferenceRepository referenceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private String generateApplicationId() {
        String prefix = "LA" + LocalDate.now().getYear();
        long count = applicationRepository.count() + 1;
        return prefix + String.format("%05d", count);
    }

    @Transactional
    public ApplicationResponse submitApplication(Integer customerId, LoanApplicationRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        String applicationId = generateApplicationId();
        while (applicationRepository.existsByApplicationId(applicationId)) {
            applicationId = generateApplicationId();
        }

        Application application = new Application();
        application.setApplicationId(applicationId);
        application.setCustomer(customer);
        application.setStatus(ApplicationStatus.WITH_MAKER);
        application.setSubmittedDate(LocalDate.now());
        application = applicationRepository.save(application);

        // Save Personal Details
        PersonalDetails personalDetails = new PersonalDetails();
        personalDetails.setApplication(application);
        LoanApplicationRequest.PersonalDetailsDto pdDto = request.getPersonalDetails();
        personalDetails.setFirstName(pdDto.getFirstName());
        personalDetails.setMiddleName(pdDto.getMiddleName());
        personalDetails.setLastName(pdDto.getLastName());
        personalDetails.setPhoneNumber(pdDto.getPhoneNumber());
        personalDetails.setEmailAddress(pdDto.getEmailAddress());
        personalDetails.setCurrentAddress(pdDto.getCurrentAddress());
        personalDetails.setPermanentAddress(pdDto.getPermanentAddress());
        personalDetails.setMaritalStatus(MaritalStatus.valueOf(pdDto.getMaritalStatus().toUpperCase()));
        personalDetails.setGender(Gender.valueOf(pdDto.getGender().toUpperCase()));
        personalDetails.setDateOfBirth(pdDto.getDateOfBirth());
        // Calculate age automatically
        int age = Period.between(pdDto.getDateOfBirth(), LocalDate.now()).getYears();
        personalDetails.setAge(age);
        personalDetails.setAadhaarNumber(pdDto.getAadhaarNumber());
        personalDetails.setPanNumber(pdDto.getPanNumber());
        personalDetails.setPassportNumber(pdDto.getPassportNumber());
        personalDetails.setFatherName(pdDto.getFatherName());
        personalDetails.setEducationDetails(pdDto.getEducationDetails());
        personalDetailsRepository.save(personalDetails);

        // Save Employment Details
        EmploymentDetails employmentDetails = new EmploymentDetails();
        employmentDetails.setApplication(application);
        LoanApplicationRequest.EmploymentDetailsDto edDto = request.getEmploymentDetails();
        employmentDetails.setOccupationType(OccupationType.valueOf(edDto.getOccupationType().toUpperCase().replace("-", "_")));
        employmentDetails.setEmployerOrBusinessName(edDto.getEmployerOrBusinessName());
        employmentDetails.setDesignation(edDto.getDesignation());
        employmentDetails.setTotalWorkExperienceYears(edDto.getTotalWorkExperienceYears());
        employmentDetails.setOfficeAddress(edDto.getOfficeAddress());
        employmentDetailsRepository.save(employmentDetails);

        // Save Loan Details
        LoanDetails loanDetails = new LoanDetails();
        loanDetails.setApplication(application);
        LoanApplicationRequest.LoanDetailsDto ldDto = request.getLoanDetails();
        loanDetails.setLoanType(LoanType.valueOf(ldDto.getLoanType().toUpperCase().replace(" ", "_")));
        loanDetails.setLoanAmount(BigDecimal.valueOf(ldDto.getLoanAmount()));
        loanDetails.setLoanDurationMonths(ldDto.getLoanDurationMonths());
        loanDetails.setPurposeOfLoan(ldDto.getPurposeOfLoan());
        loanDetailsRepository.save(loanDetails);

        // Save Existing Loan Details
        ExistingLoanDetails existingLoanDetails = new ExistingLoanDetails();
        existingLoanDetails.setApplication(application);
        LoanApplicationRequest.ExistingLoanDetailsDto eldDto = request.getExistingLoanDetails();
        existingLoanDetails.setHasExistingLoans(eldDto.getHasExistingLoans());
        if (Boolean.TRUE.equals(eldDto.getHasExistingLoans())) {
            existingLoanDetails.setExistingLoanType(eldDto.getExistingLoanType());
            existingLoanDetails.setLenderName(eldDto.getLenderName());
            existingLoanDetails.setOutstandingAmount(BigDecimal.valueOf(eldDto.getOutstandingAmount()));
            existingLoanDetails.setMonthlyEmi(BigDecimal.valueOf(eldDto.getMonthlyEmi()));
            existingLoanDetails.setTenureRemainingMonths(eldDto.getTenureRemainingMonths());
        }
        existingLoanDetailsRepository.save(existingLoanDetails);

        // Save References
        for (LoanApplicationRequest.ReferenceDto refDto : request.getReferences()) {
            Reference reference = new Reference();
            reference.setApplication(application);
            reference.setReferenceNumber(refDto.getReferenceNumber());
            reference.setName(refDto.getName());
            reference.setRelationship(refDto.getRelationship());
            reference.setContactNumber(refDto.getContactNumber());
            reference.setAddress(refDto.getAddress());
            referenceRepository.save(reference);
        }

        // Notify all makers
        notificationService.notifyMakers(application);

        return getApplicationByApplicationId(applicationId);
    }

    public List<ApplicationSummaryResponse> getCustomerApplications(Integer customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<Application> applications = applicationRepository.findByCustomerOrderBySubmittedDateDesc(customer);

        return applications.stream().map(app -> {
            ApplicationSummaryResponse response = new ApplicationSummaryResponse();
            response.setId(app.getId());
            response.setApplicationId(app.getApplicationId());
            response.setCustomerName(customer.getName());
            LoanDetails loanDetails = loanDetailsRepository.findByApplication(app).orElse(null);
            if (loanDetails != null) {
                response.setLoanType(loanDetails.getLoanType().name());
                response.setLoanAmount(loanDetails.getLoanAmount().intValue());
                response.setLoanDurationMonths(loanDetails.getLoanDurationMonths());
            }
            response.setStatus(app.getStatus().name());
            response.setSubmittedDate(app.getSubmittedDate());
            return response;
        }).collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationByApplicationId(String applicationId) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return buildApplicationResponse(application);
    }

    @Transactional
    public ApplicationResponse resubmitRejectedApplication(Integer customerId, String applicationId, LoanApplicationRequest request) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("You are not authorized to edit this application");
        }

        if (application.getStatus() != ApplicationStatus.REJECTED) {
            throw new BadRequestException("Only rejected applications can be edited and resubmitted");
        }

        // Update/overwrite details
        PersonalDetails personal = personalDetailsRepository.findByApplication(application).orElse(new PersonalDetails());
        personal.setApplication(application);
        LoanApplicationRequest.PersonalDetailsDto pd = request.getPersonalDetails();
        personal.setFirstName(pd.getFirstName());
        personal.setMiddleName(pd.getMiddleName());
        personal.setLastName(pd.getLastName());
        personal.setPhoneNumber(pd.getPhoneNumber());
        personal.setEmailAddress(pd.getEmailAddress());
        personal.setCurrentAddress(pd.getCurrentAddress());
        personal.setPermanentAddress(pd.getPermanentAddress());
        personal.setMaritalStatus(MaritalStatus.valueOf(pd.getMaritalStatus().toUpperCase()));
        personal.setGender(Gender.valueOf(pd.getGender().toUpperCase()));
        personal.setDateOfBirth(pd.getDateOfBirth());
        int age = Period.between(pd.getDateOfBirth(), LocalDate.now()).getYears();
        personal.setAge(age);
        personal.setAadhaarNumber(pd.getAadhaarNumber());
        personal.setPanNumber(pd.getPanNumber());
        personal.setPassportNumber(pd.getPassportNumber());
        personal.setFatherName(pd.getFatherName());
        personal.setEducationDetails(pd.getEducationDetails());
        personalDetailsRepository.save(personal);

        EmploymentDetails emp = employmentDetailsRepository.findByApplication(application).orElse(new EmploymentDetails());
        emp.setApplication(application);
        LoanApplicationRequest.EmploymentDetailsDto ed = request.getEmploymentDetails();
        emp.setOccupationType(OccupationType.valueOf(ed.getOccupationType().toUpperCase().replace("-", "_")));
        emp.setEmployerOrBusinessName(ed.getEmployerOrBusinessName());
        emp.setDesignation(ed.getDesignation());
        emp.setTotalWorkExperienceYears(ed.getTotalWorkExperienceYears());
        emp.setOfficeAddress(ed.getOfficeAddress());
        employmentDetailsRepository.save(emp);

        LoanDetails loan = loanDetailsRepository.findByApplication(application).orElse(new LoanDetails());
        loan.setApplication(application);
        LoanApplicationRequest.LoanDetailsDto ld = request.getLoanDetails();
        loan.setLoanType(LoanType.valueOf(ld.getLoanType().toUpperCase().replace(" ", "_")));
        loan.setLoanAmount(BigDecimal.valueOf(ld.getLoanAmount()));
        loan.setLoanDurationMonths(ld.getLoanDurationMonths());
        loan.setPurposeOfLoan(ld.getPurposeOfLoan());
        loanDetailsRepository.save(loan);

        ExistingLoanDetails ex = existingLoanDetailsRepository.findByApplication(application).orElse(new ExistingLoanDetails());
        ex.setApplication(application);
        LoanApplicationRequest.ExistingLoanDetailsDto eld = request.getExistingLoanDetails();
        ex.setHasExistingLoans(eld.getHasExistingLoans());
        if (Boolean.TRUE.equals(eld.getHasExistingLoans())) {
            ex.setExistingLoanType(eld.getExistingLoanType());
            ex.setLenderName(eld.getLenderName());
            ex.setOutstandingAmount(BigDecimal.valueOf(eld.getOutstandingAmount()));
            ex.setMonthlyEmi(BigDecimal.valueOf(eld.getMonthlyEmi()));
            ex.setTenureRemainingMonths(eld.getTenureRemainingMonths());
        } else {
            ex.setExistingLoanType(null);
            ex.setLenderName(null);
            ex.setOutstandingAmount(null);
            ex.setMonthlyEmi(null);
            ex.setTenureRemainingMonths(null);
        }
        existingLoanDetailsRepository.save(ex);

        // Replace references: delete and recreate for simplicity
        List<Reference> existingRefs = referenceRepository.findByApplication(application);
        for (Reference r : existingRefs) {
            referenceRepository.delete(r);
        }
        for (LoanApplicationRequest.ReferenceDto refDto : request.getReferences()) {
            Reference reference = new Reference();
            reference.setApplication(application);
            reference.setReferenceNumber(refDto.getReferenceNumber());
            reference.setName(refDto.getName());
            reference.setRelationship(refDto.getRelationship());
            reference.setContactNumber(refDto.getContactNumber());
            reference.setAddress(refDto.getAddress());
            referenceRepository.save(reference);
        }

        // Reset status to WITH_MAKER and date
        application.setStatus(ApplicationStatus.WITH_MAKER);
        application.setSubmittedDate(LocalDate.now());
        applicationRepository.save(application);

        // Notify makers so it appears as pending again and falls off checker if any
        notificationService.notifyMakers(application);

        return buildApplicationResponse(application);
    }

    public ApplicationResponse getApplicationById(Integer applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        return buildApplicationResponse(application);
    }

    private ApplicationResponse buildApplicationResponse(Application application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setApplicationId(application.getApplicationId());
        response.setStatus(application.getStatus().name());
        response.setSubmittedDate(application.getSubmittedDate());

        PersonalDetails personalDetails = personalDetailsRepository.findByApplication(application).orElse(null);
        if (personalDetails != null) {
            ApplicationResponse.PersonalDetailsResponse pdResponse = new ApplicationResponse.PersonalDetailsResponse();
            pdResponse.setFirstName(personalDetails.getFirstName());
            pdResponse.setMiddleName(personalDetails.getMiddleName());
            pdResponse.setLastName(personalDetails.getLastName());
            pdResponse.setPhoneNumber(personalDetails.getPhoneNumber());
            pdResponse.setEmailAddress(personalDetails.getEmailAddress());
            pdResponse.setCurrentAddress(personalDetails.getCurrentAddress());
            pdResponse.setPermanentAddress(personalDetails.getPermanentAddress());
            pdResponse.setMaritalStatus(personalDetails.getMaritalStatus().name());
            pdResponse.setGender(personalDetails.getGender().name());
            pdResponse.setDateOfBirth(personalDetails.getDateOfBirth());
            pdResponse.setAge(personalDetails.getAge());
            pdResponse.setAadhaarNumber(personalDetails.getAadhaarNumber());
            pdResponse.setPanNumber(personalDetails.getPanNumber());
            pdResponse.setPassportNumber(personalDetails.getPassportNumber());
            pdResponse.setFatherName(personalDetails.getFatherName());
            pdResponse.setEducationDetails(personalDetails.getEducationDetails());
            response.setPersonalDetails(pdResponse);
        }

        EmploymentDetails employmentDetails = employmentDetailsRepository.findByApplication(application).orElse(null);
        if (employmentDetails != null) {
            ApplicationResponse.EmploymentDetailsResponse edResponse = new ApplicationResponse.EmploymentDetailsResponse();
            edResponse.setOccupationType(employmentDetails.getOccupationType().name());
            edResponse.setEmployerOrBusinessName(employmentDetails.getEmployerOrBusinessName());
            edResponse.setDesignation(employmentDetails.getDesignation());
            edResponse.setTotalWorkExperienceYears(employmentDetails.getTotalWorkExperienceYears());
            edResponse.setOfficeAddress(employmentDetails.getOfficeAddress());
            response.setEmploymentDetails(edResponse);
        }

        LoanDetails loanDetails = loanDetailsRepository.findByApplication(application).orElse(null);
        if (loanDetails != null) {
            ApplicationResponse.LoanDetailsResponse ldResponse = new ApplicationResponse.LoanDetailsResponse();
            ldResponse.setLoanType(loanDetails.getLoanType().name());
            ldResponse.setLoanAmount(loanDetails.getLoanAmount().intValue());
            ldResponse.setLoanDurationMonths(loanDetails.getLoanDurationMonths());
            ldResponse.setPurposeOfLoan(loanDetails.getPurposeOfLoan());
            response.setLoanDetails(ldResponse);
        }

        ExistingLoanDetails existingLoanDetails = existingLoanDetailsRepository.findByApplication(application).orElse(null);
        if (existingLoanDetails != null) {
            ApplicationResponse.ExistingLoanDetailsResponse eldResponse = new ApplicationResponse.ExistingLoanDetailsResponse();
            eldResponse.setHasExistingLoans(existingLoanDetails.getHasExistingLoans());
            eldResponse.setExistingLoanType(existingLoanDetails.getExistingLoanType());
            eldResponse.setLenderName(existingLoanDetails.getLenderName());
            if (existingLoanDetails.getOutstandingAmount() != null) {
                eldResponse.setOutstandingAmount(existingLoanDetails.getOutstandingAmount().intValue());
            }
            if (existingLoanDetails.getMonthlyEmi() != null) {
                eldResponse.setMonthlyEmi(existingLoanDetails.getMonthlyEmi().intValue());
            }
            eldResponse.setTenureRemainingMonths(existingLoanDetails.getTenureRemainingMonths());
            response.setExistingLoanDetails(eldResponse);
        }

        List<Reference> references = referenceRepository.findByApplication(application);
        List<ApplicationResponse.ReferenceResponse> refResponses = new ArrayList<>();
        for (Reference ref : references) {
            ApplicationResponse.ReferenceResponse refResponse = new ApplicationResponse.ReferenceResponse();
            refResponse.setReferenceNumber(ref.getReferenceNumber());
            refResponse.setName(ref.getName());
            refResponse.setRelationship(ref.getRelationship());
            refResponse.setContactNumber(ref.getContactNumber());
            refResponse.setAddress(ref.getAddress());
            refResponses.add(refResponse);
        }
        response.setReferences(refResponses);

        // Load comments
        List<Comment> comments = commentRepository.findByApplication(application);
        List<ApplicationResponse.CommentResponse> commentResponses = comments.stream().map(comment -> {
            ApplicationResponse.CommentResponse commentResponse = new ApplicationResponse.CommentResponse();
            commentResponse.setCommentText(comment.getCommentText());
            commentResponse.setCommentType(comment.getCommentType().name());
            commentResponse.setUserName(comment.getUser().getName());
            commentResponse.setCreatedAt(comment.getCreatedAt().toString());
            return commentResponse;
        }).collect(Collectors.toList());
        response.setComments(commentResponses);

        return response;
    }

    @Autowired
    private CommentRepository commentRepository;

    public List<ApplicationSummaryResponse> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();

        return applications.stream().map(app -> {
            ApplicationSummaryResponse response = new ApplicationSummaryResponse();
            response.setId(app.getId());
            response.setApplicationId(app.getApplicationId());
            response.setCustomerName(app.getCustomer().getName());
            LoanDetails loanDetails = loanDetailsRepository.findByApplication(app).orElse(null);
            if (loanDetails != null) {
                response.setLoanType(loanDetails.getLoanType().name());
                response.setLoanAmount(loanDetails.getLoanAmount().intValue());
                response.setLoanDurationMonths(loanDetails.getLoanDurationMonths());
            }
            response.setStatus(app.getStatus().name());
            response.setSubmittedDate(app.getSubmittedDate());
            return response;
        }).collect(Collectors.toList());
    }

    public List<ApplicationSummaryResponse> getApplicationsByStatus(ApplicationStatus status) {
        List<Application> applications = applicationRepository.findByStatus(status);

        return applications.stream().map(app -> {
            ApplicationSummaryResponse response = new ApplicationSummaryResponse();
            response.setId(app.getId());
            response.setApplicationId(app.getApplicationId());
            response.setCustomerName(app.getCustomer().getName());
            LoanDetails loanDetails = loanDetailsRepository.findByApplication(app).orElse(null);
            if (loanDetails != null) {
                response.setLoanType(loanDetails.getLoanType().name());
                response.setLoanAmount(loanDetails.getLoanAmount().intValue());
                response.setLoanDurationMonths(loanDetails.getLoanDurationMonths());
            }
            response.setStatus(app.getStatus().name());
            response.setSubmittedDate(app.getSubmittedDate());
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse makerReview(String applicationId, Integer makerId, ReviewActionRequest request) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User maker = userRepository.findById(makerId)
                .orElseThrow(() -> new ResourceNotFoundException("Maker not found"));

        if (application.getStatus() != ApplicationStatus.WITH_MAKER && application.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Application is not in a valid state for maker review");
        }

        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new BadRequestException("Comment is mandatory");
        }

        Comment comment = new Comment();
        comment.setApplication(application);
        comment.setUser(maker);
        comment.setCommentText(request.getComment());
        comment.setCreatedAt(LocalDateTime.now());

        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            application.setStatus(ApplicationStatus.WITH_CHECKER);
            comment.setCommentType(CommentType.MAKER_APPROVAL);
            commentRepository.save(comment);
            application = applicationRepository.save(application);
            notificationService.notifyChecker(application);
        } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
            application.setStatus(ApplicationStatus.REJECTED);
            comment.setCommentType(CommentType.MAKER_REJECTION);
            commentRepository.save(comment);
            application = applicationRepository.save(application);
            notificationService.notifyCustomerRejection(application, "Application rejected by maker");
        } else {
            throw new BadRequestException("Invalid action. Use APPROVE or REJECT");
        }

        return buildApplicationResponse(application);
    }

    @Transactional
    public ApplicationResponse checkerReview(String applicationId, Integer checkerId, ReviewActionRequest request) {
        Application application = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User checker = userRepository.findById(checkerId)
                .orElseThrow(() -> new ResourceNotFoundException("Checker not found"));

        if (application.getStatus() != ApplicationStatus.WITH_CHECKER) {
            throw new BadRequestException("Application is not in a valid state for checker review");
        }

        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new BadRequestException("Comment is mandatory");
        }

        Comment comment = new Comment();
        comment.setApplication(application);
        comment.setUser(checker);
        comment.setCommentText(request.getComment());
        comment.setCreatedAt(LocalDateTime.now());

        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            application.setStatus(ApplicationStatus.APPROVED);
            comment.setCommentType(CommentType.CHECKER_APPROVAL);
            commentRepository.save(comment);
            application = applicationRepository.save(application);
            notificationService.notifyApproval(application);
        } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
            application.setStatus(ApplicationStatus.REJECTED);
            comment.setCommentType(CommentType.CHECKER_REJECTION);
            commentRepository.save(comment);
            application = applicationRepository.save(application);
            notificationService.notifyRejection(application);
        } else {
            throw new BadRequestException("Invalid action. Use APPROVE or REJECT");
        }

        return buildApplicationResponse(application);
    }

    public DashboardStatsResponse getMakerDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        List<Application> allApplications = applicationRepository.findAll();

        // Maker-specific mapping
        int pending = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.WITH_MAKER)
                .count();
        stats.setPendingApplications(pending);
        int withChecker = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.WITH_CHECKER)
                .count();
        stats.setWithCheckerApplications(withChecker);
        int approved = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.APPROVED)
                .count();
        stats.setApprovedApplications(approved);
        int rejected = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.REJECTED)
                .count();
        stats.setRejectedApplications(rejected);
        // Total reflects only these visible categories
        stats.setTotalApplications(pending + withChecker + approved + rejected);

        return stats;
    }

    public List<ApplicationSummaryResponse> getCheckerApplications() {
        // Return all applications relevant to checker: WITH_CHECKER, APPROVED, or REJECTED
        List<Application> allApplications = applicationRepository.findAll();
        
        return allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.WITH_CHECKER 
                        || app.getStatus() == ApplicationStatus.APPROVED 
                        || app.getStatus() == ApplicationStatus.REJECTED)
                .map(app -> {
                    ApplicationSummaryResponse response = new ApplicationSummaryResponse();
                    response.setId(app.getId());
                    response.setApplicationId(app.getApplicationId());
                    response.setCustomerName(app.getCustomer().getName());
                    LoanDetails loanDetails = loanDetailsRepository.findByApplication(app).orElse(null);
                    if (loanDetails != null) {
                        response.setLoanType(loanDetails.getLoanType().name());
                        response.setLoanAmount(loanDetails.getLoanAmount().intValue());
                        response.setLoanDurationMonths(loanDetails.getLoanDurationMonths());
                    }
                    response.setStatus(app.getStatus().name());
                    response.setSubmittedDate(app.getSubmittedDate());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public DashboardStatsResponse getCheckerDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        List<Application> allApplications = applicationRepository.findAll();

        // Checker-specific mapping
        int withChecker = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.WITH_CHECKER)
                .count();
        stats.setPendingApplications(withChecker);
        stats.setWithCheckerApplications(withChecker);
        int approved = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.APPROVED)
                .count();
        stats.setApprovedApplications(approved);
        int rejected = (int) allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.REJECTED)
                .count();
        stats.setRejectedApplications(rejected);

        // Total should represent only checker-relevant states
        stats.setTotalApplications(withChecker + approved + rejected);

        return stats;
    }

    // Removed obsolete simple checker stats method that used a deleted DTO

    public DashboardStatsResponse getCustomerDashboardStats(Integer customerId) {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        List<Application> apps = applicationRepository.findByCustomerOrderBySubmittedDateDesc(customer);

        stats.setTotalApplications(apps.size());
        // Customer-specific mapping
        stats.setPendingApplications((int) apps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.PENDING
                        || app.getStatus() == ApplicationStatus.WITH_MAKER
                        || app.getStatus() == ApplicationStatus.WITH_CHECKER)
                .count());
        stats.setWithCheckerApplications((int) apps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.WITH_CHECKER)
                .count());
        stats.setApprovedApplications((int) apps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.APPROVED)
                .count());
        stats.setRejectedApplications((int) apps.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.REJECTED)
                .count());

        return stats;
    }
}

