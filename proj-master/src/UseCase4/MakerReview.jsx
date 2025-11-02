import React, { useEffect, useMemo, useState } from 'react';
import { getMakerApplicationById } from '../api/apiMaker';
import { listDocumentIdsByApplication, getDocument } from '../api/documents';
import { formatLoanType, formatMaritalStatus, formatGender, formatOccupationType } from '../utils/enumFormatters';
import './MakerReview.css';

const humanize = (s) => {
  if (!s) return '-';
  return String(s).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

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
}[t] || humanize(t));

const statusBadge = (s) => {
  const v = String(s || '').toUpperCase();
  if (v === 'APPROVED') return 'status-approved';
  if (v === 'REJECTED') return 'status-rejected';
  return 'status-pending';
};

export default function MakerReview({ applicationId, onBack }) {
  const [application, setApplication] = useState(null);
  const [docs, setDocs] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState({ show: false, url: null, name: '', type: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [details, docList] = await Promise.all([
          getMakerApplicationById(applicationId),
          listDocumentIdsByApplication(applicationId)
        ]);
        if (!mounted) return;
        setApplication(details);
        setDocs(docList || []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load application');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [applicationId]);

  const docsByType = useMemo(() => {
    const map = {};
    (docs || []).forEach((d) => {
      const t = d.documentType;
      if (!t) return;
      (map[t] = map[t] || []).push(d);
    });
    return map;
  }, [docs]);

  const openDoc = async (doc) => {
    try {
      const blob = await getDocument(doc.id);
      const url = URL.createObjectURL(blob);
      setPreview({ show: true, url, name: docTypeLabel(doc.documentType), type: blob.type || '' });
    } catch (err) {
      setError(err.message || 'Unable to open document');
    }
  };

  const closePreview = () => {
    if (preview.url) URL.revokeObjectURL(preview.url);
    setPreview({ show: false, url: null, name: '', type: '' });
  };

  const renderDocItems = (types) => {
    const present = (types || []).filter((t) => Array.isArray(docsByType[t]) && docsByType[t].length);
    if (!present.length) {
      return <div className="text-muted">No documents uploaded in this section</div>;
    }
  return (
      <div className="docs-grid">
        {present.map((t) => (
          <div key={`doc-${t}`} className="doc-item">
            <i className="bi bi-file-earmark-check text-success"></i>
            <div className="d-flex align-items-center" style={{ gap: '8px', flex: 1 }}>
              <span className="doc-label">{docTypeLabel(t)}</span>
              {docsByType[t].map((d, idx) => (
                <button
                  key={`doc-${t}-${d.id}`}
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => openDoc(d)}
                  title={`Open document #${idx + 1}`}
                  aria-label={`Open document ${idx + 1}`}
                >
                  <i className="bi bi-file-earmark-text" style={{ fontSize: '1.1rem', color: '#0d6efd' }}></i>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="dashboard-container"><div className="container-fluid"><div className="text-center py-5">Loading...</div></div></div>;
  if (error)   return <div className="dashboard-container"><div className="container-fluid"><div className="text-danger py-4">{error}</div></div></div>;
  if (!application) return <div className="dashboard-container"><div className="container-fluid"><div className="py-4">No data</div></div></div>;

  const p = application.personalDetails || {};
  const e = application.employmentDetails || {};
  const l = application.loanDetails || {};
  const x = application.existingLoanDetails || {};
  const r = application.references || [];
  const isApprovedOrRejected = (application?.status === 'APPROVED' || application?.status === 'REJECTED');

  return (
    <div className="dashboard-container" style={{ paddingTop: '24px' }}>
      <div className="container-fluid">
        <button className="btn btn-back mb-3" onClick={() => onBack?.()}>
          <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
        </button>

        <div className="card card-custom mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">{formatLoanType(l.loanType) || 'Loan Application'}</h4>
              <div className={`status-badge ${statusBadge(application.status)}`}>{humanize(application.status)}</div>
              <div className="text-muted small">Application ID: {application.applicationId}</div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item"><button className={`nav-link ${activeTab==='personal'?'active':''}`} onClick={()=>setActiveTab('personal')}><i className="bi bi-person me-1"></i>Personal</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='employment'?'active':''}`} onClick={()=>setActiveTab('employment')}><i className="bi bi-briefcase me-1"></i>Employment</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='loan'?'active':''}`} onClick={()=>setActiveTab('loan')}><i className="bi bi-credit-card me-1"></i>Loan</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='existing'?'active':''}`} onClick={()=>setActiveTab('existing')}><i className="bi bi-bank me-1"></i>Existing Loans</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='references'?'active':''}`} onClick={()=>setActiveTab('references')}><i className="bi bi-people me-1"></i>References</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='review'?'active':''}`} onClick={()=>setActiveTab('review')}><i className="bi bi-check-circle me-1"></i>Review</button></li>
          {isApprovedOrRejected && (
            <li className="nav-item"><button className={`nav-link ${activeTab==='checkerComments'?'active':''}`} onClick={()=>setActiveTab('checkerComments')}><i className="bi bi-chat-dots me-1"></i>Checker Comments</button></li>
          )}
        </ul>

        {activeTab==='personal' && (
          <div className="card card-custom"><div className="card-body">
            <div className="row g-3">
              <div className="col-md-3"><div className="details-card"><h6>Full Name</h6><p className="fw-semibold text-success">{`${p.firstName || ''} ${p.middleName || ''} ${p.lastName || ''}`.trim() || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Date of Birth</h6><p className="fw-semibold text-success">{p.dateOfBirth || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Gender</h6><p className="fw-semibold text-success">{formatGender(p.gender) || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Marital Status</h6><p className="fw-semibold text-success">{formatMaritalStatus(p.maritalStatus) || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Phone Number</h6><p className="fw-semibold text-success">{p.phoneNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Email</h6><p className="fw-semibold text-success">{p.emailAddress || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Father's Name</h6><p className="fw-semibold text-success">{p.fatherName || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Aadhaar Number</h6><p className="fw-semibold text-success">{p.aadhaarNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>PAN Number</h6><p className="fw-semibold text-success">{p.panNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Passport Number</h6><p className="fw-semibold text-success">{p.passportNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Education</h6><p className="fw-semibold text-success">{p.educationDetails || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Current Address</h6><p className="fw-semibold text-success">{p.currentAddress || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Permanent Address</h6><p className="fw-semibold text-success">{p.permanentAddress || '—'}</p></div></div>
            </div>
            <h6 className="mt-4"><i className="bi bi-file-earmark-text me-2"></i>Personal Documents</h6>
            {renderDocItems(['PHOTOGRAPH','IDENTITY_PROOF','ADDRESS_PROOF'])}
          </div></div>
        )}

        {activeTab==='employment' && (
          <div className="card card-custom"><div className="card-body">
            <div className="row g-3">
              <div className="col-md-6"><div className="details-card"><h6>Occupation Type</h6><p className="fw-semibold text-success">{formatOccupationType(e.occupationType) || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Employer</h6><p className="fw-semibold text-success">{e.employerOrBusinessName || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Designation</h6><p className="fw-semibold text-success">{e.designation || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Total Work Experience</h6><p className="fw-semibold text-success">{e.totalWorkExperienceYears ? `${e.totalWorkExperienceYears} years` : '—'}</p></div></div>
              <div className="col-12"><div className="details-card"><h6>Office Address</h6><p className="fw-semibold text-success">{e.officeAddress || '—'}</p></div></div>
            </div>
            <h6 className="mt-4"><i className="bi bi-briefcase me-2"></i>Employment Documents</h6>
            {renderDocItems(['SALARY_SLIPS','ITR_SALARIED','BANK_STATEMENTS_SALARIED','EMPLOYMENT_PROOF','BUSINESS_PROOF_GST','ITR_SELF_EMPLOYED','BANK_STATEMENTS_SELF_EMPLOYED'])}
          </div></div>
        )}

        {activeTab==='loan' && (
          <div className="card card-custom"><div className="card-body">
            <div className="row g-3">
              <div className="col-md-6"><div className="details-card"><h6>Loan Type</h6><p className="fw-semibold text-success">{formatLoanType(l.loanType) || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Loan Amount</h6><p className="fw-semibold text-success">₹{(l.loanAmount || 0).toLocaleString('en-IN')}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Loan Duration</h6><p className="fw-semibold text-success">{l.loanDurationMonths ? `${l.loanDurationMonths} months` : '—'}</p></div></div>
              {l.purposeOfLoan && <div className="col-md-6"><div className="details-card"><h6>Purpose of Loan</h6><p className="fw-semibold text-success">{l.purposeOfLoan}</p></div></div>}
            </div>
            <h6 className="mt-4"><i className="bi bi-credit-card me-2"></i>Loan Documents</h6>
            {renderDocItems(['SALE_AGREEMENT','EC_CERTIFICATE','INVOICE_FROM_DEALER','QUOTATION','INCOME_PROOF'])}
          </div></div>
        )}

        {activeTab==='existing' && (
          <div className="card card-custom"><div className="card-body">
            <div className="row g-3">
              <div className="col-md-3"><div className="details-card"><h6>Has Existing Loans</h6><p className="fw-semibold text-success">{x.hasExistingLoans ? 'Yes' : 'No'}</p></div></div>
              {x.existingLoanType && <div className="col-md-3"><div className="details-card"><h6>Existing Loan Type</h6><p className="fw-semibold text-success">{x.existingLoanType}</p></div></div>}
              {x.lenderName && <div className="col-md-3"><div className="details-card"><h6>Lender</h6><p className="fw-semibold text-success">{x.lenderName}</p></div></div>}
              {x.outstandingAmount && <div className="col-md-3"><div className="details-card"><h6>Outstanding Amount</h6><p className="fw-semibold text-success">₹{(x.outstandingAmount || 0).toLocaleString('en-IN')}</p></div></div>}
              {x.monthlyEmi && <div className="col-md-3"><div className="details-card"><h6>Monthly EMI</h6><p className="fw-semibold text-success">₹{(x.monthlyEmi || 0).toLocaleString('en-IN')}</p></div></div>}
              {x.tenureRemainingMonths && <div className="col-md-3"><div className="details-card"><h6>Tenure Remaining</h6><p className="fw-semibold text-success">{x.tenureRemainingMonths} months</p></div></div>}
            </div>
            <h6 className="mt-4"><i className="bi bi-bank me-2"></i>Existing Loan Documents</h6>
            {renderDocItems(['CIBIL_REPORT'])}
          </div></div>
        )}

        {activeTab==='references' && (
          <div className="card card-custom"><div className="card-body">
            {(r && r.length) ? (
              <div className="row g-3">
                {r.map((ref, idx) => (
                  <div className="col-md-6" key={`${ref.referenceNumber || idx}`}>
                    <div className="details-card">
                      <h6 className="mb-3">Reference {ref.referenceNumber ?? (idx+1)}</h6>
                      <div className="row g-2">
                        <div className="col-12"><div className="details-card-small"><h6 className="mb-1">Name</h6><p className="fw-semibold text-success mb-0">{ref.name || '—'}</p></div></div>
                        <div className="col-md-6"><div className="details-card-small"><h6 className="mb-1">Relationship</h6><p className="fw-semibold text-success mb-0">{ref.relationship || '—'}</p></div></div>
                        <div className="col-md-6"><div className="details-card-small"><h6 className="mb-1">Contact</h6><p className="fw-semibold text-success mb-0">{ref.contactNumber || '—'}</p></div></div>
                        <div className="col-12"><div className="details-card-small"><h6 className="mb-1">Address</h6><p className="fw-semibold text-success mb-0">{ref.address || '—'}</p></div></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4"><i className="bi bi-people display-4 text-muted"></i><p className="text-muted mt-2">No references added.</p></div>
            )}
          </div></div>
        )}

        {activeTab==='review' && (
          <div className="card card-custom"><div className="card-body">
            <div className="row g-3 mb-4">
              <div className="col-12"><h5 className="text-success mb-3"><i className="bi bi-person me-2"></i>Personal Information</h5></div>
              <div className="col-md-3"><div className="details-card"><h6>Full Name</h6><p className="fw-semibold text-success">{[p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ') || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Phone</h6><p className="fw-semibold text-success">{p.phoneNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Email</h6><p className="fw-semibold text-success">{p.emailAddress || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Date of Birth</h6><p className="fw-semibold text-success">{p.dateOfBirth || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Marital Status</h6><p className="fw-semibold text-success">{formatMaritalStatus(p.maritalStatus) || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Gender</h6><p className="fw-semibold text-success">{formatGender(p.gender) || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Aadhaar Number</h6><p className="fw-semibold text-success">{p.aadhaarNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>PAN Number</h6><p className="fw-semibold text-success">{p.panNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Passport Number</h6><p className="fw-semibold text-success">{p.passportNumber || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Father's Name</h6><p className="fw-semibold text-success">{p.fatherName || '—'}</p></div></div>
              <div className="col-md-3"><div className="details-card"><h6>Education</h6><p className="fw-semibold text-success">{p.educationDetails || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Current Address</h6><p className="fw-semibold text-success">{p.currentAddress || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Permanent Address</h6><p className="fw-semibold text-success">{p.permanentAddress || '—'}</p></div></div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12"><h5 className="text-success mb-3"><i className="bi bi-briefcase me-2"></i>Employment Details</h5></div>
              <div className="col-md-6"><div className="details-card"><h6>Occupation Type</h6><p className="fw-semibold text-success">{formatOccupationType(e.occupationType) || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Employer</h6><p className="fw-semibold text-success">{e.employerOrBusinessName || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Designation</h6><p className="fw-semibold text-success">{e.designation || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Total Work Experience</h6><p className="fw-semibold text-success">{e.totalWorkExperienceYears ? `${e.totalWorkExperienceYears} years` : '—'}</p></div></div>
              <div className="col-12"><div className="details-card"><h6>Office Address</h6><p className="fw-semibold text-success">{e.officeAddress || '—'}</p></div></div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12"><h5 className="text-success mb-3"><i className="bi bi-credit-card me-2"></i>Loan Details</h5></div>
              <div className="col-md-6"><div className="details-card"><h6>Loan Type</h6><p className="fw-semibold text-success">{formatLoanType(l.loanType) || '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Loan Amount</h6><p className="fw-semibold text-success">{l.loanAmount ? `₹${(l.loanAmount || 0).toLocaleString('en-IN')}` : '—'}</p></div></div>
              <div className="col-md-6"><div className="details-card"><h6>Loan Duration</h6><p className="fw-semibold text-success">{l.loanDurationMonths ? `${l.loanDurationMonths} months` : '—'}</p></div></div>
              {l.purposeOfLoan && <div className="col-md-6"><div className="details-card"><h6>Purpose of Loan</h6><p className="fw-semibold text-success">{l.purposeOfLoan}</p></div></div>}
            </div>

            <div className="row g-3">
              <div className="col-12"><h5 className="text-success mb-3"><i className="bi bi-bank me-2"></i>Existing Loan Details</h5></div>
              <div className="col-md-3"><div className="details-card"><h6>Has Existing Loans</h6><p className="fw-semibold text-success">{x.hasExistingLoans ? 'Yes' : 'No'}</p></div></div>
              {x.existingLoanType && <div className="col-md-3"><div className="details-card"><h6>Existing Loan Type</h6><p className="fw-semibold text-success">{x.existingLoanType}</p></div></div>}
              {x.lenderName && <div className="col-md-3"><div className="details-card"><h6>Lender</h6><p className="fw-semibold text-success">{x.lenderName}</p></div></div>}
              {x.outstandingAmount && <div className="col-md-3"><div className="details-card"><h6>Outstanding Amount</h6><p className="fw-semibold text-success">₹{(x.outstandingAmount || 0).toLocaleString('en-IN')}</p></div></div>}
              {x.monthlyEmi && <div className="col-md-3"><div className="details-card"><h6>Monthly EMI</h6><p className="fw-semibold text-success">₹{(x.monthlyEmi || 0).toLocaleString('en-IN')}</p></div></div>}
              {x.tenureRemainingMonths && <div className="col-md-3"><div className="details-card"><h6>Tenure Remaining</h6><p className="fw-semibold text-success">{x.tenureRemainingMonths} months</p></div></div>}
            </div>
          </div></div>
        )}

        {activeTab==='checkerComments' && (
          <div className="card card-custom"><div className="card-body">
            <h6 className="mb-3">Checker Comments</h6>
            {(application.comments?.filter(c => c.commentType === 'CHECKER_APPROVAL')?.length > 0) ? (
              application.comments.filter(c => c.commentType === 'CHECKER_APPROVAL').map((comment, idx) => (
                <div key={idx} className="mb-3 p-3 bg-light rounded">
                  <div className="fw-semibold">{comment.userName || 'Checker'}</div>
                  <div className="text-muted small mb-1">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</div>
                  <div>{comment.commentText}</div>
            </div>
              ))
            ) : (
              <div className="text-muted">No checker comments available.</div>
            )}
          </div></div>
        )}
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
          </div>
    </div>
  );
}






