import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UnifiedLoanApplication from '../../UseCase3/UnifiedLoanApplication';
import { submitApplication, resubmitApplication } from '../../api/apiCustomer';
import { mapUc3FormToLoanRequest } from '../../api/mappers';
import { listDocumentIdsByApplication } from '../../api/documents';

function LoanApplication({ addApplication, updateApplication }) {
  const navigate = useNavigate();
  const location = useLocation();

  const initialApp = location.state?.application;
  const [existingDocs, setExistingDocs] = useState(null);

  // Convert backend enum values to frontend display values
  const convertLoanType = (backendType) => {
    if (!backendType) return '';
    const type = String(backendType).toUpperCase();
    switch (type) {
      case 'VEHICLE_LOAN': return 'Vehicle Loan';
      case 'HOME_LOAN': return 'Home Loan';
      case 'PERSONAL_LOAN': return 'Personal Loan';
      default: return backendType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  };

  const convertOccupationType = (backendType) => {
    if (!backendType) return '';
    const type = String(backendType).toUpperCase();
    switch (type) {
      case 'SALARIED': return 'Salaried';
      case 'SELF_EMPLOYED': return 'Self-Employed';
      default: return backendType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  };

  // Build flat form-like data from either an existing flat object or backend nested structure
  const buildInitialFromBackend = (app) => {
    if (!app || !app.personalDetails) return undefined;
    const p = app.personalDetails || {};
    const e = app.employmentDetails || {};
    const l = app.loanDetails || {};
    const x = app.existingLoanDetails || {};
    const r1 = Array.isArray(app.references) ? app.references.find(r => r.referenceNumber === 1) : undefined;
    const r2 = Array.isArray(app.references) ? app.references.find(r => r.referenceNumber === 2) : undefined;
    return {
      firstName: p.firstName || '',
      middleName: p.middleName || '',
      lastName: p.lastName || '',
      fullName: [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' '),
      phone: p.phoneNumber || '',
      email: p.emailAddress || '',
      address: p.currentAddress || '',
      currentAddress: p.currentAddress || '',
      permanentAddress: p.permanentAddress || '',
      dob: p.dateOfBirth || '',
      age: p.age != null ? String(p.age) : '',
      maritalStatus: p.maritalStatus || '',
      gender: p.gender || '',
      aadharNumber: p.aadhaarNumber || '',
      panNumber: p.panNumber || '',
      passportNumber: p.passportNumber || '',
      fatherName: p.fatherName || '',
      highestQualification: p.educationDetails || '',
      occupationType: convertOccupationType(e.occupationType) || '',
      employer: e.employerOrBusinessName || '',
      designation: e.designation || '',
      totalExperience: e.totalWorkExperienceYears != null ? String(e.totalWorkExperienceYears) : '',
      officeAddress: e.officeAddress || '',
      hasLoans: x.hasExistingLoans ? 'Yes' : 'No',
      existingLoanType: x.existingLoanType || '',
      existingLender: x.lenderName || '',
      outstandingAmount: x.outstandingAmount != null ? String(x.outstandingAmount) : '',
      existingEmi: x.monthlyEmi != null ? String(x.monthlyEmi) : '',
      tenureRemaining: x.tenureRemainingMonths != null ? String(x.tenureRemainingMonths) : '',
      loanType: convertLoanType(l.loanType) || '',
      amount: l.loanAmount != null ? String(l.loanAmount) : '',
      duration: l.loanDurationMonths != null ? String(l.loanDurationMonths) : '',
      purpose: l.purposeOfLoan || '',
      ref1Name: r1?.name || '',
      ref1Relationship: r1?.relationship || '',
      ref1Contact: r1?.contactNumber || '',
      ref1Address: r1?.address || '',
      ref2Name: r2?.name || '',
      ref2Relationship: r2?.relationship || '',
      ref2Contact: r2?.contactNumber || '',
      ref2Address: r2?.address || '',
    };
  };

  const formSrc = initialApp?.formData && typeof initialApp.formData === 'object' ? initialApp.formData : (initialApp?.personalDetails ? buildInitialFromBackend(initialApp) : initialApp);

  const initialData = formSrc
    ? {
        // Personal
        firstName: formSrc.firstName || '',
        middleName: formSrc.middleName || '',
        lastName: formSrc.lastName || '',
        fullName: formSrc.fullName || '',
        phone: formSrc.phone || '',
        email: formSrc.email || '',
        address: formSrc.address || '',
        currentAddress: formSrc.currentAddress || '',
        permanentAddress: formSrc.permanentAddress || '',
        dob: formSrc.dob || '',
        age: formSrc.age != null ? String(formSrc.age) : '',
        maritalStatus: formSrc.maritalStatus || '',
        gender: formSrc.gender || '',
        aadharNumber: formSrc.aadharNumber || '',
        panNumber: formSrc.panNumber || '',
        passportNumber: formSrc.passportNumber || '',
        fatherName: formSrc.fatherName || '',
        highestQualification: formSrc.highestQualification || '',
        // Employment
        occupationType: formSrc.occupationType || '',
        employer: formSrc.employer || '',
        designation: formSrc.designation || '',
        totalExperience: formSrc.totalExperience || '',
        officeAddress: formSrc.officeAddress || '',
        // Existing loans
        hasLoans: formSrc.hasLoans || '',
        existingLoanType: formSrc.existingLoanType || '',
        existingLender: formSrc.existingLender || '',
        outstandingAmount: formSrc.outstandingAmount != null ? String(formSrc.outstandingAmount) : '',
        existingEmi: formSrc.existingEmi != null ? String(formSrc.existingEmi) : '',
        tenureRemaining: formSrc.tenureRemaining != null ? String(formSrc.tenureRemaining) : '',
        // Loan details
        loanType: formSrc.loanType || '',
        amount: formSrc.amount != null ? String(formSrc.amount) : (formSrc.loanAmount != null ? String(formSrc.loanAmount) : ''),
        duration: formSrc.duration != null ? String(formSrc.duration) : (formSrc.tenure != null ? String(formSrc.tenure) : ''),
        purpose: formSrc.purpose || '',
        // References
        ref1Name: formSrc.ref1Name || '',
        ref1Relationship: formSrc.ref1Relationship || '',
        ref1Contact: formSrc.ref1Contact || '',
        ref1Address: formSrc.ref1Address || '',
        ref2Name: formSrc.ref2Name || '',
        ref2Relationship: formSrc.ref2Relationship || '',
        ref2Contact: formSrc.ref2Contact || '',
        ref2Address: formSrc.ref2Address || '',
      }
    : undefined;

  const handleSubmit = async (formData) => {
    try {
      const payload = mapUc3FormToLoanRequest(formData);
      let applicationId;
      
      if (initialApp?.applicationId && String(initialApp?.status || '').toUpperCase() === 'REJECTED') {
        // Resubmit existing rejected application
        const response = await resubmitApplication(initialApp.applicationId, payload);
        applicationId = response?.applicationId || initialApp.applicationId;
      } else {
        // New application submission
        const created = await submitApplication(undefined, payload);
        applicationId = created?.applicationId || created?.application?.applicationId;
      }

      // Return applicationId so UnifiedLoanApplication can upload documents
      return { applicationId };
    } catch (e) {
      // Fallback legacy (kept, but typically not used when backend is available)
    if (initialApp?.id && typeof updateApplication === 'function') {
        const updated = { ...initialApp, ...formData, id: initialApp.id, status: 'Pending' };
      updateApplication(updated);
    } else if (typeof addApplication === 'function') {
        addApplication(formData);
      }
      throw e; // Re-throw to show error in form
    }
  };

  // Fetch existing documents for rejected application edit
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (initialApp?.applicationId && String(initialApp?.status || '').toUpperCase() === 'REJECTED') {
          const docs = await listDocumentIdsByApplication(initialApp.applicationId);
          console.log('Fetched documents for rejected application:', docs);
          const byKey = {};
          const mapTypeToKeys = (t) => {
            switch (t) {
              case 'PHOTOGRAPH': return ['photograph'];
              case 'IDENTITY_PROOF': return ['idProof'];
              case 'ADDRESS_PROOF': return ['addressProof'];
              case 'CIBIL_REPORT': return ['cibilReport'];
              case 'SALARY_SLIPS': return ['salariedPayslip'];
              case 'EMPLOYMENT_PROOF': return ['salariedEmploymentProof'];
              case 'ITR_SALARIED': return ['salariedItr'];
              case 'BANK_STATEMENTS_SALARIED': return ['salariedBankStatements'];
              case 'ITR_SELF_EMPLOYED': return ['selfItr'];
              case 'BUSINESS_PROOF_GST': return ['selfGst', 'selfBusiness'];
              case 'BANK_STATEMENTS_SELF_EMPLOYED': return ['selfBankStatements'];
              case 'EC_CERTIFICATE': return ['homeEc'];
              case 'SALE_AGREEMENT': return ['homeSaleAgreements'];
              case 'INVOICE_FROM_DEALER': return ['vehicleInvoice'];
              case 'QUOTATION': return ['vehicleQuotation'];
              case 'INCOME_PROOF': return ['personalLoanReport'];
              default: return [];
            }
          };
          (docs || []).forEach(d => {
            // Handle documentType as string (from JSON enum serialization) or object
            // Jackson may serialize enum as string or as object with 'name' property
            console.log('Processing document:', d, 'documentType type:', typeof d.documentType, 'value:', d.documentType);
            let docType = '';
            if (typeof d.documentType === 'string') {
              docType = d.documentType;
            } else if (d.documentType && typeof d.documentType === 'object') {
              // Try various ways to extract the enum name
              docType = d.documentType.name || d.documentType.value || d.documentType.toString() || '';
              // If toString() returns object, try JSON.stringify and parse
              if (!docType || docType === '[object Object]') {
                try {
                  const str = JSON.stringify(d.documentType);
                  const parsed = JSON.parse(str);
                  docType = parsed.name || parsed.value || str || '';
                } catch (e) {
                  docType = '';
                }
              }
            } else {
              docType = String(d.documentType || '').toUpperCase();
            }
            
            // Ensure uppercase for matching
            docType = docType.toUpperCase().trim();
            console.log('Extracted docType:', docType, 'from:', d.documentType);
            
            const keys = mapTypeToKeys(docType);
            console.log('Mapped keys for', docType, ':', keys);
            if (keys.length > 0) {
              keys.forEach(k => {
                byKey[k] = byKey[k] || [];
                byKey[k].push(d);
              });
            } else {
              // Debug: log unmapped document types
              console.warn('Unmapped document type:', docType, 'raw:', d.documentType, 'full doc:', d);
            }
          });
          console.log('Final byKey mapping:', byKey);
          if (mounted) setExistingDocs(byKey);
        } else {
          if (mounted) setExistingDocs(null);
        }
      } catch {
        if (mounted) setExistingDocs(null);
      }
    })();
    return () => { mounted = false; };
  }, [initialApp]);

  return (
    <div className="dashboard-container">
      <div className="container-fluid">
        <div className="mx-auto" style={{ maxWidth: '1160px' }}>
          <UnifiedLoanApplication onSubmit={handleSubmit} initialData={initialData} existingDocs={existingDocs} />
        </div>
      </div>
    </div>
  );
}

export default LoanApplication;
