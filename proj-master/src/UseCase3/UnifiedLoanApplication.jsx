import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllPopup from "../components/AllPopup";
import { submitApplication } from "../api/apiCustomer";
import { uploadDocument, getDocument } from "../api/documents";
import { mapUc3FormToLoanRequest } from "../api/mappers";
import "./UnifiedLoanApplication.css";

// Move Field component OUTSIDE the main component
const Field = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  as = "input", 
  options, 
  onChangeOverride, 
  valueOverride, 
  readOnly = false, 
  disabled = false,
  className = "",
  autoFocus = false,
  formData,
  errors,
  handleFieldChange,
  pattern,
  min,
  max,
  onKeyPress
}) => {
  const handleChange = onChangeOverride || handleFieldChange;
  const errorMessage = errors[name] || formData[`${name}Error`] || '';
  const hasError = !!errorMessage;
  
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={name}>{label}</label>
      {as === "select" ? (
        <select 
          id={name} 
          name={name} 
          value={formData[name] || ""} 
          onChange={handleChange} 
          disabled={disabled}
          className={`form-control ${hasError ? "is-invalid" : ""} ${className || ""}`}
          style={disabled ? { cursor: 'not-allowed', backgroundColor: '#e9ecef' } : {}}
        >
          <option value="">Select</option>
          {options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={readOnly && valueOverride !== undefined ? valueOverride : (formData[name] || "")}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          pattern={pattern}
          min={min}
          max={max}
          autoComplete="on"
          className={`form-control ${hasError ? "is-invalid" : ""} ${className || ""}`}
          style={disabled ? { cursor: 'not-allowed', backgroundColor: '#e9ecef' } : {}}
        />
      )}
      {hasError && <div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
};

// Move Section component OUTSIDE as well
const Section = ({ title, children }) => (
  <div className="section-card">
    <h5 className="section-title">{title}</h5>
    <div className="grid-2">{children}</div>
  </div>
);

export default function UnifiedLoanApplication({ onSubmit, initialData, existingDocs }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false });
  const [uploadedFiles, setUploadedFiles] = useState({}); // Store File objects
  const [previewFile, setPreviewFile] = useState(null); // File to preview
  const [previewUrl, setPreviewUrl] = useState(null); // URL for preview
  const [sameAddressChecked, setSameAddressChecked] = useState(false); // Track checkbox state
  const [formData, setFormData] = useState({
    // Personal
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    currentAddress: "",
    permanentAddress: "",
    dob: "",
    age: "",
    maritalStatus: "",
    gender: "",
    aadharNumber: "",
    panNumber: "",
    passportNumber: "",
    fatherName: "",
    highestQualification: "",
    // Employment
    occupationType: "",
    employer: "",
    designation: "",
    totalExperience: "",
    officeAddress: "",
    // Existing loans
    hasLoans: "",
    existingLoanType: "",
    existingLender: "",
    outstandingAmount: "",
    existingEmi: "",
    tenureRemaining: "",
    // Loan details
    loanType: "",
    amount: "",
    duration: "",
    purpose: "",
    // Documents
    photograph: "",
    idProof: "",
    addressProof: "",
    cibilReport: "",
    salariedPayslip: "",
    salariedEmploymentProof: "",
    salariedItr: "",
    salariedBankStatements: "",
    selfItr: "",
    selfGst: "",
    selfBankStatements: "",
    selfBusiness: "",
    homeEc: "",
    homeSaleAgreements: "",
    vehicleInvoice: "",
    vehicleQuotation: "",
    personalLoanReport: "",
    // References
    ref1Name: "",
    ref1Relationship: "",
    ref1Contact: "",
    ref1Address: "",
    ref2Name: "",
    ref2Relationship: "",
    ref2Contact: "",
    ref2Address: "",
  });

  // Capture file objects for viewing and metadata for form data
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files && files[0];
    if (file) {
      // Store the File object for viewing
      setUploadedFiles(prev => ({ ...prev, [name]: file }));
      // Store file name in formData
      setFormData(prev => ({ ...prev, [name]: file.name || 'uploaded' }));
    } else {
      // Remove file if input is cleared
      setUploadedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[name];
        return newFiles;
      });
      setFormData(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file preview
  const handleViewFile = (fileKey) => {
    const file = uploadedFiles[fileKey];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewFile({ file, name: formData[fileKey] || file.name, type: file.type });
      setPreviewUrl(url);
    }
  };

  // Close preview and cleanup URL
  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  // Open existing uploaded doc from backend (when editing rejected application)
  const handleViewExisting = async (doc) => {
    try {
      const blob = await getDocument(doc.id);
      const url = URL.createObjectURL(blob);
      setPreviewFile({ file: null, name: doc.documentType || 'Document', type: blob.type || '' });
      setPreviewUrl(url);
    } catch (e) {
      setInfoModal({ show: true, title: 'Open failed', message: e.message || 'Unable to open document' });
    }
  };

  const renderExisting = (key) => {
    const arr = existingDocs && existingDocs[key];
    if (!arr || arr.length === 0) return null;
    return (
      <div className="text-muted small" style={{ marginTop: '6px' }}>
        <span className="me-2">Already uploaded</span>
        {arr.slice(0,3).map((d, idx) => (
          <button
            key={`${key}-${d.id}-${idx}`}
            type="button"
            className="btn btn-sm btn-link p-0 me-2"
            style={{ color:'#0d6efd', textDecoration:'none', display:'inline-flex', alignItems:'center' }}
            onClick={() => handleViewExisting(d)}
          >
            <i className="bi bi-eye me-1"></i>
            View{arr.length>1?` ${idx+1}`:''}
          </button>
        ))}
      </div>
    );
  };

  // Render uploaded file indicator for current session files
  const renderUploadedFile = (key) => {
    const file = uploadedFiles[key];
    if (!file) return null;
    const fileName = file.name || formData[key] || 'uploaded';
    return (
      <div className="text-success small" style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="bi bi-check-circle-fill" style={{ fontSize: '14px' }}></i>
        <span className="me-2">File uploaded: <strong>{fileName}</strong></span>
        <button
          type="button"
          className="btn btn-sm btn-link p-0"
          style={{ color:'#0d6efd', textDecoration:'none', display:'inline-flex', alignItems:'center' }}
          onClick={() => handleViewFile(key)}
        >
          <i className="bi bi-eye me-1"></i>
          View
        </button>
      </div>
    );
  };

  // Prefill when editing
  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Removed localStorage prefill; will hydrate from backend if needed
  useEffect(() => {}, []);

  const computeAge = (dobStr) => {
    if (!dobStr) return '';
    const d = new Date(dobStr);
    if (Number.isNaN(d.getTime())) return '';
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Removed user profile prefill from localStorage
  useEffect(() => {}, []);

  // Validation helper functions
  const validateAadhaar = (value) => {
    if (!value) return 'Required';
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleaned)) return 'Aadhaar must be exactly 12 digits';
    return '';
  };

  const validatePhone = (value) => {
    if (!value) return 'Required';
    const cleaned = value.replace(/\s|-/g, '');
    if (!/^[789]\d{9}$/.test(cleaned)) return 'Mobile number must be 10 digits starting with 7, 8, or 9';
    return '';
  };

  const validateLettersOnly = (value, fieldName) => {
    if (!value) return 'Required';
    if (!/^[a-zA-Z\s]+$/.test(value)) return `${fieldName} must contain only letters and spaces`;
    return '';
  };

  const validatePositiveNumber = (value, fieldName) => {
    if (!value) return 'Required';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return `${fieldName} must be a positive number`;
    return '';
  };

  const validateInteger = (value, fieldName) => {
    if (!value) return 'Required';
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) return `${fieldName} must be a positive whole number`;
    return '';
  };

  const validateAge = (value) => {
    if (!value) return 'Required';
    const age = Number(value);
    if (isNaN(age) || age < 21) return 'Age must be 21 or above';
    return '';
  };

  const validatePassport = (value) => {
    // Basic passport validation - alphanumeric, 6-9 characters
    if (value && !/^[A-Z0-9]{6,9}$/i.test(value)) {
      return 'Invalid passport number format';
    }
    return '';
  };

  // Universal change handler for all form fields with real-time validation
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    
    // Real-time validation
    if (name === 'aadharNumber') {
      error = validateAadhaar(value);
    } else if (name === 'phone' || name === 'ref1Contact' || name === 'ref2Contact') {
      error = validatePhone(value);
    } else if (['firstName', 'lastName', 'middleName', 'fatherName', 'ref1Name', 'ref2Name'].includes(name)) {
      error = validateLettersOnly(value, name.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()));
    } else if (name === 'age') {
      error = validateAge(value);
    } else if (['existingLoanType', 'ref1Relationship', 'ref2Relationship'].includes(name)) {
      error = validateLettersOnly(value, name.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()));
    } else if (['outstandingAmount', 'existingEmi', 'amount'].includes(name)) {
      error = validatePositiveNumber(value, name.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()));
    } else if (['tenureRemaining', 'duration', 'totalExperience'].includes(name)) {
      error = validateInteger(value, name.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()));
    } else if (name === 'passportNumber') {
      error = validatePassport(value);
    } else if (name === 'existingLender' || name === 'ref1Address' || name === 'ref2Address') {
      // Lender name and addresses can have letters, numbers, spaces, and common punctuation
      // Just ensure not empty if required
    }
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (error) {
        updated[`${name}Error`] = error;
      } else {
        delete updated[`${name}Error`];
      }
      return updated;
    });
  };

  // Sync checkbox state when formData is initialized from initialData
  useEffect(() => {
    if (initialData && formData.currentAddress && formData.currentAddress === formData.permanentAddress) {
      setSameAddressChecked(true);
    }
  }, [initialData]);

  const handleDobChange = (e) => {
    const value = e.target.value;
    const computedAge = computeAge(value);
    
    setFormData(prev => ({ 
      ...prev, 
      dob: value, 
      age: computedAge.toString()
    }));
  };

  const handleOccupationChange = (e) => {
    const value = e.target.value;
    
    // Prevent changing occupation type when editing rejected application
    if (existingDocs && initialData?.occupationType) {
      const originalType = initialData.occupationType;
      if (value !== originalType) {
        // Reset to original value
        e.target.value = originalType;
        setFormData(prev => ({ ...prev, occupationTypeError: `You can only select "${originalType}" as it matches your rejected application. Changing this would cause document conflicts.` }));
        setTimeout(() => {
          setFormData(prev => {
            const updated = { ...prev };
            delete updated.occupationTypeError;
            return updated;
          });
        }, 5000);
        return;
      }
    }
    
    setFormData(prev => {
      const newData = { ...prev, occupationType: value };
      // Clear error if exists
      delete newData.occupationTypeError;
      
      // Clear employer field for self-employed
      if (value === "Self-Employed") {
        newData.employer = "";
      }
      
      return newData;
    });
  };

  const handleHasLoansChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, hasLoans: value }));
  };

  const handleLoanTypeChange = (e) => {
    const value = e.target.value;
    
    // Prevent changing loan type when editing rejected application
    if (existingDocs && initialData?.loanType) {
      const originalType = initialData.loanType;
      if (value !== originalType) {
        // Reset to original value
        e.target.value = originalType;
        setFormData(prev => ({ ...prev, loanTypeError: `You can only select "${originalType}" as it matches your rejected application. Changing this would cause document conflicts.` }));
        setTimeout(() => {
          setFormData(prev => {
            const updated = { ...prev };
            delete updated.loanTypeError;
            return updated;
          });
        }, 5000);
        return;
      }
    }
    
    setFormData(prev => {
      const newData = { ...prev, loanType: value };
      // Clear error if exists
      delete newData.loanTypeError;
      return newData;
    });
  };

  useEffect(() => {}, [step, formData]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const steps = [
    "Personal Details",
    "Employee Details", 
    "Loan Details",
    "Existing Loan Details",
    "References",
    "Review",
  ];

  const validateStep = (data) => {
    const d = data ?? formData;
    const e = {};
    switch (step) {
      case 1:
        // Name validations - letters only
        if (!d.firstName) e.firstName = "Required";
        else if (!/^[a-zA-Z\s]+$/.test(d.firstName)) e.firstName = "First name must contain only letters";
        
        if (!d.lastName) e.lastName = "Required";
        else if (!/^[a-zA-Z\s]+$/.test(d.lastName)) e.lastName = "Last name must contain only letters";
        
        if (d.middleName && !/^[a-zA-Z\s]+$/.test(d.middleName)) e.middleName = "Middle name must contain only letters";
        
        if (!d.fatherName) e.fatherName = "Required";
        else if (!/^[a-zA-Z\s]+$/.test(d.fatherName)) e.fatherName = "Father name must contain only letters";
        
        // Phone validation - 10 digits starting with 7,8,9
        if (!d.phone) e.phone = "Required";
        else {
          const phoneCleaned = d.phone.replace(/\s|-/g, '');
          if (!/^[789]\d{9}$/.test(phoneCleaned)) e.phone = "Mobile must be 10 digits starting with 7, 8, or 9";
        }
        
        // Email
        if (!d.email) e.email = "Required";
        
        // Address
        if (!d.currentAddress) e.currentAddress = "Required";
        if (!d.permanentAddress) e.permanentAddress = "Required";
        
        // Other required fields
        if (!d.maritalStatus) e.maritalStatus = "Required";
        if (!d.gender) e.gender = "Required";
        if (!d.dob) e.dob = "Required";
        
        // Age validation - 21 and above
        if (!d.age) e.age = "Required";
        else {
          const age = Number(d.age);
          if (isNaN(age) || age < 21) e.age = "Age must be 21 or above";
        }
        
        // Aadhaar validation - 12 digits
        if (!d.aadharNumber) e.aadharNumber = "Required";
        else {
          const aadhaarCleaned = d.aadharNumber.replace(/\s/g, '');
          if (!/^\d{12}$/.test(aadhaarCleaned)) e.aadharNumber = "Aadhaar must be exactly 12 digits";
        }
        
        // PAN
        if (!d.panNumber) e.panNumber = "Required";
        
        // Passport (optional but validate if provided)
        if (d.passportNumber && !/^[A-Z0-9]{6,9}$/i.test(d.passportNumber)) {
          e.passportNumber = "Invalid passport number format";
        }
        
        // Qualification
        if (!d.highestQualification) e.highestQualification = "Required";
        
        // Personal Documents validation - mandatory for step 1 (excluding CIBIL, which is in step 4)
        const personalDocs = ['photograph', 'idProof', 'addressProof'];
        for (const doc of personalDocs) {
          const hasFile = uploadedFiles[doc];
          const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
          if (!hasFile && !hasExisting) {
            const docLabels = {
              photograph: 'Photograph',
              idProof: 'ID Proof',
              addressProof: 'Address Proof'
            };
            e[`doc_${doc}`] = `${docLabels[doc]} is required`;
          }
        }
        break;
      case 2:
        if (!d.occupationType) e.occupationType = "Required";
        // Only require employer for salaried employees
        if (d.occupationType === "Salaried" && !d.employer) e.employer = "Required";
        if (!d.designation) e.designation = "Required";
        
        // Total experience - whole numbers only
        if (!d.totalExperience) e.totalExperience = "Required";
        else {
          const exp = Number(d.totalExperience);
          if (isNaN(exp) || !Number.isInteger(exp) || exp < 0) e.totalExperience = "Total experience must be a positive whole number";
        }
        
        if (!d.officeAddress) e.officeAddress = "Required";
        
        // Employment Documents validation - mandatory based on occupation type
        if (d.occupationType === "Salaried") {
          const salariedDocs = ['salariedPayslip', 'salariedEmploymentProof', 'salariedItr', 'salariedBankStatements'];
          for (const doc of salariedDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabels = {
                salariedPayslip: 'Salary Slips',
                salariedEmploymentProof: 'Employment Proof',
                salariedItr: 'ITR',
                salariedBankStatements: 'Bank Statements'
              };
              e[`doc_${doc}`] = `${docLabels[doc]} is required for Salaried employees`;
            }
          }
        }
        
        if (d.occupationType === "Self-Employed") {
          const selfDocs = ['selfItr', 'selfGst', 'selfBankStatements'];
          for (const doc of selfDocs) {
            const hasFile = uploadedFiles[doc] || uploadedFiles['selfBusiness'];
            const hasExisting = (existingDocs && existingDocs[doc] && existingDocs[doc].length > 0) || 
                               (existingDocs && existingDocs['selfBusiness'] && existingDocs['selfBusiness'].length > 0);
            if (!hasFile && !hasExisting) {
              const docLabels = {
                selfItr: 'ITR',
                selfGst: 'Business Proof/GST',
                selfBankStatements: 'Bank Statements'
              };
              e[`doc_${doc}`] = `${docLabels[doc]} is required for Self-Employed`;
            }
          }
        }
        break;
      case 3:
        if (!d.loanType) e.loanType = "Required";
        
        // Loan amount - positive number only
        if (!d.amount) e.amount = "Required";
        else {
          const amount = Number(d.amount);
          if (isNaN(amount) || amount <= 0) e.amount = "Loan amount must be a positive number";
        }
        
        // Loan duration - positive months (integer)
        if (!d.duration) e.duration = "Required";
        else {
          const duration = Number(d.duration);
          if (isNaN(duration) || !Number.isInteger(duration) || duration <= 0) e.duration = "Loan duration must be a positive number of months";
        }
        
        if (!d.purpose) e.purpose = "Required";
        
        // Loan Documents validation - mandatory based on loan type
        if (d.loanType === "Home Loan") {
          const homeDocs = ['homeEc', 'homeSaleAgreements'];
          for (const doc of homeDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabels = {
                homeEc: 'EC Certificate',
                homeSaleAgreements: 'Sale Agreements'
              };
              e[`doc_${doc}`] = `${docLabels[doc]} is required for Home Loan`;
            }
          }
        }
        
        if (d.loanType === "Vehicle Loan") {
          const vehicleDocs = ['vehicleInvoice', 'vehicleQuotation'];
          for (const doc of vehicleDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabels = {
                vehicleInvoice: 'Vehicle Invoice',
                vehicleQuotation: 'Vehicle Quotation'
              };
              e[`doc_${doc}`] = `${docLabels[doc]} is required for Vehicle Loan`;
            }
          }
        }
        
        if (d.loanType === "Personal Loan") {
          const personalDocs = ['personalLoanReport'];
          for (const doc of personalDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              e[`doc_${doc}`] = `Income Certificate is required for Personal Loan`;
            }
          }
        }
        break;
      case 4:
        if (!d.hasLoans) e.hasLoans = "Required";
        if (d.hasLoans === "Yes") {
          // Existing loan type - letters and spaces only
          if (!d.existingLoanType) e.existingLoanType = "Required";
          else if (!/^[a-zA-Z\s]+$/.test(d.existingLoanType)) e.existingLoanType = "Loan type must contain only letters and spaces";
          
          // Lender name - letters and spaces only
          if (!d.existingLender) e.existingLender = "Required";
          else if (!/^[a-zA-Z\s]+$/.test(d.existingLender)) e.existingLender = "Lender name must contain only letters and spaces";
          
          // Outstanding amount - positive number
          if (!d.outstandingAmount) e.outstandingAmount = "Required";
          else {
            const amt = Number(d.outstandingAmount);
            if (isNaN(amt) || amt <= 0) e.outstandingAmount = "Outstanding amount must be a positive number";
          }
          
          // Monthly EMI - positive number
          if (!d.existingEmi) e.existingEmi = "Required";
          else {
            const emi = Number(d.existingEmi);
            if (isNaN(emi) || emi <= 0) e.existingEmi = "Monthly EMI must be a positive number";
          }
          
          // Tenure remaining - positive whole number
          if (!d.tenureRemaining) e.tenureRemaining = "Required";
          else {
            const tenure = Number(d.tenureRemaining);
            if (isNaN(tenure) || !Number.isInteger(tenure) || tenure <= 0)             e.tenureRemaining = "Tenure remaining must be a positive whole number (months)";
          }
        }
        
        // CIBIL Report validation - mandatory in existing loan section
        const hasCibilFile = uploadedFiles['cibilReport'];
        const hasCibilExisting = existingDocs && existingDocs['cibilReport'] && existingDocs['cibilReport'].length > 0;
        if (!hasCibilFile && !hasCibilExisting) {
          e['doc_cibilReport'] = "CIBIL Report is required";
        }
        break;
      case 5:
        // At least one reference mandatory
        if (!d.ref1Name || !d.ref1Relationship || !d.ref1Contact || !d.ref1Address) {
          // Reference 1 name - letters and spaces only
          if (!d.ref1Name) e.ref1Name = "Required";
          else if (!/^[a-zA-Z\s]+$/.test(d.ref1Name)) e.ref1Name = "Reference name must contain only letters and spaces";
          
          // Reference 1 relationship - letters and spaces only
          if (!d.ref1Relationship) e.ref1Relationship = "Required";
          else if (!/^[a-zA-Z\s]+$/.test(d.ref1Relationship)) e.ref1Relationship = "Relationship must contain only letters and spaces";
          
          // Reference 1 contact - 10 digits starting with 7,8,9
          if (!d.ref1Contact) e.ref1Contact = "Required";
          else {
            const phoneCleaned = d.ref1Contact.replace(/\s|-/g, '');
            if (!/^[789]\d{9}$/.test(phoneCleaned)) e.ref1Contact = "Mobile must be 10 digits starting with 7, 8, or 9";
          }
          
          if (!d.ref1Address) e.ref1Address = "Required";
        }
        
        // If reference 2 is provided, validate it too
        if (d.ref2Name || d.ref2Relationship || d.ref2Contact || d.ref2Address) {
          if (!d.ref2Name) e.ref2Name = "Required";
          else if (!/^[a-zA-Z\s]+$/.test(d.ref2Name)) e.ref2Name = "Reference name must contain only letters and spaces";
          
          if (!d.ref2Relationship) e.ref2Relationship = "Required";
          else if (!/^[a-zA-Z\s]+$/.test(d.ref2Relationship)) e.ref2Relationship = "Relationship must contain only letters and spaces";
          
          if (!d.ref2Contact) e.ref2Contact = "Required";
          else {
            const phoneCleaned = d.ref2Contact.replace(/\s|-/g, '');
            if (!/^[789]\d{9}$/.test(phoneCleaned)) e.ref2Contact = "Mobile must be 10 digits starting with 7, 8, or 9";
          }
          
          if (!d.ref2Address) e.ref2Address = "Required";
        }
        break;
      case 6:
        // Documents validation - all mandatory documents must be uploaded
        const mandatoryDocs = ['photograph', 'idProof', 'addressProof', 'cibilReport'];
        
        // Common mandatory documents
        for (const doc of mandatoryDocs) {
          const hasFile = uploadedFiles[doc];
          const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
          if (!hasFile && !hasExisting) {
            const docLabel = doc.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
            e[doc] = `${docLabel} is required`;
          }
        }
        
        // Conditional documents based on occupation and loan type
        if (d.occupationType === "Salaried") {
          const salariedDocs = ['salariedPayslip', 'salariedEmploymentProof', 'salariedItr', 'salariedBankStatements'];
          for (const doc of salariedDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabel = doc.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
              e[doc] = `${docLabel} is required for Salaried employees`;
            }
          }
        }
        
        if (d.occupationType === "Self-Employed") {
          const selfDocs = ['selfItr', 'selfGst', 'selfBankStatements'];
          for (const doc of selfDocs) {
            const hasFile = uploadedFiles[doc] || uploadedFiles['selfBusiness']; // selfBusiness also maps to GST
            const hasExisting = (existingDocs && existingDocs[doc] && existingDocs[doc].length > 0) || 
                               (existingDocs && existingDocs['selfBusiness'] && existingDocs['selfBusiness'].length > 0);
            if (!hasFile && !hasExisting) {
              const docLabel = doc === 'selfGst' ? 'Business Proof/GST' : doc.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
              e[doc] = `${docLabel} is required for Self-Employed`;
            }
          }
        }
        
        if (d.loanType === "Home Loan") {
          const homeDocs = ['homeEc', 'homeSaleAgreements'];
          for (const doc of homeDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabel = doc.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
              e[doc] = `${docLabel} is required for Home Loan`;
            }
          }
        }
        
        if (d.loanType === "Vehicle Loan") {
          const vehicleDocs = ['vehicleInvoice', 'vehicleQuotation'];
          for (const doc of vehicleDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabel = doc.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
              e[doc] = `${docLabel} is required for Vehicle Loan`;
            }
          }
        }
        
        if (d.loanType === "Personal Loan") {
          const personalDocs = ['personalLoanReport'];
          for (const doc of personalDocs) {
            const hasFile = uploadedFiles[doc];
            const hasExisting = existingDocs && existingDocs[doc] && existingDocs[doc].length > 0;
            if (!hasFile && !hasExisting) {
              const docLabel = doc.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
              e[doc] = `${docLabel} is required for Personal Loan`;
            }
          }
        }
        break;
      default:
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(7, s + 1));
  };

  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const Documents = () => (
    <div className="section-card">
      <h5 className="section-title">Documents Upload</h5>
      <div className="grid-2">
        {/* Common documents */}
        <div className="form-field">
          <label className="form-label">Photograph</label>
          <input name="photograph" type="file" className="form-control" onChange={handleFileChange} />
          {renderUploadedFile('photograph')}
          {renderExisting('photograph')}
        </div>
        <div className="form-field">
          <label className="form-label">ID Proof</label>
          <input name="idProof" type="file" className="form-control" onChange={handleFileChange} />
          {renderUploadedFile('idProof')}
          {renderExisting('idProof')}
        </div>
        <div className="form-field">
          <label className="form-label">Address Proof</label>
          <input name="addressProof" type="file" className="form-control" onChange={handleFileChange} />
          {renderUploadedFile('addressProof')}
          {renderExisting('addressProof')}
        </div>
        <div className="form-field">
          <label className="form-label">CIBIL Report</label>
          <input key="cibilReport-step1" name="cibilReport" type="file" className="form-control" onChange={handleFileChange} />
          {renderUploadedFile('cibilReport')}
          {renderExisting('cibilReport')}
        </div>

        {/* Conditional document fields based on occupation and loan type */}
        {formData.occupationType === "Salaried" && (
          <>
            <div className="form-field">
              <label className="form-label">Payslip</label>
              <input name="salariedPayslip" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('salariedPayslip')}
              {renderExisting('salariedPayslip')}
            </div>
            <div className="form-field">
              <label className="form-label">Employment Proof</label>
              <input name="salariedEmploymentProof" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('salariedEmploymentProof')}
              {renderExisting('salariedEmploymentProof')}
            </div>
            <div className="form-field">
              <label className="form-label">ITR (Salaried)</label>
              <input name="salariedItr" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('salariedItr')}
              {renderExisting('salariedItr')}
            </div>
          </>
        )}

        {formData.occupationType === "Self-Employed" && (
          <>
            <div className="form-field">
              <label className="form-label">ITR (Self-Employed)</label>
              <input name="selfItr" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('selfItr')}
              {renderExisting('selfItr')}
            </div>
            <div className="form-field">
              <label className="form-label">GST Registration</label>
              <input name="selfGst" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('selfGst')}
              {renderExisting('selfGst')}
            </div>
            <div className="form-field">
              <label className="form-label">Bank Statements (3-6 months)</label>
              <input name="selfBankStatements" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('selfBankStatements')}
              {renderExisting('selfBankStatements')}
            </div>
          </>
        )}

        {formData.loanType === "Home Loan" && (
          <>
            <div className="form-field">
              <label className="form-label">Encumbrance Certificate</label>
              <input key="homeEc-step1" name="homeEc" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('homeEc')}
              {renderExisting('homeEc')}
            </div>
            <div className="form-field">
              <label className="form-label">Sale Agreements</label>
              <input key="homeSaleAgreements-step1" name="homeSaleAgreements" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('homeSaleAgreements')}
              {renderExisting('homeSaleAgreements')}
            </div>
          </>
        )}

        {formData.loanType === "Vehicle Loan" && (
          <>
            <div className="form-field">
              <label className="form-label">Vehicle Invoice</label>
              <input name="vehicleInvoice" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('vehicleInvoice')}
              {renderExisting('vehicleInvoice')}
            </div>
            <div className="form-field">
              <label className="form-label">Vehicle Quotation</label>
              <input name="vehicleQuotation" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('vehicleQuotation')}
              {renderExisting('vehicleQuotation')}
            </div>
          </>
        )}

        {formData.loanType === "Personal Loan" && (
          <>
            <div className="form-field">
              <label className="form-label">Income Certificate</label>
              <input name="personalLoanReport" type="file" className="form-control" onChange={handleFileChange} />
              {renderUploadedFile('personalLoanReport')}
              {renderExisting('personalLoanReport')}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const Review = () => (
    <div className="section-card">
      <h5 className="section-title">Final Review</h5>

      {/* Personal Section */}
      <div className="section-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="section-title m-0">Personal Information</h6>
          <button type="button" className="btn btn-link p-0" onClick={() => setStep(1)}>Edit</button>
        </div>
        <div className="review-grid">
          {['firstName','middleName','lastName','phone','email','currentAddress','permanentAddress','maritalStatus','gender','dob','age','aadharNumber','panNumber','passportNumber','fatherName','highestQualification']
            .map(k => (
              <div key={k} className="review-item">
                <span className="review-key">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="review-value">{formData[k] || '-'}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Employment Section */}
      <div className="section-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="section-title m-0">Employment Details</h6>
          <button type="button" className="btn btn-link p-0" onClick={() => setStep(2)}>Edit</button>
        </div>
        <div className="review-grid">
          {['occupationType','employer','designation','totalExperience','officeAddress']
            .map(k => (
              <div key={k} className="review-item">
                <span className="review-key">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="review-value">{formData[k] || '-'}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Loan Section */}
      <div className="section-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="section-title m-0">Loan Details</h6>
          <button type="button" className="btn btn-link p-0" onClick={() => setStep(3)}>Edit</button>
        </div>
        <div className="review-grid">
          {['loanType','amount','duration','purpose']
            .map(k => (
              <div key={k} className="review-item">
                <span className="review-key">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="review-value">{formData[k] || '-'}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Existing Loans Section */}
      <div className="section-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="section-title m-0">Existing Loan Details</h6>
          <button type="button" className="btn btn-link p-0" onClick={() => setStep(4)}>Edit</button>
        </div>
        <div className="review-grid">
          {['hasLoans','existingLoanType','existingLender','outstandingAmount','existingEmi','tenureRemaining']
            .map(k => (
              <div key={k} className="review-item">
                <span className="review-key">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="review-value">{formData[k] || '-'}</span>
              </div>
            ))}
        </div>
      </div>

      {/* References Section */}
      <div className="section-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="section-title m-0">References</h6>
          <button type="button" className="btn btn-link p-0" onClick={() => setStep(5)}>Edit</button>
        </div>
        <div className="review-grid">
          {['ref1Name','ref1Relationship','ref1Contact','ref1Address','ref2Name','ref2Relationship','ref2Contact','ref2Address']
            .map(k => (
              <div key={k} className="review-item">
                <span className="review-key">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="review-value">{formData[k] || '-'}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Documents Section - show only submitted documents */}
      <div className="section-card mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="section-title m-0">Documents</h6>
          <span className="text-muted small">Click on uploaded files to view</span>
        </div>
        <div className="review-grid">
          {[
            // Common mandatory documents
            ['photograph','Photograph'],
            ['idProof','ID Proof'],
            ['addressProof','Address Proof'],
            ['cibilReport','CIBIL Report'],
            // Salaried documents
            ...(formData.occupationType === "Salaried" ? [
            ['salariedPayslip','Payslip'],
            ['salariedEmploymentProof','Employment Proof'],
            ['salariedItr','ITR (Salaried)'],
              ['salariedBankStatements','Bank Statements (Salaried)']
            ] : []),
            // Self-Employed documents
            ...(formData.occupationType === "Self-Employed" ? [
            ['selfItr','ITR (Self-Employed)'],
              ['selfGst','Business Proof/GST'],
            ['selfBusiness','Business Proof/GST'],
              ['selfBankStatements','Bank Statements (Self-Employed)']
            ] : []),
            // Home Loan documents
            ...(formData.loanType === "Home Loan" ? [
            ['homeEc','EC (Home Loan)'],
              ['homeSaleAgreements','Sale Agreements (Home)']
            ] : []),
            // Vehicle Loan documents
            ...(formData.loanType === "Vehicle Loan" ? [
            ['vehicleInvoice','Vehicle Invoice'],
              ['vehicleQuotation','Vehicle Quotation']
            ] : []),
            // Personal Loan documents
            ...(formData.loanType === "Personal Loan" ? [
            ['personalLoanReport','Income Certificate']
            ] : [])
          ]
          .filter(([key]) => {
            // Only show documents that are actually uploaded or exist
            const hasFile = uploadedFiles[key];
            const hasExisting = existingDocs && existingDocs[key] && existingDocs[key].length > 0;
            return hasFile || hasExisting;
          })
          .map(([key, label]) => {
            const hasFile = uploadedFiles[key];
            const hasExisting = existingDocs && existingDocs[key] && existingDocs[key].length > 0;
            return (
              <div key={key} className="review-item">
                <span className="review-key">{label}</span>
                <span className="review-value">
                  {hasFile ? (
                    <span 
                      className="file-link" 
                      onClick={() => handleViewFile(key)}
                      title="Click to view file"
                      style={{ color: '#0d6efd', cursor: 'pointer' }}
                    >
                      {formData[key] || 'Uploaded'}
                    </span>
                  ) : hasExisting ? (
                    <span>Uploaded</span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="submit-area">
        <button
          className="btn btn-primary-custom"
          type="button"
          onClick={handleFinalSubmit}
        >
          Submit Application
        </button>
      </div>
    </div>
  );

  const [submitting, setSubmitting] = useState(false);
  const handleFinalSubmit = () => {
    setConfirmModal({ show: true });
  };

  const confirmSubmission = async () => {
    setConfirmModal({ show: false });
    setSubmitting(true);
    try {
      let applicationId;
      
      // Use the onSubmit prop from parent (which handles both new and resubmit cases)
      if (onSubmit) {
        // onSubmit should return { applicationId } or we extract it from initialData if resubmit
        try {
          const result = await onSubmit(formData);
          // Extract applicationId from result or use initialData for resubmit
          applicationId = result?.applicationId;
          // For resubmit case, use the applicationId from initialData if not in result
          if (!applicationId && initialData?.applicationId && existingDocs) {
            applicationId = initialData.applicationId;
          }
        } catch (err) {
          throw err;
        }
      } else {
        // Fallback: direct submission (for backwards compatibility)
        const payload = mapUc3FormToLoanRequest(formData);
        const created = await submitApplication(null, payload);
        applicationId = created?.applicationId || created?.application?.applicationId;
      }

      // Upload ONLY NEW documents (those in uploadedFiles, not in existingDocs)
      // This ensures existing documents are preserved during resubmission
      const toDocType = {
        photograph: 'PHOTOGRAPH',
        idProof: 'IDENTITY_PROOF',
        addressProof: 'ADDRESS_PROOF',
        cibilReport: 'CIBIL_REPORT',
        salariedPayslip: 'SALARY_SLIPS',
        salariedEmploymentProof: 'EMPLOYMENT_PROOF',
        salariedItr: 'ITR_SALARIED',
        salariedBankStatements: 'BANK_STATEMENTS_SALARIED',
        selfItr: 'ITR_SELF_EMPLOYED',
        selfGst: 'BUSINESS_PROOF_GST',
        selfBusiness: 'BUSINESS_PROOF_GST',
        selfBankStatements: 'BANK_STATEMENTS_SELF_EMPLOYED',
        homeEc: 'EC_CERTIFICATE',
        homeSaleAgreements: 'SALE_AGREEMENT',
        vehicleInvoice: 'INVOICE_FROM_DEALER',
        vehicleQuotation: 'QUOTATION',
        personalLoanReport: 'INCOME_PROOF',
      };

      // Determine applicationId for document upload
      // For resubmit: use applicationId from onSubmit result or initialData
      // For new: use applicationId from submitApplication response
      const finalAppId = applicationId || (initialData?.applicationId && existingDocs ? initialData.applicationId : null);

      // Only upload files that are NEW (in uploadedFiles)
      // Existing documents are preserved automatically by the backend
      if (finalAppId || applicationId) {
        const appIdForDocs = finalAppId || applicationId;
        const entries = Object.entries(uploadedFiles || {});
        for (const [key, file] of entries) {
          // Only upload if a new file was selected (file exists in uploadedFiles)
          // Existing documents remain untouched - backend preserves them
          if (!file) {
            continue; // Skip if no new file
          }
          
          const type = toDocType[key];
          if (type && file) {
            try { 
              // Upload new/replacement document - backend handles update/replace logic
              await uploadDocument(appIdForDocs, type, file); 
            } catch (err) {
              console.warn(`Failed to upload ${key}:`, err);
              // Don't throw - continue with other documents
            }
          }
        }
      }

      // Navigate after successful submission (onSubmit handles API call, we handle navigation)
      navigate('/customer-dashboard/applications', {
        state: { message: 'Application submitted successfully!' }
      });
      
      // Reset local state (optional safety)
      setFormData((prev) => ({ ...prev, ...Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: '' }), {}) }));
      setUploadedFiles({});
      setStep(1);
    } catch (e) {
      setInfoModal({ show: true, title: 'Submission failed', message: e.message || 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Section title="Basic Information">
              <Field 
                label="First name" 
                name="firstName" 
                autoFocus 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Middle name" 
                name="middleName" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Last name" 
                name="lastName" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Phone number" 
                name="phone" 
                type="tel" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
                pattern="[789][0-9]{9}"
                maxLength="10"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Email" 
                name="email" 
                type="email" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <div className="form-field">
                <label className="form-label" htmlFor="currentAddress">Current address</label>
                <input
                  id="currentAddress"
                name="currentAddress" 
                  type="text"
                  value={formData.currentAddress || ""}
                  onChange={(e) => {
                    handleFieldChange(e);
                    // If checkbox is checked, update permanent address too
                    if (sameAddressChecked) {
                      setFormData(prev => ({ ...prev, currentAddress: e.target.value, permanentAddress: e.target.value }));
                    }
                  }}
                  className={`form-control ${errors.currentAddress ? "is-invalid" : ""}`}
                  autoComplete="on"
                />
                {errors.currentAddress && <div className="invalid-feedback">{errors.currentAddress}</div>}
                <label className="checkbox-label" style={{ marginTop: '6px', fontSize: '0.875rem', fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={sameAddressChecked}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSameAddressChecked(isChecked);
                      if (isChecked) {
                        // Copy current address to permanent address
                        setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
                      }
                      // When unchecked, permanent address remains as is (user can edit it)
                    }}
                    style={{ margin: 0, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>Same as permanent address</span>
                </label>
              </div>
              <Field 
                label="Permanent address" 
                name="permanentAddress" 
                formData={formData}
                errors={errors}
                handleFieldChange={(e) => {
                  handleFieldChange(e);
                  // If user manually edits permanent address, uncheck the checkbox
                  if (sameAddressChecked && e.target.value !== formData.currentAddress) {
                    setSameAddressChecked(false);
                  }
                }}
                disabled={sameAddressChecked}
              />
              <Field 
                label="Marital status" 
                name="maritalStatus" 
                as="select" 
                options={["Single", "Married", "Divorced", "Widowed"]} 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="Gender" 
                name="gender" 
                as="select" 
                options={["Male", "Female", "Other"]} 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="DOB" 
                name="dob" 
                type="date" 
                onChangeOverride={handleDobChange} 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <div className="form-field">
                <label className="form-label" htmlFor="age">Age (auto)</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age || ''}
                  readOnly
                  className={`form-control ${errors.age ? "is-invalid" : ""}`}
                />
                {errors.age && <div className="invalid-feedback">{errors.age}</div>}
              </div>
              <Field 
                label="Aadhar number" 
                name="aadharNumber" 
                type="text"
                pattern="[0-9]*"
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="PAN number" 
                name="panNumber" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="Passport number (optional)" 
                name="passportNumber" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="Father name" 
                name="fatherName" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Highest Qualification" 
                name="highestQualification" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
            </Section>
            <Section title="Personal Documents">
              <div className="form-field">
                <label className="form-label">Photograph *</label>
                <input name="photograph" type="file" className={`form-control ${errors['doc_photograph'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                {renderUploadedFile('photograph')}
                {renderExisting('photograph')}
                {errors['doc_photograph'] && <div className="invalid-feedback">{errors['doc_photograph']}</div>}
              </div>
              <div className="form-field">
                <label className="form-label">Identity Proof (Aadhaar/PAN/Passport/Voter ID/Driving License) *</label>
                <input name="idProof" type="file" className={`form-control ${errors['doc_idProof'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                {renderUploadedFile('idProof')}
                {renderExisting('idProof')}
                {errors['doc_idProof'] && <div className="invalid-feedback">{errors['doc_idProof']}</div>}
              </div>
              <div className="form-field">
                <label className="form-label">Address Proof (Aadhaar/Utility Bills/Rental Agreement/Passport) *</label>
                <input name="addressProof" type="file" className={`form-control ${errors['doc_addressProof'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                {renderUploadedFile('addressProof')}
                {renderExisting('addressProof')}
                {errors['doc_addressProof'] && <div className="invalid-feedback">{errors['doc_addressProof']}</div>}
              </div>
            </Section>
          </>
        );
      case 2:
        return (
          <>
            <Section title="Employment Details">
              <Field 
                label="Occupation type" 
                name="occupationType" 
                as="select" 
                options={["Salaried", "Self-Employed"]} 
                autoFocus 
                onChangeOverride={handleOccupationChange} 
                disabled={!!existingDocs}
                className={existingDocs ? "bg-light" : ""}
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              {existingDocs && (
                <div className="alert alert-info mt-2 mb-0" style={{ fontSize: '0.875rem', padding: '8px 12px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Occupation type locked:</strong> You can only use "{initialData?.occupationType || formData.occupationType}" as it matches your rejected application. You cannot change occupation type or loan type, but you can edit all other details including documents within the same application form.
                </div>
              )}
              {formData.occupationTypeError && (
                <div className="alert alert-warning mt-2 mb-0" style={{ fontSize: '0.875rem', padding: '8px 12px' }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {formData.occupationTypeError}
                </div>
              )}
              
              {/* Conditionally render employer field only for salaried employees */}
              {formData.occupationType === "Salaried" && (
                <Field 
                  label="Employer" 
                  name="employer" 
                  formData={formData}
                  errors={errors}
                  handleFieldChange={handleFieldChange}
                />
              )}
              
              {/* Show business name for self-employed instead */}
              {formData.occupationType === "Self-Employed" && (
                <Field 
                  label="Business Name" 
                  name="employer" 
                  placeholder="Enter your business name"
                  formData={formData}
                  errors={errors}
                  handleFieldChange={handleFieldChange}
                />
              )}
              
              <Field 
                label={formData.occupationType === "Self-Employed" ? "Job Title / Role" : "Designation"} 
                name="designation" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="Total work experience (years)" 
                name="totalExperience" 
                type="number"
                min="0"
                step="1"
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label={formData.occupationType === "Self-Employed" ? "Business Address" : "Office Address"} 
                name="officeAddress" 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
            </Section>
            
            {/* Employment Documents for Salaried */}
            {formData.occupationType === "Salaried" && (
              <Section title="Employment Documents (Salaried)">
                <div className="form-field">
                  <label className="form-label">Salary Slips (3-6 months) *</label>
                  <input name="salariedPayslip" type="file" className={`form-control ${errors['doc_salariedPayslip'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('salariedPayslip')}
                  {renderExisting('salariedPayslip')}
                  {errors['doc_salariedPayslip'] && <div className="invalid-feedback">{errors['doc_salariedPayslip']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">ITR (Last 2-3 years) *</label>
                  <input name="salariedItr" type="file" className={`form-control ${errors['doc_salariedItr'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('salariedItr')}
                  {renderExisting('salariedItr')}
                  {errors['doc_salariedItr'] && <div className="invalid-feedback">{errors['doc_salariedItr']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">Bank Statements (6 months) *</label>
                  <input name="salariedBankStatements" type="file" className={`form-control ${errors['doc_salariedBankStatements'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('salariedBankStatements')}
                  {renderExisting('salariedBankStatements')}
                  {errors['doc_salariedBankStatements'] && <div className="invalid-feedback">{errors['doc_salariedBankStatements']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">Employment Proof (Offer Letter/Employee ID/HR Letter) *</label>
                  <input name="salariedEmploymentProof" type="file" className={`form-control ${errors['doc_salariedEmploymentProof'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('salariedEmploymentProof')}
                  {renderExisting('salariedEmploymentProof')}
                  {errors['doc_salariedEmploymentProof'] && <div className="invalid-feedback">{errors['doc_salariedEmploymentProof']}</div>}
                </div>
              </Section>
            )}
            
            {/* Employment Documents for Self-Employed */}
            {formData.occupationType === "Self-Employed" && (
              <Section title="Employment Documents (Self-Employed)">
                <div className="form-field">
                  <label className="form-label">Business Proof/GST/Registration Certificate *</label>
                  <input name="selfBusiness" type="file" className={`form-control ${errors['doc_selfGst'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('selfBusiness')}
                  {renderExisting('selfBusiness')}
                  {errors['doc_selfGst'] && <div className="invalid-feedback">{errors['doc_selfGst']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">ITR (Last 2-3 years) *</label>
                  <input name="selfItr" type="file" className={`form-control ${errors['doc_selfItr'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('selfItr')}
                  {renderExisting('selfItr')}
                  {errors['doc_selfItr'] && <div className="invalid-feedback">{errors['doc_selfItr']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">Bank Statements (6-12 months) *</label>
                  <input name="selfBankStatements" type="file" className={`form-control ${errors['doc_selfBankStatements'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('selfBankStatements')}
                  {renderExisting('selfBankStatements')}
                  {errors['doc_selfBankStatements'] && <div className="invalid-feedback">{errors['doc_selfBankStatements']}</div>}
                </div>
              </Section>
            )}
          </>
        );
      case 3:
        return (
          <>
            <Section title="Loan Details">
              <Field 
                label="Loan type" 
                name="loanType" 
                as="select" 
                options={["Personal Loan", "Vehicle Loan", "Home Loan"]} 
                autoFocus 
                onChangeOverride={handleLoanTypeChange} 
                disabled={!!existingDocs}
                className={existingDocs ? "bg-light" : ""}
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              {existingDocs && (
                <div className="alert alert-info mt-2 mb-0" style={{ fontSize: '0.875rem', padding: '8px 12px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Loan type locked:</strong> You can only use "{initialData?.loanType || formData.loanType}" as it matches your rejected application. You cannot change loan type or occupation type, but you can edit all other details including documents within the same application form.
                </div>
              )}
              {formData.loanTypeError && (
                <div className="alert alert-warning mt-2 mb-0" style={{ fontSize: '0.875rem', padding: '8px 12px' }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {formData.loanTypeError}
                </div>
              )}
              <Field 
                label="Loan amount (₹)" 
                name="amount" 
                type="number" 
                placeholder="e.g., 500000"
                min="1"
                step="1"
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="Loan duration (months)" 
                name="duration" 
                type="number" 
                placeholder="e.g., 60"
                min="1"
                step="1"
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              <Field 
                label="Purpose of loan" 
                name="purpose" 
                placeholder="e.g., Home renovation, Education, Vehicle purchase"
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
            </Section>
            
            {/* Loan Type Specific Documents */}
            {formData.loanType === "Home Loan" && (
              <Section title="Loan Documents (Home Loan)">
                <div className="form-field">
                  <label className="form-label">Sale Agreement *</label>
                  <input key="homeSaleAgreements-step3" name="homeSaleAgreements" type="file" className={`form-control ${errors['doc_homeSaleAgreements'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('homeSaleAgreements')}
                  {renderExisting('homeSaleAgreements')}
                  {errors['doc_homeSaleAgreements'] && <div className="invalid-feedback">{errors['doc_homeSaleAgreements']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">EC (Encumbrance Certificate) *</label>
                  <input key="homeEc-step3" name="homeEc" type="file" className={`form-control ${errors['doc_homeEc'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('homeEc')}
                  {renderExisting('homeEc')}
                  {errors['doc_homeEc'] && <div className="invalid-feedback">{errors['doc_homeEc']}</div>}
                </div>
              </Section>
            )}
            
            {formData.loanType === "Vehicle Loan" && (
              <Section title="Loan Documents (Vehicle Loan)">
                <div className="form-field">
                  <label className="form-label">Invoice from Dealer *</label>
                  <input name="vehicleInvoice" type="file" className={`form-control ${errors['doc_vehicleInvoice'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('vehicleInvoice')}
                  {renderExisting('vehicleInvoice')}
                  {errors['doc_vehicleInvoice'] && <div className="invalid-feedback">{errors['doc_vehicleInvoice']}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">Quotation *</label>
                  <input name="vehicleQuotation" type="file" className={`form-control ${errors['doc_vehicleQuotation'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('vehicleQuotation')}
                  {renderExisting('vehicleQuotation')}
                  {errors['doc_vehicleQuotation'] && <div className="invalid-feedback">{errors['doc_vehicleQuotation']}</div>}
                </div>
              </Section>
            )}
            
            {formData.loanType === "Personal Loan" && (
              <Section title="Loan Documents (Personal Loan)">
                <div className="form-field">
                  <label className="form-label">Income Certificate *</label>
                  <input name="personalLoanReport" type="file" className={`form-control ${errors['doc_personalLoanReport'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('personalLoanReport')}
                  {renderExisting('personalLoanReport')}
                  {errors['doc_personalLoanReport'] && <div className="invalid-feedback">{errors['doc_personalLoanReport']}</div>}
                </div>
              </Section>
            )}
          </>
        );
      case 4:
        return (
          <>
            <Section title="Existing Loan Details">
              <Field 
                label="Do you have existing loans?" 
                name="hasLoans" 
                as="select" 
                options={["No", "Yes"]} 
                autoFocus 
                onChangeOverride={handleHasLoansChange} 
                formData={formData}
                errors={errors}
                handleFieldChange={handleFieldChange}
              />
              {formData.hasLoans === "Yes" && (
                <>
                  <Field 
                    label="Existing loan type" 
                    name="existingLoanType" 
                    placeholder="e.g., Personal Loan, Car Loan"
                    pattern="[A-Za-z\s]*"
                    formData={formData}
                    errors={errors}
                    handleFieldChange={handleFieldChange}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <Field 
                    label="Lender name" 
                    name="existingLender" 
                    placeholder="e.g., HDFC Bank"
                    pattern="[A-Za-z\s]*"
                    formData={formData}
                    errors={errors}
                    handleFieldChange={handleFieldChange}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <Field 
                    label="Outstanding amount (₹)" 
                    name="outstandingAmount" 
                    type="number" 
                    placeholder="e.g., 200000"
                    min="1"
                    step="1"
                    formData={formData}
                    errors={errors}
                    handleFieldChange={handleFieldChange}
                  />
                  <Field 
                    label="Monthly EMI (₹)" 
                    name="existingEmi" 
                    type="number" 
                    placeholder="e.g., 15000"
                    min="1"
                    step="1"
                    formData={formData}
                    errors={errors}
                    handleFieldChange={handleFieldChange}
                  />
                  <Field 
                    label="Tenure remaining (months)" 
                    name="tenureRemaining" 
                    type="number" 
                    placeholder="e.g., 24"
                    min="1"
                    step="1"
                    formData={formData}
                    errors={errors}
                    handleFieldChange={handleFieldChange}
                  />
                </>
              )}
            </Section>
            
            {/* CIBIL Report for Existing Loans */}
              <Section title="CIBIL Report">
                <div className="form-field">
                  <label className="form-label">CIBIL Report *</label>
                  <input key="cibilReport-step4" name="cibilReport" type="file" className={`form-control ${errors['doc_cibilReport'] ? "is-invalid" : ""}`} onChange={handleFileChange} />
                  {renderUploadedFile('cibilReport')}
                  {renderExisting('cibilReport')}
                  {errors['doc_cibilReport'] && <div className="invalid-feedback">{errors['doc_cibilReport']}</div>}
                </div>
              </Section>
          </>
        );
      case 5:
        return (
          <>
            <Section title="References">
              <Field 
                label="Reference 1 - Name" 
                name="ref1Name" 
                formData={formData} 
                errors={errors} 
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Reference 1 - Relationship" 
                name="ref1Relationship" 
                formData={formData} 
                errors={errors} 
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Reference 1 - Contact number" 
                name="ref1Contact" 
                type="tel"
                pattern="[789][0-9]{9}"
                maxLength="10"
                formData={formData} 
                errors={errors} 
                handleFieldChange={handleFieldChange}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field label="Reference 1 - Address" name="ref1Address" formData={formData} errors={errors} handleFieldChange={handleFieldChange} />

              <Field 
                label="Reference 2 - Name" 
                name="ref2Name" 
                formData={formData} 
                errors={errors} 
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Reference 2 - Relationship" 
                name="ref2Relationship" 
                formData={formData} 
                errors={errors} 
                handleFieldChange={handleFieldChange}
                pattern="[A-Za-z\s]*"
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field 
                label="Reference 2 - Contact number" 
                name="ref2Contact" 
                type="tel"
                pattern="[789][0-9]{9}"
                maxLength="10"
                formData={formData} 
                errors={errors} 
                handleFieldChange={handleFieldChange}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <Field label="Reference 2 - Address" name="ref2Address" formData={formData} errors={errors} handleFieldChange={handleFieldChange} />
            </Section>
          </>
        );
      case 6:
        return <Review />;
      default:
        return null;
    }
  };

  return (
    <div className="uc3-app">
      <div className="uc3-container">
        <h2 className="uc3-title">Loan Application</h2>

        <div className="steps steps-inline">
          {steps.map((t, i) => (
            <React.Fragment key={t}>
              <div className={`step-item ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "completed" : ""}`}>
                <div className="step-circle">{i + 1}</div>
                <div className="step-label">{t}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-connector ${step > i + 1 ? 'completed' : ''}`} aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (step < 6) {
            nextStep();
          } else {
            handleFinalSubmit();
          }
        }}>
          {renderStep()}
          <div className="nav-actions">
            <button className="btn btn-primary-custom nav-back" type="button" onClick={prevStep} disabled={step === 1}>Previous</button>
            <button className="btn btn-primary-custom nav-next" type="submit" disabled={submitting}>{step < 6 ? 'Next' : (submitting ? 'Submitting...' : 'Finish')}</button>
          </div>
        </form>
      </div>
        <AllPopup
          show={infoModal.show}
          title={infoModal.title}
          message={infoModal.message}
          onClose={() => setInfoModal({ ...infoModal, show: false })}
        />
        <AllPopup
          show={confirmModal.show}
          title="Confirm Submission"
          message="Are you sure you want to submit your loan application? Please review all information before confirming."
          onClose={() => setConfirmModal({ show: false })}
          onConfirm={confirmSubmission}
          confirmText="Confirm & Submit"
          cancelText="Cancel"
          confirmVariant="success"
        />

        {/* File Preview Modal */}
        {previewFile && previewUrl && (
          <div 
            className="file-preview-overlay" 
            onClick={handleClosePreview}
          >
            <div 
              className="file-preview-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '15px 20px',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h5 style={{ margin: 0, flex: 1 }}>{previewFile.name}</h5>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {previewFile.file && (
                    <a
                      href={previewUrl}
                      download={previewFile.name}
                      className="btn btn-sm btn-outline-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      <i className="bi bi-download me-1"></i>Download
                    </a>
                  )}
                  <button
                    onClick={handleClosePreview}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '0',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                {previewFile.type?.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt={previewFile.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain'
                    }}
                  />
                ) : previewFile.type === 'application/pdf' || previewFile.name?.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={`${previewUrl}`}
                    style={{
                      width: '100%',
                      height: '70vh',
                      border: 'none',
                      borderRadius: '4px',
                      display: 'block'
                    }}
                    title={previewFile.name}
                  >
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ marginBottom: '15px', color: '#666' }}>
                        PDF preview not available in this browser.
                      </p>
                      <a
                        href={previewUrl}
                        download={previewFile.name}
                        className="btn btn-primary"
                      >
                        <i className="bi bi-download me-2"></i>Download to View
                      </a>
                    </div>
                  </iframe>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="bi bi-file-earmark" style={{ fontSize: '48px', color: '#007bff' }}></i>
                    <p style={{ marginTop: '15px', color: '#666' }}>
                      Preview not available for this file type
                    </p>
                    <a
                      href={previewUrl}
                      download={previewFile.name}
                      className="btn btn-primary"
                      style={{ marginTop: '15px' }}
                    >
                      <i className="bi bi-download me-2"></i>Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
