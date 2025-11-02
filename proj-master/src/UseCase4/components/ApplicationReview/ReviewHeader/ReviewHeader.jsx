// components/ApplicationReview/ReviewHeader/ReviewHeader.jsx
import React from 'react';
import './ReviewHeader.css';

const ReviewHeader = ({ selectedApplication, setCurrentPage }) => {
    const p = selectedApplication?.personalDetails || {};
    const fullName = [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ').trim();
    return (
        <div className="review-header">
            <button 
                className="back-button"
                onClick={() => setCurrentPage('dashboard')}
            >
                ← Back to Dashboard
            </button>
            
            <div className="header-center">
                <h2>Application Review</h2>
                <div className="application-id">{selectedApplication.applicationId || selectedApplication.id}</div>
            </div>
            
            <div className="customer-info">
                <h3 className="customer-name">{fullName || selectedApplication.customerName}</h3>
                <div className="customer-details">
                    <div>{p.emailAddress || selectedApplication.email}</div>
                    <div>{p.phoneNumber || selectedApplication.phone}</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewHeader;