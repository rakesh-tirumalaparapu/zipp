import React, { useState } from 'react';
import './ReviewTab.css';
import { formatLoanType, formatMaritalStatus, formatGender, formatOccupationType } from '../../../../../utils/enumFormatters';

const ReviewTab = ({ application }) => {
  const fd = application?.formData || {};
  const p = application?.personalDetails || {};
  const emp = application?.employmentDetails || {};
  const [previewDoc, setPreviewDoc] = useState(null);

  const computeAge = (dobStr) => {
    if (!dobStr) return '';
    const d = new Date(dobStr);
    if (Number.isNaN(d.getTime())) return '';
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatCurrency = (amount) => {
    return amount ? `₹ ${amount?.toLocaleString('en-IN')}` : '-';
  };

  const handleViewDocument = (key, label) => {
    const fileName = fd?.[key];
    if (fileName) {
      setPreviewDoc({ key, label, fileName });
    }
  };

  const handleClosePreview = () => {
    setPreviewDoc(null);
  };

  return (
    <div className="tab-content active review-tab">
      {/* Personal Information Summary */}
      <div className="review-section">
        <h3>Personal Information</h3>
        <div className="info-grid">
          <div className="info-item"><label>Full Name:</label><span>{fd.firstName || p.firstName} {fd.middleName || p.middleName} {fd.lastName || p.lastName}</span></div>
          <div className="info-item"><label>Phone:</label><span>{fd.phone || p.phone || '-'}</span></div>
          <div className="info-item"><label>Email:</label><span>{fd.email || p.email || '-'}</span></div>
          <div className="info-item"><label>Date of Birth:</label><span>{fd.dob || p.dateOfBirth || '-'}</span></div>
          <div className="info-item"><label>Age:</label><span>{fd.age || computeAge(fd.dob || p.dateOfBirth) || '-'}</span></div>
          <div className="info-item"><label>Gender:</label><span>{formatGender(fd.gender || p.gender) || '-'}</span></div>
          <div className="info-item"><label>Marital Status:</label><span>{formatMaritalStatus(fd.maritalStatus || p.maritalStatus) || '-'}</span></div>
          <div className="info-item"><label>Aadhaar:</label><span>{fd.aadharNumber || p.aadhaarNumber || p.aadharNumber || '-'}</span></div>
          <div className="info-item"><label>PAN:</label><span>{fd.panNumber || p.panNumber || '-'}</span></div>
          <div className="info-item"><label>Passport:</label><span>{fd.passportNumber || p.passportNumber || '-'}</span></div>
          <div className="info-item"><label>Father's Name:</label><span>{fd.fatherName || p.fatherName || '-'}</span></div>
          <div className="info-item"><label>Education:</label><span>{fd.highestQualification || p.education || '-'}</span></div>
          <div className="info-item full-width"><label>Current Address:</label><span>{fd.currentAddress || p.currentAddress || '-'}</span></div>
          <div className="info-item full-width"><label>Permanent Address:</label><span>{fd.permanentAddress || p.permanentAddress || '-'}</span></div>
        </div>
      </div>

      {/* Employment Information Summary */}
      <div className="review-section">
        <h3>Employment Information</h3>
        <div className="info-grid">
          <div className="info-item"><label>Occupation Type:</label><span>{formatOccupationType(fd.occupationType || emp.occupationType) || '-'}</span></div>
          <div className="info-item"><label>Employer/Business:</label><span>{fd.employer || emp.companyName || emp.businessName || '-'}</span></div>
          <div className="info-item"><label>Designation:</label><span>{fd.designation || emp.designation || '-'}</span></div>
          <div className="info-item"><label>Experience:</label><span>{fd.totalExperience || emp.workExperience || '-'} years</span></div>
          <div className="info-item full-width"><label>Office Address:</label><span>{fd.officeAddress || emp.officeAddress || '-'}</span></div>
        </div>
      </div>

      {/* Loan Details Summary */}
      <div className="review-section">
        <h3>Loan Details</h3>
        <div className="info-grid">
          <div className="info-item"><label>Loan Type:</label><span>{formatLoanType(fd.loanType || application.loanType) || '-'}</span></div>
          <div className="info-item"><label>Loan Amount:</label><span>{formatCurrency(fd.loanAmount || application.amount || application.loanAmount)}</span></div>
          <div className="info-item"><label>Duration:</label><span>{fd.loanDuration || application.tenure ? `${fd.loanDuration || application.tenure} months` : '-'}</span></div>
          <div className="info-item"><label>Purpose:</label><span>{fd.purpose || application.purpose || '-'}</span></div>
        </div>
      </div>

      {/* Existing Loans Summary */}
      {(fd.existingLoans || application.existingLoans) && (fd.existingLoans || application.existingLoans).length > 0 && (
        <div className="review-section">
          <h3>Existing Loans</h3>
          {(fd.existingLoans || application.existingLoans).map((loan, index) => (
            <div key={index} className="loan-summary">
              <div className="info-grid">
                <div className="info-item"><label>Loan Type:</label><span>{loan.loanType || loan.type || '-'}</span></div>
                <div className="info-item"><label>Lender:</label><span>{loan.lender || '-'}</span></div>
                <div className="info-item"><label>Outstanding:</label><span>{formatCurrency(loan.outstandingAmount)}</span></div>
                <div className="info-item"><label>EMI:</label><span>{formatCurrency(loan.emi)}</span></div>
                <div className="info-item"><label>Tenure Remaining:</label><span>{loan.tenureRemaining ? `${loan.tenureRemaining} months` : '-'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* References Summary */}
      {(fd.references || application.references) && (fd.references || application.references).length > 0 && (
        <div className="review-section">
          <h3>References</h3>
          {(fd.references || application.references).map((ref, index) => (
            <div key={index} className="reference-summary">
              <div className="info-grid">
                <div className="info-item"><label>Name:</label><span>{ref.name || '-'}</span></div>
                <div className="info-item"><label>Relationship:</label><span>{ref.relationship || '-'}</span></div>
                <div className="info-item"><label>Contact:</label><span>{ref.contact || ref.phone || '-'}</span></div>
                <div className="info-item full-width"><label>Address:</label><span>{ref.address || '-'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Section */}
      <div className="review-section">
        <h3>Documents</h3>
        <div className="row row-cols-1 row-cols-md-3 g-2">
          {[
            ['photograph','Photograph'],
            ['idProof','ID Proof'],
            ['addressProof','Address Proof'],
            ['cibilReport','CIBIL Report'],
            ['salariedPayslip','Payslip'],
            ['salariedEmploymentProof','Employment Proof'],
            ['salariedItr','ITR (Salaried)'],
            ['salariedBankStatements','Bank Statements (Salaried)'],
            ['selfItr','ITR (Self-Employed)'],
            ['selfBusiness','Business Proof/GST'],
            ['selfGst','GST Registration'],
            ['selfBankStatements','Bank Statements (Self-Employed)'],
            ['homeEc','EC (Home Loan)'],
            ['homeSaleAgreements','Sale Agreements (Home)'],
            ['vehicleInvoice','Vehicle Invoice'],
            ['vehicleQuotation','Vehicle Quotation'],
            ['personalLoanReport','Income Certificate']
          ].map(([key,label]) => (
            <div key={key} className="col">
              <div 
                className={`d-flex align-items-center justify-content-between p-2 border rounded ${fd[key] ? 'document-clickable' : ''}`}
                onClick={() => fd[key] && handleViewDocument(key, label)}
                style={{ cursor: fd[key] ? 'pointer' : 'default', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { if(fd[key]) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                onMouseLeave={(e) => { if(fd[key]) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span className="text-truncate">{label}</span>
                <span className={`badge ${fd[key] ? 'bg-success' : 'bg-secondary'}`}>
                  {fd[key] ? (
                    <span>{fd[key]} <i className="bi bi-eye ms-1"></i></span>
                  ) : (
                    'Not provided'
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div 
          className="file-preview-overlay" 
          onClick={handleClosePreview}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="file-preview-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '90%',
              maxHeight: '90vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, flex: 1 }}>{previewDoc.label}</h5>
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
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="bi bi-file-earmark-text" style={{ fontSize: '48px', color: '#007bff' }}></i>
                <p style={{ marginTop: '15px', color: '#666', fontSize: '1.1rem' }}>
                  <strong>{previewDoc.fileName}</strong>
                </p>
                <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '10px' }}>
                  Document viewing is simulated. In production, this would open the actual stored file from the server.
                </p>
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                  <small style={{ color: '#666' }}>
                    <strong>Note:</strong> In a real application, clicking this would open the document in a viewer 
                    or download it from the server storage.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTab;

