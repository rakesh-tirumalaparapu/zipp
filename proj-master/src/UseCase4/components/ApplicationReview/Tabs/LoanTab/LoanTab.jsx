// components/ApplicationReview/Tabs/LoanTab/LoanTab.jsx
import React from 'react';
import DocumentSection from '../../DocumentSection/DocumentSection';
import './LoanTab.css';
import { formatLoanType } from '../../../../../utils/enumFormatters';

const LoanTab = ({ application }) => {
  const { loanDocuments, loanType, loanAmount, tenure, purpose } = application;
  const fd = application?.formData || {};

  const formatCurrency = (amount) => {
    return amount ? `₹ ${amount?.toLocaleString('en-IN')}` : '-';
  };

  return (
    <div className="tab-content active">
      {/* Loan Details */}
      <div className="section">
        <h3>Loan Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Loan Type</label>
            <span>{formatLoanType(fd.loanType || loanType) || '-'}</span>
          </div>
          <div className="info-item">
            <label>Loan Amount</label>
            <span>{formatCurrency(fd.loanAmount || loanAmount)}</span>
          </div>
          <div className="info-item">
            <label>Loan Duration</label>
            <span>{fd.loanDuration || tenure ? `${fd.loanDuration || tenure} months (${Math.round((fd.loanDuration || tenure) / 12)} years)` : '-'}</span>
          </div>
          <div className="info-item">
            <label>Purpose</label>
            <span>{fd.purpose || purpose || '-'}</span>
          </div>
        </div>
      </div>

      {/* Loan Documents */}
      <DocumentSection
        title="Loan Documents"
        documents={loanDocuments || []}
        documentType="loan"
      />

      {/* Document Checklist */}
      <div className="section">
        <h3>Document Checklist</h3>
        <div className="document-checklist">
          {formatLoanType(fd.loanType || loanType) === 'Home Loan' && (
            <>
              <div className="checklist-item">
                <span>Sale Agreement</span>
                <span className={`checklist-status ${
                  loanDocuments?.some(doc => doc.name?.toLowerCase().includes('sale agreement')) ? 'verified' : 'pending'
                }`}>
                  {loanDocuments?.some(doc => doc.name?.toLowerCase().includes('sale agreement')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="checklist-item">
                <span>EC (Encumbrance Certificate)</span>
                <span className={`checklist-status ${
                  loanDocuments?.some(doc => doc.name?.toLowerCase().includes('ec')) ? 'verified' : 'pending'
                }`}>
                  {loanDocuments?.some(doc => doc.name?.toLowerCase().includes('ec')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
            </>
          )}
          
          {formatLoanType(fd.loanType || loanType) === 'Vehicle Loan' && (
            <>
              <div className="checklist-item">
                <span>Invoice from Dealer</span>
                <span className={`checklist-status ${
                  loanDocuments?.some(doc => doc.name?.toLowerCase().includes('invoice')) ? 'verified' : 'pending'
                }`}>
                  {loanDocuments?.some(doc => doc.name?.toLowerCase().includes('invoice')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="checklist-item">
                <span>Quotation</span>
                <span className={`checklist-status ${
                  loanDocuments?.some(doc => doc.name?.toLowerCase().includes('quotation')) ? 'verified' : 'pending'
                }`}>
                  {loanDocuments?.some(doc => doc.name?.toLowerCase().includes('quotation')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
            </>
          )}
          
          {formatLoanType(fd.loanType || loanType) === 'Personal Loan' && (
            <>
              <div className="checklist-item">
                <span>Income Certificate</span>
                <span className={`checklist-status ${
                  loanDocuments?.some(doc => doc.name?.toLowerCase().includes('income certificate')) ? 'verified' : 'pending'
                }`}>
                  {loanDocuments?.some(doc => doc.name?.toLowerCase().includes('income certificate')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanTab;
