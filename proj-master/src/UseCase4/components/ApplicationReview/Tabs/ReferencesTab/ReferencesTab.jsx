// components/ApplicationReview/Tabs/ReferencesTab/ReferencesTab.jsx
import React from 'react';
import './ReferencsTab.css';

const ReferencesTab = ({ application }) => {
  const fd = application?.formData || {};
  const references = fd.references || application?.references || [];
  
  if (!references || references.length === 0) {
    return (
      <div className="references-tab">
        <h3>References</h3>
        <p className="no-reference">No reference information available.</p>
      </div>
    );
  }

  return (
    <div className="references-tab">
      <h3>References</h3>
      {references.map((reference, index) => (
        <div key={index} className="reference-card">
          <h4>Reference {index + 1}</h4>
          <div className="reference-item">
            <label>Name</label>
            <span>{reference.name || '-'}</span>
          </div>

          <div className="reference-item">
            <label>Relationship</label>
            <span>{reference.relationship || '-'}</span>
          </div>

          <div className="reference-item">
            <label>Contact Number</label>
            <span>{reference.contact || reference.phone || '-'}</span>
          </div>

          <div className="reference-item">
            <label>Address</label>
            <span>{reference.address || '-'}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReferencesTab;
