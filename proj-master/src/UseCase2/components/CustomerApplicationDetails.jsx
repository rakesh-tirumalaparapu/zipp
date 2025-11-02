import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonalTab from '../../UseCase4/components/ApplicationReview/Tabs/PersonalTab/PersonalTab';
import EmploymentTab from '../../UseCase4/components/ApplicationReview/Tabs/EmploymentTab/EmploymentTab';
import LoanTab from '../../UseCase4/components/ApplicationReview/Tabs/LoanTab/LoanTab';
import ExistingLoansTab from '../../UseCase4/components/ApplicationReview/Tabs/ExistingLoansTab/ExistingLoansTab';
import ReferencesTab from '../../UseCase4/components/ApplicationReview/Tabs/ReferencesTab/ReferencesTab';
import CommentsTab from '../../UseCase4/components/ApplicationReview/Tabs/CommentsTab/CommentsTab';
import ReviewTab from '../../UseCase4/components/ApplicationReview/Tabs/ReviewTab/ReviewTab';
import '../styles/customer.base.css';
import '../styles/application.details.css';
import { formatLoanType } from '../../utils/enumFormatters';

const CustomerApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;
  const [activeTab, setActiveTab] = useState('personal');

  const fd = application?.formData && typeof application.formData === 'object'
    ? application.formData
    : application;

  if (!application) {
    return (
      <div className="dashboard-container">
        <div className="container-fluid">
          <div className="text-center py-5">
            <i className="bi bi-exclamation-triangle text-warning mb-3" style={{fontSize: '3rem'}}></i>
            <h3>Application Not Found</h3>
            <p className="text-muted">The requested application could not be found.</p>
            <button className="btn btn-primary-custom" onClick={() => navigate('/customer-dashboard/applications')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'under review':
        return 'status-under-review';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'more info required':
        return 'status-more-info';
      default:
        return 'status-pending';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateEMI = (amount, tenure) => {
    const principal = parseFloat(amount);
    const months = parseInt(tenure);
    const rate = 0.12; // 12% annual interest rate
    const monthlyRate = rate / 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Only show Comments tab after decision points: approved or rejected (by maker/checker)
  const normalizedStatus = String(application.status || '').toLowerCase();
  const showCommentsTab = normalizedStatus === 'approved' || normalizedStatus === 'rejected';

  const tabs = [
    { id: 'personal', label: 'Personal', icon: 'bi-person' },
    { id: 'employment', label: 'Employment', icon: 'bi-briefcase' },
    { id: 'loan', label: 'Loan Details', icon: 'bi-credit-card' },
    { id: 'existing', label: 'Existing Loans', icon: 'bi-bank' },
    { id: 'references', label: 'References', icon: 'bi-people' },
    ...(showCommentsTab ? [{ id: 'comments', label: 'Comments', icon: 'bi-chat-dots' }] : []),
    { id: 'review', label: 'Review', icon: 'bi-check-circle' }
  ];

  return (
    <div className="dashboard-container">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 details-page">
            <button className="btn btn-back mb-4" onClick={() => navigate('/customer-dashboard/applications')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Applications
            </button>

            {/* Header */}
            <div className="card card-custom mb-4 details-header">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="mb-1">{formatLoanType(application.loanType || fd?.loanType) || 'Loan Application'}</h2>
                    <p className="text-muted mb-2">Application ID: #{application.id}</p>
                    <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <div className="details-header-actions">
                      <button className="btn btn-outline-primary details-header-action" onClick={() => navigate('/customer-dashboard/no-feature')}>
                        <i className="bi bi-download me-1"></i>Download PDF
                      </button>
                      {/* Edit & Resubmit removed for rejected applications */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="card card-custom mb-4">
              <div className="card-body">
                <div className="application-tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`${tab.icon} me-2`}></i>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card card-custom mb-4">
              <div className="card-body">
                {activeTab === 'personal' && <PersonalTab application={{ ...application, formData: fd }} />}
                {activeTab === 'employment' && <EmploymentTab application={{ ...application, formData: fd }} />}
                {activeTab === 'loan' && <LoanTab application={{ ...application, formData: fd }} />}
                {activeTab === 'existing' && <ExistingLoansTab application={{ ...application, formData: fd }} />}
                {activeTab === 'references' && <ReferencesTab application={{ ...application, formData: fd }} />}
                {activeTab === 'comments' && showCommentsTab && <CommentsTab application={{ ...application, formData: fd }} />}
                {activeTab === 'review' && <ReviewTab application={{ ...application, formData: fd }} />}
              </div>
            </div>

            {/* Status & Remarks */}
            <div className="card card-custom mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3"><i className="bi bi-info-circle text-warning me-2"></i>Status & Remarks</h5>
                <div className="row row-cols-1 row-cols-md-3 g-3">
                  <div className="col">
                    <div className="profile-label">Current Status</div>
                    <div className="profile-value">
                      <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>{application.status}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="profile-label">Applied Date</div>
                    <div className="profile-value">{application.appliedDate}</div>
                  </div>
                  <div className="col">
                    <div className="profile-label">Remarks</div>
                    <div className={`profile-value ${application.status.toLowerCase() === 'rejected' ? 'text-danger' : 'text-muted'}`}>{application.remarks || 'No remarks available'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="card card-custom details-actions-card">
              <div className="card-body">
                <div className="details-actions">
                  <button className="btn btn-outline-primary details-action" onClick={() => {}}>
                    <i className="bi bi-telephone me-2"></i>Contact Support
                  </button>
                  <button className="btn btn-outline-info details-action" onClick={() => {}}>
                    <i className="bi bi-chat-dots me-2"></i>Live Chat
                  </button>
                  <button className="btn btn-outline-secondary details-action" onClick={() => {}}>
                    <i className="bi bi-printer me-2"></i>Print Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerApplicationDetails;

