// components/ApplicationReview/CibilSection/CibilSection.js
import React from 'react';
import './CibilSection.css';

const CibilSection = ({ selectedApplication }) => {
  const getCibilLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    return 'Fair';
  };

  return (
    <div className="cibil-section">
      <div className="cibil-score">
        <div className="score-circle">
          <span className="score">{selectedApplication.cibilScore}</span>
          <span className="score-label">{getCibilLabel(selectedApplication.cibilScore)}</span>
        </div>
        <div className="score-ranges">
          <div className="score-range">
            <span className="range-label">Excellent:</span>
            <span className="range-value">750+</span>
          </div>
          <div className="score-range">
            <span className="range-label">Good:</span>
            <span className="range-value">650-749</span>
          </div>
          <div className="score-range">
            <span className="range-label">Fair/Poor:</span>
            <span className="range-value">&lt;650</span>
          </div>
        </div>
      </div>
      <div className="score-update">
        Last updated: {new Date(selectedApplication.cibilLastUpdated).toLocaleDateString('en-IN')}
      </div>
    </div>
  );
};

export default CibilSection;