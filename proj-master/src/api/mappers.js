import { formatLoanType } from '../utils/enumFormatters';

// Map UseCase3 formData -> backend LoanApplicationRequest
export function mapUc3FormToLoanRequest(fd) {
  const toUpper = (s) => (s ? String(s).toUpperCase().replaceAll('-', '_').replaceAll(' ', '_') : s);
  const personalDetails = {
    firstName: fd.firstName || '',
    middleName: fd.middleName || '',
    lastName: fd.lastName || '',
    phoneNumber: fd.phone || '',
    emailAddress: fd.email || '',
    currentAddress: fd.currentAddress || '',
    permanentAddress: fd.permanentAddress || '',
    maritalStatus: toUpper(fd.maritalStatus || ''),
    gender: toUpper(fd.gender || ''),
    dateOfBirth: fd.dob || '',
    aadhaarNumber: fd.aadharNumber || fd.aadhaarNumber || '',
    panNumber: fd.panNumber || '',
    passportNumber: fd.passportNumber || '',
    fatherName: fd.fatherName || '',
    educationDetails: fd.highestQualification || '',
  };

  const employmentDetails = {
    occupationType: toUpper(fd.occupationType || ''),
    employerOrBusinessName: fd.employer || '',
    designation: fd.designation || '',
    totalWorkExperienceYears: Number(fd.totalExperience || 0),
    officeAddress: fd.officeAddress || '',
  };

  const loanDetails = {
    loanType: toUpper(fd.loanType || ''),
    loanAmount: Number(fd.amount || 0),
    loanDurationMonths: Number(fd.duration || 0),
    purposeOfLoan: fd.purpose || '',
  };

  const existingLoanDetails = {
    hasExistingLoans: String(fd.hasLoans || '').toLowerCase() === 'yes',
    existingLoanType: fd.existingLoanType || '',
    lenderName: fd.existingLender || '',
    outstandingAmount: Number(fd.outstandingAmount || 0),
    monthlyEmi: Number(fd.existingEmi || 0),
    tenureRemainingMonths: Number(fd.tenureRemaining || 0),
  };

  const references = [];
  if (fd.ref1Name || fd.ref1Relationship || fd.ref1Contact || fd.ref1Address) {
    references.push({
      referenceNumber: 1,
      name: fd.ref1Name || '',
      relationship: fd.ref1Relationship || '',
      contactNumber: fd.ref1Contact || '',
      address: fd.ref1Address || '',
    });
  }
  if (fd.ref2Name || fd.ref2Relationship || fd.ref2Contact || fd.ref2Address) {
    references.push({
      referenceNumber: 2,
      name: fd.ref2Name || '',
      relationship: fd.ref2Relationship || '',
      contactNumber: fd.ref2Contact || '',
      address: fd.ref2Address || '',
    });
  }

  return {
    personalDetails,
    employmentDetails,
    loanDetails,
    existingLoanDetails,
    references,
  };
}

// Map backend ApplicationSummaryResponse -> UI row for UseCase2
export function mapSummaryToUiRow(sum) {
  return {
    id: sum.id,
    applicationId: sum.applicationId,
    loanType: formatLoanType(sum.loanType),
    amount: sum.loanAmount,
    tenure: sum.loanDurationMonths || 0,
    status: humanizeStatus(sum.status),
    appliedDate: sum.submittedDate,
  };
}

export function humanizeStatus(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'APPROVED') return 'Approved';
  if (s === 'REJECTED') return 'Rejected';
  if (s === 'WITH_CHECKER' || s === 'WITH_MAKER' || s === 'PENDING') return 'Pending';
  return s || 'Pending';
}

// Group documents by documentType for details view
export function groupDocumentsByType(docs) {
  const byType = {};
  (docs || []).forEach((d) => {
    const key = d.documentType || d.type || 'UNKNOWN';
    byType[key] = byType[key] || [];
    byType[key].push(d);
  });
  return byType;
}





