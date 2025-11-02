// components/ApplicationReview/ApplicationReview.js
import React from 'react';

import './ApplicationReview.css';
import ReviewHeader from './ReviewHeader/ReviewHeader';
import ReviewTabs from './ReviewTabs/ReviewTabs';
// import CibilSection from './CibilSection/CibilSection';
import CommentsSection from './CommentsSection/CommentsSection';

const ApplicationReview = ({
  selectedApplication,
  reviewComments,
  setReviewComments,
  activeTab,
  setActiveTab,
  setCurrentPage,
  handleApprove,
  handleReject
}) => {
  return (
    <div className="application-review">
      <ReviewHeader
        selectedApplication={selectedApplication}
        setCurrentPage={setCurrentPage}
      />

      <ReviewTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedApplication={selectedApplication}
      />

      {/* <CibilSection selectedApplication={selectedApplication} /> */}

      <CommentsSection
        reviewComments={reviewComments}
        setReviewComments={setReviewComments}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
};

export default ApplicationReview;