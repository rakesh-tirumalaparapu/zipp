// components/Dashboard/ApplicationTile/ApplicationTile.js
import React from 'react';
import './ApplicationTile.css';
import { formatLoanType } from '../../../../utils/enumFormatters';

const ApplicationTile = ({ application, onClick }) => {
  const normalizeStatus = (s) => {
    const x = String(s || '').toLowerCase();
    if (x.includes('reading')) return 'Pending';
    if (x.includes('checker')) return 'With Checker';
    if (x.includes('approved')) return 'Approved';
    if (x.includes('rejected')) return 'Rejected';
    if (x === 'pending') return 'Pending';
    return 'Pending';
  };

  const statusText = normalizeStatus(application.status);

  const handleReviewClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div className="application-tile">
      <div className="tile-header">
        <h4>{application.customerName}</h4>
        <span className={`status ${statusText.toLowerCase().replace(/\s+/g,'-')}`}>
          {statusText}
        </span>
      </div>
      <div className="tile-details">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{application.customerName || application.formData?.fullName || '-'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Application ID:</span>
          <span className="detail-value">{application.applicationId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{formatLoanType(application.loanType)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Amount:</span>
          <span className="detail-value">₹ {(Number(application.loanAmount ?? application.amount ?? 0)).toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div className="tile-footer">
        <span className="application-date">
          {application.submittedDate ? new Date(application.submittedDate).toLocaleDateString() : 'Date not available'}
        </span>
        <button className="review-btn" onClick={handleReviewClick}>Review →</button>
      </div>
    </div>
  );
};

export default ApplicationTile;