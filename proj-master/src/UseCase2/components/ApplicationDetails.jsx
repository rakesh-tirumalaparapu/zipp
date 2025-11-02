import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/customer.base.css';
import '../styles/application.details.css';
import { getApplicationByApplicationId } from '../../api/apiCustomer';
import { listDocumentIdsByApplication, getDocument } from '../../api/documents';
import { formatLoanType, formatMaritalStatus, formatGender, formatOccupationType } from '../../utils/enumFormatters';

const humanize = (s) => {
  if (!s) return '-';
  return String(s)
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState(null);
  const [docs, setDocs] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState({ show: false, url: null, name: '', type: '' });

  const applicationId = location.state?.applicationId || location.state?.application?.applicationId;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        if (!applicationId) {
          throw new Error('Missing applicationId');
        }
        const [details, docList] = await Promise.all([
          getApplicationByApplicationId(applicationId),
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

  const isApprovedOrRejected = (application?.status === 'APPROVED' || application?.status === 'REJECTED');
  const makerComments = (application?.comments || []).filter(c => String(c.commentType || '').startsWith('MAKER_'));
  const checkerComments = (application?.comments || []).filter(c => String(c.commentType || '').startsWith('CHECKER_'));

  const statusBadge = (s) => {
    const v = String(s || '').toUpperCase();
    if (v === 'APPROVED') return 'status-approved';
    if (v === 'REJECTED') return 'status-rejected';
        return 'status-pending';
  };

  if (loading) return <div className="dashboard-container"><div className="container-fluid"><div className="text-center py-5">Loading...</div></div></div>;
  if (error)   return <div className="dashboard-container"><div className="container-fluid"><div className="text-danger py-4">{error}</div></div></div>;
  if (!application) return <div className="dashboard-container"><div className="container-fluid"><div className="py-4">No data</div></div></div>;

  const p = application.personalDetails || {};
  const e = application.employmentDetails || {};
  const l = application.loanDetails || {};
  const x = application.existingLoanDetails || {};

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
            <span className="doc-label">{docTypeLabel(t)}</span>
            <div className="d-flex flex-column">
              {docsByType[t].map((d, idx) => (
                <button
                  key={`doc-${t}-${d.id}`}
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => openDoc(d)}
                  title={`Open document #${idx + 1}`}
                  aria-label={`Open document ${idx + 1}`}
                >
                  <i className="bi bi-file-earmark-text me-1"></i>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="container-fluid">
        <button className="btn btn-back mb-3" onClick={() => navigate('/customer-dashboard/applications')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Applications
            </button>

        <div className="card card-custom mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">{formatLoanType(l.loanType) || 'Loan Application'}</h4>
              <div className={`status-badge ${statusBadge(application.status)}`}>{humanize(application.status)}</div>
              <div className="text-muted small">Application ID: {application.applicationId}</div>
                  </div>
            {String(application.status || '').toUpperCase() === 'REJECTED' && (
              <button className="btn btn-primary" onClick={() => navigate('/customer-dashboard/loanapplication', { state: { application } })}>
                <i className="bi bi-arrow-clockwise me-2"></i>Resubmit
                      </button>
            )}
              </div>
            </div>

        {/* Tabs with card background */}
        <div className="card card-custom mb-0" style={{ background: '#fff' }}><div className="card-body py-2 px-3">
          <ul className="nav nav-tabs mb-0 justify-content-center" style={{ display: 'flex', flexWrap: 'nowrap', overflow: 'visible', padding: '0 16px', gap: '36px', background: '#fff', border: '0 none' }}>
            <li className="nav-item" style={{ flex: '0 1 auto' }}><button className={`nav-link ${activeTab==='personal'?'active':''}`} style={{ minWidth: '100px', fontWeight: 500, border: '0 none', borderBottom: '0 none', boxShadow: 'none' }} onClick={()=>setActiveTab('personal')}>Personal</button></li>
            <li className="nav-item" style={{ flex: '0 1 auto' }}><button className={`nav-link ${activeTab==='employment'?'active':''}`} style={{ minWidth: '100px', fontWeight: 500, border: '0 none', borderBottom: '0 none', boxShadow: 'none' }} onClick={()=>setActiveTab('employment')}>Employment</button></li>
            <li className="nav-item" style={{ flex: '0 1 auto' }}><button className={`nav-link ${activeTab==='loan'?'active':''}`} style={{ minWidth: '100px', fontWeight: 500, border: '0 none', borderBottom: '0 none', boxShadow: 'none' }} onClick={()=>setActiveTab('loan')}>Loan</button></li>
            <li className="nav-item" style={{ flex: '0 1 auto' }}><button className={`nav-link ${activeTab==='existing'?'active':''}`} style={{ minWidth: '140px', fontWeight: 500, border: '0 none', borderBottom: '0 none', boxShadow: 'none' }} onClick={()=>setActiveTab('existing')}>Existing Loans</button></li>
            <li className="nav-item" style={{ flex: '0 1 auto' }}><button className={`nav-link ${activeTab==='references'?'active':''}`} style={{ minWidth: '120px', fontWeight: 500, border: '0 none', borderBottom: '0 none', boxShadow: 'none' }} onClick={()=>setActiveTab('references')}>References</button></li>
          </ul>
        </div></div>

        {activeTab==='personal' && (
          <div className="card card-custom"><div className="card-body details-section p-3">
                    <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col"><div className="profile-label">Full Name</div><div className="profile-value">{`${p.firstName || ''} ${p.middleName || ''} ${p.lastName || ''}`.trim() || '—'}</div></div>
              <div className="col"><div className="profile-label">Phone</div><div className="profile-value">{p.phoneNumber || '—'}</div></div>
              <div className="col"><div className="profile-label">Email</div><div className="profile-value">{p.emailAddress || '—'}</div></div>
              <div className="col"><div className="profile-label">DOB</div><div className="profile-value">{p.dateOfBirth || '—'}</div></div>
              <div className="col"><div className="profile-label">Gender</div><div className="profile-value">{formatGender(p.gender) || '—'}</div></div>
              <div className="col"><div className="profile-label">Marital Status</div><div className="profile-value">{formatMaritalStatus(p.maritalStatus) || '—'}</div></div>
              <div className="col"><div className="profile-label">Aadhaar</div><div className="profile-value">{p.aadhaarNumber || '—'}</div></div>
              <div className="col"><div className="profile-label">PAN</div><div className="profile-value">{p.panNumber || '—'}</div></div>
              <div className="col-12"><div className="profile-label">Current Address</div><div className="profile-value">{p.currentAddress || '—'}</div></div>
              <div className="col-12"><div className="profile-label">Permanent Address</div><div className="profile-value">{p.permanentAddress || '—'}</div></div>
                    </div>
            <h6 className="mt-4">Personal Documents</h6>
            {renderDocItems(['PHOTOGRAPH','IDENTITY_PROOF','ADDRESS_PROOF'])}
          </div></div>
        )}

        {activeTab==='employment' && (
          <div className="card card-custom"><div className="card-body details-section p-3">
                    <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col"><div className="profile-label">Occupation</div><div className="profile-value">{formatOccupationType(e.occupationType) || '—'}</div></div>
              <div className="col"><div className="profile-label">Employer/Business</div><div className="profile-value">{e.employerOrBusinessName || '—'}</div></div>
              <div className="col"><div className="profile-label">Designation</div><div className="profile-value">{e.designation || '—'}</div></div>
              <div className="col"><div className="profile-label">Experience (years)</div><div className="profile-value">{e.totalWorkExperienceYears ?? '—'}</div></div>
              <div className="col-12"><div className="profile-label">Office Address</div><div className="profile-value">{e.officeAddress || '—'}</div></div>
                    </div>
            <h6 className="mt-4">Employment Documents</h6>
            {renderDocItems(['SALARY_SLIPS','ITR_SALARIED','BANK_STATEMENTS_SALARIED','EMPLOYMENT_PROOF','BUSINESS_PROOF_GST','ITR_SELF_EMPLOYED','BANK_STATEMENTS_SELF_EMPLOYED'])}
          </div></div>
        )}

        {activeTab==='loan' && (
          <div className="card card-custom"><div className="card-body details-section p-3">
                    <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col"><div className="profile-label">Loan Type</div><div className="profile-value">{formatLoanType(l.loanType) || '—'}</div></div>
              <div className="col"><div className="profile-label">Amount</div><div className="profile-value">₹{(l.loanAmount || 0).toLocaleString('en-IN')}</div></div>
              <div className="col"><div className="profile-label">Tenure (months)</div><div className="profile-value">{l.loanDurationMonths ?? '—'}</div></div>
              <div className="col-12"><div className="profile-label">Purpose</div><div className="profile-value">{l.purposeOfLoan || '—'}</div></div>
                    </div>
            <h6 className="mt-4">Loan Documents</h6>
            {renderDocItems(['SALE_AGREEMENT','EC_CERTIFICATE','INVOICE_FROM_DEALER','QUOTATION','INCOME_PROOF'])}
          </div></div>
        )}

        {activeTab==='existing' && (
          <div className="card card-custom"><div className="card-body details-section p-3">
            <div className="row row-cols-1 row-cols-md-3 g-3">
              <div className="col"><div className="profile-label">Has Existing Loans</div><div className="profile-value">{String(x.hasExistingLoans)}</div></div>
              <div className="col"><div className="profile-label">Existing Loan Type</div><div className="profile-value">{x.existingLoanType || '—'}</div></div>
              <div className="col"><div className="profile-label">Lender</div><div className="profile-value">{x.lenderName || '—'}</div></div>
              <div className="col"><div className="profile-label">Outstanding Amount</div><div className="profile-value">{x.outstandingAmount ?? '—'}</div></div>
              <div className="col"><div className="profile-label">Monthly EMI</div><div className="profile-value">{x.monthlyEmi ?? '—'}</div></div>
              <div className="col"><div className="profile-label">Tenure Remaining</div><div className="profile-value">{x.tenureRemainingMonths ?? '—'}</div></div>
                  </div>
            <h6 className="mt-4">Existing Loan Documents</h6>
            {renderDocItems(['CIBIL_REPORT'])}
          </div></div>
        )}

        {activeTab==='references' && (
          <div className="card card-custom"><div className="card-body details-section p-3">
            {(application.references && application.references.length) ? (
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {application.references.map((r, idx) => (
                  <div className="col" key={`${r.referenceNumber || idx}`}>
                    <div className="profile-label">Reference #{r.referenceNumber ?? (idx+1)}</div>
                    <div className="row g-2 mt-2">
                      <div className="col-12"><div className="profile-label">Name</div><div className="profile-value">{r.name || '—'}</div></div>
                      <div className="col-12"><div className="profile-label">Relationship</div><div className="profile-value">{r.relationship || '—'}</div></div>
                      <div className="col-12"><div className="profile-label">Contact</div><div className="profile-value">{r.contactNumber || '—'}</div></div>
                      <div className="col-12"><div className="profile-label">Address</div><div className="profile-value">{r.address || '—'}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted">No references added.</div>
            )}
          </div></div>
        )}

        {/* Status & Remarks card */}
        <div className="card card-custom mb-3"><div className="card-body">
          <h6 className="mb-3 d-flex align-items-center"><i className="bi bi-info-circle me-2"></i>Status & Remarks</h6>
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="profile-label mb-1">Current Status</div>
              <span className={`status-badge ${statusBadge(application.status)}`}>{humanize(application.status)}</span>
            </div>
            <div className="col-12 col-md-4">
              <div className="profile-label mb-1">Applied Date</div>
              <div className="profile-value">{application.submittedDate || '—'}</div>
                    </div>
            <div className="col-12 col-md-4">
              <div className="profile-label mb-1">Remarks</div>
              <div className="profile-value">
                {(() => {
                  const remarks = [];
                  if (makerComments && makerComments.length) {
                    remarks.push(`Maker: ${makerComments[makerComments.length-1].commentText}`);
                  }
                  if (checkerComments && checkerComments.length) {
                    remarks.push(`Checker: ${checkerComments[checkerComments.length-1].commentText}`);
                  }
                  return remarks.length ? remarks.join(' | ') : 'No remarks available';
                })()}
              </div>
            </div>
          </div>
        </div></div>

        {/* Feature actions wrapped in a card matching header width */}
        <div className="card card-custom mt-4 mb-3"><div className="card-body">
        <div className="d-flex flex-row justify-content-center align-items-center" style={{ gap: '14px', minHeight: '56px' }}>
          <button
            className="btn fw-semibold d-flex align-items-center justify-content-center"
          style={{
              padding: '6px 16px',
              borderRadius: '12px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#00B0FF',
              color: '#00B0FF',
              background: '#ffffff',
              fontSize: '0.95rem',
            }}
            onClick={() => navigate('/customer-dashboard/no-feature')}
          >
            <i className="bi bi-telephone me-2"></i>Contact Support
          </button>
          <button
            className="btn fw-semibold d-flex align-items-center justify-content-center"
            style={{
              padding: '6px 16px',
              borderRadius: '12px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#00B0FF',
              color: '#00B0FF',
              background: '#ffffff',
              fontSize: '0.95rem',
            }}
            onClick={() => navigate('/customer-dashboard/no-feature')}
          >
            <i className="bi bi-chat-dots me-2"></i>Live Chat
          </button>
              <button
            className="btn fw-semibold d-flex align-items-center justify-content-center"
                style={{
              padding: '6px 16px',
              borderRadius: '12px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#c7ccd4',
              color: '#6b7280',
              background: '#ffffff',
              fontSize: '0.95rem',
            }}
            onClick={() => navigate('/customer-dashboard/no-feature')}
          >
            <i className="bi bi-printer me-2"></i>Print Application
              </button>
        </div>
      </div></div>
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
    </div>
  );
};

export default ApplicationDetails;
