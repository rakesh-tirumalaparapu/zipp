import React from 'react';
import './ExistingLoansTab.css';

const ExistingLoansTab = ({ application }) => {
  const fd = application?.formData || {};
  const { existingLoans, loanDocuments } = application;

  const formatCurrency = (amount) => {
    return amount ? `₹ ${amount?.toLocaleString('en-IN')}` : '-';
  };

  const existingLoansData = fd.existingLoans || existingLoans || [];

  return (
    <div className="tab-content active">
      {/* Existing Loans */}
      {existingLoansData && existingLoansData.length > 0 ? (
        <>
          <div className="section">
            <h3>Existing Loan Details</h3>
            <div className="existing-loans">
              {existingLoansData.map((loan, index) => (
                <div key={index} className="loan-item">
                  <div className="loan-header">
                    <h4>Loan {index + 1}</h4>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Loan Type</label>
                      <span>{loan.loanType || loan.type || '-'}</span>
                    </div>
                    <div className="info-item">
                      <label>Lender</label>
                      <span>{loan.lender || '-'}</span>
                    </div>
                    <div className="info-item">
                      <label>Outstanding Amount</label>
                      <span>{formatCurrency(loan.outstandingAmount)}</span>
                    </div>
                    <div className="info-item">
                      <label>EMI</label>
                      <span>{formatCurrency(loan.emi)}</span>
                    </div>
                    <div className="info-item">
                      <label>Tenure Remaining</label>
                      <span>{loan.tenureRemaining ? `${loan.tenureRemaining} months` : '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CIBIL Report */}
          <div className="section">
            <h3>CIBIL Report</h3>
            <div className="document-checklist">
              <div className="checklist-item">
                <span>CIBIL Report</span>
                <span className={`checklist-status ${
                  loanDocuments?.some(doc => doc.name?.toLowerCase().includes('cibil')) ? 'verified' : 'pending'
                }`}>
                  {loanDocuments?.some(doc => doc.name?.toLowerCase().includes('cibil')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-loans-section">
          <p className="no-loans-message">No existing loans information available.</p>
        </div>
      )}
    </div>
  );
};

export default ExistingLoansTab;

