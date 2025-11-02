// components/ApplicationReview/ReviewTabs/ReviewTabs.js
import React from 'react';

import './ReviewTabs.css';
import PersonalTab from '../Tabs/PersonalTab/PersonalTab';
import EmploymentTab from '../Tabs/EmploymentTab/EmploymentTab';
import LoanTab from '../Tabs/LoanTab/LoanTab';
import ExistingLoansTab from '../Tabs/ExistingLoansTab/ExistingLoansTab';
import ReferencesTab from '../Tabs/ReferencesTab/ReferencesTab';
import ReviewTab from '../Tabs/ReviewTab/ReviewTab';
import CheckerCommentsTab from '../Tabs/CheckerCommentsTab/CheckerCommentsTab';

const ReviewTabs = ({ activeTab, setActiveTab, selectedApplication }) => {
  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'employment', label: 'Employment' },
    { id: 'loan', label: 'Loan Details' },
    { id: 'existing', label: 'Existing Loans' },
    { id: 'references', label: 'References' },
    { id: 'checker-comments', label: 'Checker Comments' },
    { id: 'review', label: 'Review' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalTab application={selectedApplication} />;
      case 'employment':
        return <EmploymentTab application={selectedApplication} />;
      case 'loan':
        return <LoanTab application={selectedApplication} />;
      case 'existing':
        return <ExistingLoansTab application={selectedApplication} />;
      case 'references':
        return <ReferencesTab application={selectedApplication} />;
      case 'checker-comments':
        return <CheckerCommentsTab application={selectedApplication} />;
      case 'review':
        return <ReviewTab application={selectedApplication} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="tabs-navigation">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content-container">
        {renderTabContent()}
      </div>
    </>
  );
};

export default ReviewTabs;