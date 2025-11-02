import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CheckerApplicationReview.css";
import { getCheckerApplicationById, reviewCheckerApplication } from "../api/apiChecker";
import { listDocumentIdsByApplication, getDocument } from "../api/documents";
import { formatLoanType, formatMaritalStatus, formatGender, formatOccupationType } from "../utils/enumFormatters";

export default function CheckerApplicationReview() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [application, setApplication] = useState(null);
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [preview, setPreview] = useState({ show: false, url: null, name: '', type: '' });
  const [toast, setToast] = useState({ show: false, variant: 'info', message: '', actionText: '', onAction: null });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        setError("");
        const [details, docIds] = await Promise.all([
          getCheckerApplicationById(id),
          listDocumentIdsByApplication(id),
        ]);
        if (!mounted) return;
        setApplication(details);
        setDocs(docIds || []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load application");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const docsByType = useMemo(() => {
    const map = {};
    (docs || []).forEach((d) => {
      const t = d.documentType;
      if (!t) return;
      (map[t] = map[t] || []).push(d);
    });
    return map;
  }, [docs]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h4>Failed to load</h4>
        <p className="text-muted">{error}</p>
        <Link to="../dashboard" className="btn btn-primary-custom">Back to Dashboard</Link>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-5">
        <h4>Application Not Found</h4>
        <p className="text-muted">The requested application could not be found.</p>
        <Link to="../dashboard" className="btn btn-primary-custom">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const p = application.personalDetails || {};
  const e = application.employmentDetails || {};
  const l = application.loanDetails || {};
  const x = application.existingLoanDetails || {};
  const r = application.references || [];
  const makerComments = (application.comments || []).filter(c => String(c.commentType || '').startsWith('MAKER_'));

  const openDoc = async (doc) => {
    try {
      const blob = await getDocument(doc.id);
      const url = URL.createObjectURL(blob);
      setPreview({ show: true, url, name: docTypeLabel(doc.documentType), type: blob.type || '' });
    } catch (err) {
      setToast({ show: true, variant: 'danger', message: err.message || 'Unable to open document', actionText: 'Close', onAction: () => setToast({ ...toast, show: false }) });
    }
  };

  const closePreview = () => {
    if (preview.url) URL.revokeObjectURL(preview.url);
    setPreview({ show: false, url: null, name: '', type: '' });
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: "bi-person" },
    { id: "employment", label: "Employment", icon: "bi-briefcase" },
    { id: "loan", label: "Loan Details", icon: "bi-credit-card" },
    { id: "existing", label: "Existing Loans", icon: "bi-bank" },
    { id: "references", label: "References", icon: "bi-people" },
    { id: "maker-comments", label: "Maker Comments", icon: "bi-chat-dots" },
    { id: "review", label: "Review", icon: "bi-check-circle" }
  ];

  const docTypeLabel = (t) => ({
    PHOTOGRAPH: 'Photograph',
    IDENTITY_PROOF: 'ID Proof',
    ADDRESS_PROOF: 'Address Proof',
    CIBIL_REPORT: 'CIBIL Report',
    SALARY_SLIPS: 'Salary Slips',
    EMPLOYMENT_PROOF: 'Employment Proof',
    ITR_SALARIED: 'ITR (Salaried)',
    BANK_STATEMENTS_SALARIED: 'Bank Statements (Salaried)',
    BUSINESS_PROOF_GST: 'Business Proof/GST',
    ITR_SELF_EMPLOYED: 'ITR (Self-Employed)',
    BANK_STATEMENTS_SELF_EMPLOYED: 'Bank Statements (Self-Employed)',
    SALE_AGREEMENT: 'Sale Agreement',
    EC_CERTIFICATE: 'Encumbrance Certificate',
    INVOICE_FROM_DEALER: 'Invoice from Dealer',
    QUOTATION: 'Quotation',
    INCOME_PROOF: 'Income Proof',
  }[t] || (String(t||'').replace(/_/g,' ').replace(/\b[a-z]/g, c => c.toUpperCase()).trim()));

  const humanizeField = s => String(s||'')
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, c => c.toUpperCase())
    .replace(/\b(aadhaar|emi|pan)\b/gi, v => v.toUpperCase())
    .replace(/\bdob\b/gi, 'DOB')
    .trim();

  const renderPersonalDetails = () => (
    <>
    <div className="row g-3">
        <div className="col-md-3"><div className="details-card"><h6>Full Name</h6><p className="fw-semibold text-primary">{[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' ')}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Date of Birth</h6><p className="fw-semibold text-primary">{p.dateOfBirth}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Gender</h6><p className="fw-semibold text-primary">{formatGender(p.gender)}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Marital Status</h6><p className="fw-semibold text-primary">{formatMaritalStatus(p.maritalStatus)}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Phone Number</h6><p className="fw-semibold text-primary">{p.phoneNumber}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Email</h6><p className="fw-semibold text-primary">{p.emailAddress}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Father's Name</h6><p className="fw-semibold text-primary">{p.fatherName}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Aadhaar Number</h6><p className="fw-semibold text-primary">{p.aadhaarNumber}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>PAN Number</h6><p className="fw-semibold text-primary">{p.panNumber}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Passport Number</h6><p className="fw-semibold text-primary">{p.passportNumber || 'N/A'}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Education</h6><p className="fw-semibold text-primary">{p.educationDetails}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Current Address</h6><p className="fw-semibold text-primary">{p.currentAddress}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Permanent Address</h6><p className="fw-semibold text-primary">{p.permanentAddress}</p></div></div>
      </div>
      <h6 className="mt-4"><i className="bi bi-file-earmark-text me-2"></i>Personal Documents</h6>
      {renderDocItems(['PHOTOGRAPH','IDENTITY_PROOF','ADDRESS_PROOF'])}
    </>
  );

  const renderEmploymentDetails = () => (
    <>
    <div className="row g-3">
        <div className="col-md-6"><div className="details-card"><h6>Occupation Type</h6><p className="fw-semibold text-primary">{formatOccupationType(e.occupationType)}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Employer</h6><p className="fw-semibold text-primary">{e.employerOrBusinessName}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Designation</h6><p className="fw-semibold text-primary">{e.designation}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Total Work Experience</h6><p className="fw-semibold text-primary">{e.totalWorkExperienceYears}</p></div></div>
        <div className="col-12"><div className="details-card"><h6>Office Address</h6><p className="fw-semibold text-primary">{e.officeAddress}</p></div></div>
      </div>
      <h6 className="mt-4"><i className="bi bi-briefcase me-2"></i>Employment Documents</h6>
      {renderDocItems([
        'SALARY_SLIPS','ITR_SALARIED','BANK_STATEMENTS_SALARIED','EMPLOYMENT_PROOF',
        'BUSINESS_PROOF_GST','ITR_SELF_EMPLOYED','BANK_STATEMENTS_SELF_EMPLOYED'])}
    </>
  );

  const renderLoanDetails = () => (
    <>
    <div className="row g-3">
        <div className="col-md-6"><div className="details-card"><h6>Loan Type</h6><p className="fw-semibold text-primary">{formatLoanType(l.loanType)}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Loan Amount</h6><p className="fw-semibold text-primary">₹{(l.loanAmount || 0).toLocaleString()}</p></div></div>
        <div className="col-md-6"><div className="details-card"><h6>Loan Duration</h6><p className="fw-semibold text-primary">{l.loanDurationMonths} months</p></div></div>
        {l.purposeOfLoan && <div className="col-md-6"><div className="details-card"><h6>Purpose of Loan</h6><p className="fw-semibold text-primary">{l.purposeOfLoan}</p></div></div>}
      </div>
      <h6 className="mt-4"><i className="bi bi-credit-card me-2"></i>Loan Documents</h6>
      {renderDocItems(['SALE_AGREEMENT','EC_CERTIFICATE','INVOICE_FROM_DEALER','QUOTATION','INCOME_PROOF'])}
    </>
  );

  const renderExistingLoanDetails = () => (
    <>
    <div className="row g-3">
        <div className="col-md-3"><div className="details-card"><h6>Has Existing Loans</h6><p className="fw-semibold text-primary">{x.hasExistingLoans ? 'Yes' : 'No'}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Existing Loan Type</h6><p className="fw-semibold text-primary">{x.existingLoanType || '—'}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Lender</h6><p className="fw-semibold text-primary">{x.lenderName || '—'}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Outstanding Amount</h6><p className="fw-semibold text-primary">{x.outstandingAmount ? `₹${(x.outstandingAmount || 0).toLocaleString()}` : '—'}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Monthly EMI</h6><p className="fw-semibold text-primary">{x.monthlyEmi ? `₹${(x.monthlyEmi || 0).toLocaleString()}` : '—'}</p></div></div>
        <div className="col-md-3"><div className="details-card"><h6>Tenure Remaining</h6><p className="fw-semibold text-primary">{x.tenureRemainingMonths ? `${x.tenureRemainingMonths} months` : '—'}</p></div></div>
      </div>
      <h6 className="mt-4"><i className="bi bi-bank me-2"></i>Existing Loan Documents</h6>
      {renderDocItems(['CIBIL_REPORT'])}
    </>
  );

  const renderReferences = () => (
    <div className="row g-3">
      {(r && r.length) ? (
        r.map((ref, idx) => (
          <div key={idx} className="col-md-6">
            <div className="details-card">
              <h6 className="mb-3">Reference {idx+1}</h6>
              <div className="row g-2">
                <div className="col-12"><div className="details-card-small"><h6 className="mb-1">Name</h6><p className="fw-semibold text-primary mb-0">{ref.name || '-'}</p></div></div>
                <div className="col-md-6"><div className="details-card-small"><h6 className="mb-1">Relationship</h6><p className="fw-semibold text-primary mb-0">{ref.relationship || '-'}</p></div></div>
                <div className="col-md-6"><div className="details-card-small"><h6 className="mb-1">Contact</h6><p className="fw-semibold text-primary mb-0">{ref.contactNumber || '-'}</p></div></div>
                <div className="col-12"><div className="details-card-small"><h6 className="mb-1">Address</h6><p className="fw-semibold text-primary mb-0">{ref.address || '-'}</p></div></div>
              </div>
      </div>
      </div>
        ))
      ) : (
        <div className="text-center py-4"><i className="bi bi-people display-4 text-muted"></i><p className="text-muted mt-2">No references added.</p></div>
      )}
    </div>
  );

  const getDocIcon = (type) => {
    const iconMap = {
      PHOTOGRAPH: 'bi-camera',
      IDENTITY_PROOF: 'bi-person-badge',
      ADDRESS_PROOF: 'bi-house',
      CIBIL_REPORT: 'bi-graph-up',
      SALARY_SLIPS: 'bi-receipt',
      EMPLOYMENT_PROOF: 'bi-briefcase',
      ITR_SALARIED: 'bi-file-earmark-text',
      BANK_STATEMENTS_SALARIED: 'bi-bank',
      BUSINESS_PROOF_GST: 'bi-building',
      ITR_SELF_EMPLOYED: 'bi-file-earmark-spreadsheet',
      BANK_STATEMENTS_SELF_EMPLOYED: 'bi-bank2',
      SALE_AGREEMENT: 'bi-file-earmark-check',
      EC_CERTIFICATE: 'bi-shield-check',
      INVOICE_FROM_DEALER: 'bi-receipt-cutoff',
      QUOTATION: 'bi-calculator',
      INCOME_PROOF: 'bi-cash-stack'
    };
    return iconMap[type] || 'bi-file-earmark';
  };

  const renderDocItems = (types) => {
    const present = (types || []).filter((t) => Array.isArray(docsByType[t]) && docsByType[t].length);
    if (!present.length) return <div className="text-muted"><i className="bi bi-inbox me-2"></i>No documents uploaded in this section</div>;
    return (
      <div className="docs-grid">
        {present.map((t) => (
          <div key={`doc-${t}`} className="doc-item">
            <i className="bi bi-file-earmark-check text-success" style={{ fontSize: '1.1rem' }}></i>
            <span className="doc-label">{docTypeLabel(t)}</span>
            {docsByType[t].map((d, idx) => (
              <button 
                key={`doc-${t}-${d.id}`} 
                className="btn btn-link p-0 text-decoration-none" 
                onClick={() => openDoc(d)} 
                title={`View ${docTypeLabel(t)}`}
                aria-label={`View ${docTypeLabel(t)}`}
              >
                <i className="bi bi-file-earmark-text" style={{ fontSize: '1.1rem', color: '#0d6efd' }}></i>
              </button>
            ))}
                  </div>
                ))}
              </div>
    );
  };

  const renderReview = () => (
      <div>
        <div className="row g-3 mb-4">
          <div className="col-12"><h5 className="text-primary mb-3"><i className="bi bi-person me-2"></i>Personal Information</h5></div>
          <div className="col-md-3"><div className="details-card"><h6>Full Name</h6><p className="fw-semibold text-primary">{[p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ') || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Phone</h6><p className="fw-semibold text-primary">{p.phoneNumber || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Email</h6><p className="fw-semibold text-primary">{p.emailAddress || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Date of Birth</h6><p className="fw-semibold text-primary">{p.dateOfBirth || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Marital Status</h6><p className="fw-semibold text-primary">{formatMaritalStatus(p.maritalStatus) || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Gender</h6><p className="fw-semibold text-primary">{formatGender(p.gender) || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Aadhaar Number</h6><p className="fw-semibold text-primary">{p.aadhaarNumber || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>PAN Number</h6><p className="fw-semibold text-primary">{p.panNumber || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Passport Number</h6><p className="fw-semibold text-primary">{p.passportNumber || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Father's Name</h6><p className="fw-semibold text-primary">{p.fatherName || '-'}</p></div></div>
          <div className="col-md-3"><div className="details-card"><h6>Education</h6><p className="fw-semibold text-primary">{p.educationDetails || '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Current Address</h6><p className="fw-semibold text-primary">{p.currentAddress || '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Permanent Address</h6><p className="fw-semibold text-primary">{p.permanentAddress || '-'}</p></div></div>
            </div>

        <div className="row g-3 mb-4">
          <div className="col-12"><h5 className="text-primary mb-3"><i className="bi bi-briefcase me-2"></i>Employment Details</h5></div>
          <div className="col-md-6"><div className="details-card"><h6>Occupation Type</h6><p className="fw-semibold text-primary">{formatOccupationType(e.occupationType) || '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Employer</h6><p className="fw-semibold text-primary">{e.employerOrBusinessName || '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Designation</h6><p className="fw-semibold text-primary">{e.designation || '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Total Work Experience</h6><p className="fw-semibold text-primary">{e.totalWorkExperienceYears ? `${e.totalWorkExperienceYears} years` : '-'}</p></div></div>
          <div className="col-12"><div className="details-card"><h6>Office Address</h6><p className="fw-semibold text-primary">{e.officeAddress || '-'}</p></div></div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12"><h5 className="text-primary mb-3"><i className="bi bi-credit-card me-2"></i>Loan Details</h5></div>
          <div className="col-md-6"><div className="details-card"><h6>Loan Type</h6><p className="fw-semibold text-primary">{formatLoanType(l.loanType) || '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Loan Amount</h6><p className="fw-semibold text-primary">{l.loanAmount ? `₹${(l.loanAmount || 0).toLocaleString()}` : '-'}</p></div></div>
          <div className="col-md-6"><div className="details-card"><h6>Loan Duration</h6><p className="fw-semibold text-primary">{l.loanDurationMonths ? `${l.loanDurationMonths} months` : '-'}</p></div></div>
          {l.purposeOfLoan && <div className="col-md-6"><div className="details-card"><h6>Purpose of Loan</h6><p className="fw-semibold text-primary">{l.purposeOfLoan}</p></div></div>}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12"><h5 className="text-primary mb-3"><i className="bi bi-bank me-2"></i>Existing Loan Details</h5></div>
          <div className="col-md-3"><div className="details-card"><h6>Has Existing Loans</h6><p className="fw-semibold text-primary">{x.hasExistingLoans ? 'Yes' : 'No'}</p></div></div>
          {x.existingLoanType && <div className="col-md-3"><div className="details-card"><h6>Existing Loan Type</h6><p className="fw-semibold text-primary">{x.existingLoanType}</p></div></div>}
          {x.lenderName && <div className="col-md-3"><div className="details-card"><h6>Lender</h6><p className="fw-semibold text-primary">{x.lenderName}</p></div></div>}
          {x.outstandingAmount && <div className="col-md-3"><div className="details-card"><h6>Outstanding Amount</h6><p className="fw-semibold text-primary">₹{(x.outstandingAmount || 0).toLocaleString()}</p></div></div>}
          {x.monthlyEmi && <div className="col-md-3"><div className="details-card"><h6>Monthly EMI</h6><p className="fw-semibold text-primary">₹{(x.monthlyEmi || 0).toLocaleString()}</p></div></div>}
          {x.tenureRemainingMonths && <div className="col-md-3"><div className="details-card"><h6>Tenure Remaining</h6><p className="fw-semibold text-primary">{x.tenureRemainingMonths} months</p></div></div>}
        </div>

        {(r && r.length > 0) && (
          <div className="row g-3">
            <div className="col-12"><h5 className="text-primary mb-3"><i className="bi bi-people me-2"></i>References</h5></div>
            {r.map((ref, idx) => (
              <div className="col-md-6" key={`${ref.referenceNumber || idx}`}>
                <div className="details-card">
                  <h6 className="mb-3">Reference {ref.referenceNumber ?? (idx+1)}</h6>
                  <div className="row g-2">
                    <div className="col-12"><div className="details-card-small"><h6 className="mb-1">Name</h6><p className="fw-semibold text-primary mb-0">{ref.name || '-'}</p></div></div>
                    <div className="col-md-6"><div className="details-card-small"><h6 className="mb-1">Relationship</h6><p className="fw-semibold text-primary mb-0">{ref.relationship || '-'}</p></div></div>
                    <div className="col-md-6"><div className="details-card-small"><h6 className="mb-1">Contact</h6><p className="fw-semibold text-primary mb-0">{ref.contactNumber || '-'}</p></div></div>
                    <div className="col-12"><div className="details-card-small"><h6 className="mb-1">Address</h6><p className="fw-semibold text-primary mb-0">{ref.address || '-'}</p></div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

  const renderMakerComments = () => (
    <div className="maker-comments-section">
      <div className="comments-list">
        {(makerComments && makerComments.length) ? (
          makerComments.map((c, i) => (
            <div key={i} className={`comment-item`}>
              <div className="comment-header">
                <div className="comment-meta">
                  <span className="comment-maker">{c.userName || 'Maker'}</span>
                  <span className="comment-time">{c.createdAt}</span>
                </div>
                <span className={`comment-type-badge`}>{c.commentType}</span>
              </div>
              <div className="comment-content">{c.commentText}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-chat-dots display-4 text-muted"></i>
            <p className="text-muted mt-2">No maker comments available</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal": return renderPersonalDetails();
      case "employment": return renderEmploymentDetails();
      case "loan": return renderLoanDetails();
      case "existing": return renderExistingLoanDetails();
      case "references": return renderReferences();
      case "maker-comments": return renderMakerComments();
      case "review": return renderReview();
      default: return renderPersonalDetails();
    }
  };

  return (
    <>
    <div style={{ position: 'relative' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Link to="../dashboard" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Dashboard
          </Link>
        </div>
        <div className="text-end">
          <h4 className="mb-1"><i className="bi bi-clipboard-check me-2" style={{ fontSize: '1.1rem' }}></i>Application Review</h4>
          <p className="text-muted mb-0">Application ID: {application.applicationId}</p>
        </div>
      </div>

      <div className="section-card mb-4">
        <ul className="nav nav-tabs border-0">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button className={`nav-link ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                <i className={`${tab.icon} me-1`}></i>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card">{renderTabContent()}</div>

      {application && String(application.status||'').toUpperCase()==='WITH_CHECKER' && (
        <div className="sticky-actions-fixed">
        <div className="section-card">
            <div>
              <h6 className="mb-1">Review Actions</h6>
              <small className="text-muted">Add a comment and confirm your decision</small>
            </div>
            <div className="w-100 mt-2">
              <textarea 
                className={`form-control ${commentError ? 'is-invalid' : ''}`} 
                rows="3" 
                placeholder="Add review comment" 
                value={comment} 
                onChange={(e)=>{ setComment(e.target.value); if (commentError) setCommentError(''); }} 
              />
              {commentError && <div className="invalid-feedback" style={{ display:'block' }}>{commentError}</div>}
            </div>
            <div className="d-flex gap-2 justify-content-end mt-2">
              <button className="btn btn-outline-danger" onClick={() => {
                if (!comment.trim()) { setCommentError('Comment is required to reject'); return; }
                setConfirmDialog({
                  show: true,
                  title: 'Confirm Rejection',
                  message: 'Are you sure you want to reject this application? This action cannot be undone.',
                  onConfirm: async () => {
                    setConfirmDialog({ show:false, title:'', message:'', onConfirm:null });
                    try {
                      await reviewCheckerApplication(id, 'reject', comment.trim());
                      window.location.href = '/checker-dashboard';
                    } catch (e) {
                      setToast({ show: true, variant: 'danger', message: e.message || 'Reject failed', actionText: 'Close', onAction: () => setToast({ ...toast, show: false }) });
                    }
                  }
                });
              }}>
                <i className="bi bi-x-circle me-1"></i>
                Reject
              </button>
              <button className="btn btn-success" onClick={() => {
                if (!comment.trim()) { setCommentError('Comment is required to approve'); return; }
                setConfirmDialog({
                  show: true,
                  title: 'Confirm Approval',
                  message: 'Confirm approval of this application?',
                  onConfirm: async () => {
                    setConfirmDialog({ show:false, title:'', message:'', onConfirm:null });
                    try {
                      await reviewCheckerApplication(id, 'approve', comment.trim());
                      window.location.href = '/checker-dashboard';
                    } catch (e) {
                      setToast({ show: true, variant: 'danger', message: e.message || 'Approve failed', actionText: 'Close', onAction: () => setToast({ ...toast, show: false }) });
                    }
                  }
                });
              }}>
                <i className="bi bi-check-circle me-1"></i>
                Approve
              </button>
          </div>
        </div>
      </div>
      )}

      {application && (String(application.status||'').toUpperCase()==='APPROVED' || String(application.status||'').toUpperCase()==='REJECTED') && (
        <div className="mt-4">
          <div className="section-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Application Status</h6>
                <small className="text-muted">This application has been processed</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge fs-6 px-3 py-2`} style={{
                  background: String(application.status).toUpperCase()==='APPROVED' ? '#e6f7ed' : '#fde7e7',
                  color: String(application.status).toUpperCase()==='APPROVED' ? '#2d8c50' : '#b02a37',
                  borderRadius: '9999px',
                  fontWeight: '600'
                }}>
                  <i className={`bi ${String(application.status).toUpperCase()==='APPROVED' ? "bi-check-circle" : "bi-x-circle"} me-1`} style={{
                    color: String(application.status).toUpperCase()==='APPROVED' ? '#28a745' : '#dc3545'
                  }}></i>
                  {String(application.status).toUpperCase()==='APPROVED' ? "Approved" : "Rejected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
            </div>

    {preview.show && preview.url && (
      <div 
        className="file-preview-overlay" 
        onClick={closePreview}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1060, display:'flex', alignItems:'center', justifyContent:'center' }}
      >
        <div 
          className="file-preview-container"
          onClick={(e) => e.stopPropagation()}
          style={{ width:'90%', maxWidth:'1000px', background:'#fff', borderRadius:'6px', overflow:'hidden', display:'flex', flexDirection:'column' }}
        >
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #ddd', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h5 style={{ margin:0 }}>{preview.name}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={closePreview}>Close</button>
                  </div>
          <div style={{ height:'75vh', background:'#f5f5f5', overflow:'hidden' }}>
            {preview.type?.includes('pdf') ? (
              <iframe
                src={`${preview.url}`}
                style={{ 
                  width:'100%', 
                  height:'100%', 
                  border:'none',
                  display:'block'
                }}
                title={preview.name}
              >
                <div style={{ textAlign:'center', padding:'40px' }}>
                  <p style={{ marginBottom:'15px', color:'#666' }}>PDF preview not available.</p>
                  <a href={preview.url} download={preview.name} className="btn btn-primary">
                    <i className="bi bi-download me-2"></i>Download to View
                  </a>
                </div>
              </iframe>
            ) : preview.type?.startsWith('image/') ? (
              <img src={preview.url} alt={preview.name} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
            ) : (
              <div className="p-4 text-center">Preview not available.</div>
                    )}
                  </div>
                </div>
      </div>
    )}
    {/* Lightweight Toast */}
    {toast.show && (
      <div
        className="position-fixed"
        style={{ right: '20px', bottom: '20px', zIndex: 1060, maxWidth: '360px' }}
      >
        <div className={`toast show border-0 shadow ${toast.variant==='danger'?'bg-danger text-white':toast.variant==='success'?'bg-success text-white':toast.variant==='warning'?'bg-warning text-dark':'bg-dark text-white'}`}
             role="alert">
          <div className="toast-body d-flex justify-content-between align-items-center">
            <div className="me-3" style={{ whiteSpace: 'pre-wrap' }}>{toast.message}</div>
            <div className="d-flex align-items-center gap-2">
              {toast.onAction && (
                <button className={`btn btn-sm ${toast.variant==='warning'?'btn-outline-dark':'btn-light'}`} onClick={toast.onAction}>{toast.actionText || 'OK'}</button>
              )}
              <button className={`btn btn-sm ${toast.variant==='warning'?'btn-outline-dark':'btn-light'}`} onClick={() => setToast({ ...toast, show: false })}>Close</button>
            </div>
            </div>
          </div>
        </div>
      )}
    {/* Centered Confirm Dialog */}
    {confirmDialog.show && (
        <div 
          className="file-preview-overlay" 
        onClick={() => setConfirmDialog({ show:false, title:'', message:'', onConfirm:null })}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:1070, display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <div 
          className="card shadow"
          onClick={(e)=>e.stopPropagation()}
          style={{ width:'480px', border:'1px solid #e5e7eb', borderRadius:'10px' }}
        >
          <div className="card-body">
            <h5 className="mb-2">{confirmDialog.title || 'Confirm'}</h5>
            <p className="text-muted mb-4" style={{ whiteSpace:'pre-wrap' }}>{confirmDialog.message}</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary" onClick={() => setConfirmDialog({ show:false, title:'', message:'', onConfirm:null })}>Close</button>
              <button className="btn btn-primary" onClick={() => confirmDialog.onConfirm && confirmDialog.onConfirm()}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}