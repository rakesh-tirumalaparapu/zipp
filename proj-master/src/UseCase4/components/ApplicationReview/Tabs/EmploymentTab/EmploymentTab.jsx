// components/ApplicationReview/Tabs/EmploymentTab/EmploymentTab.jsx
import React from 'react';
import DocumentSection from '../../DocumentSection/DocumentSection';

import './EmploymentTab.css';
import { formatOccupationType } from '../../../../../utils/enumFormatters';

const EmploymentTab = ({ application }) => {
  const { employmentDetails, employmentDocuments } = application;
  const fd = application?.formData || {};
  const emp = employmentDetails || {};
  const docs = employmentDocuments || [];

  return (
    <div className="tab-content active">
      <div className="info-grid">
        <div className="info-item">
          <label>Occupation Type</label>
          <span>{formatOccupationType(fd.occupationType || emp.occupationType) || '-'}</span>
        </div>
        
        <div className="info-item">
          <label>
            {formatOccupationType(fd.occupationType || emp.occupationType) === 'Salaried' ? 'Employer/Business Name' : 'Business Name'}
          </label>
          <span>
            {fd.employer || emp.companyName || emp.businessName || '-'}
          </span>
        </div>
        
        <div className="info-item">
          <label>Designation</label>
          <span>{fd.designation || emp.designation || '-'}</span>
        </div>
        
        <div className="info-item">
          <label>Work Experience (years)</label>
          <span>{fd.totalExperience || emp.workExperience || emp.totalExperience || '-'} {fd.totalExperience || emp.workExperience ? 'years' : ''}</span>
        </div>
        
        <div className="info-item full-width">
          <label>Office Address</label>
          <span>{fd.officeAddress || emp.officeAddress || '-'}</span>
        </div>
        
      </div>

      {/* Employment Documents */}
      <DocumentSection
        title="Employment Documents"
        documents={docs}
        documentType="employment"
      />

      {/* Document Checklist */}
      <div className="section">
        <h3>Document Checklist</h3>
        <div className="info-grid">
          {formatOccupationType(fd.occupationType || emp.occupationType) === 'Salaried' && (
            <>
              <div className="info-item">
                <label>Salary Slips (3-6 months)</label>
                <span className={docs.some(doc => doc.type?.includes('salary')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('salary')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>ITR (Last 2-3 years)</label>
                <span className={docs.some(doc => doc.type?.includes('itr')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('itr')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>Bank Statements (6 months)</label>
                <span className={docs.some(doc => doc.type?.includes('bank')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('bank')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>Employment Proof</label>
                <span className={docs.some(doc => doc.type?.includes('employment')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('employment')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
            </>
          )}
          
          {formatOccupationType(fd.occupationType || emp.occupationType) === 'Self-Employed' && (
            <>
              <div className="info-item">
                <label>Business Proof/GST/Registration</label>
                <span className={docs.some(doc => doc.type?.includes('business') || doc.type?.includes('gst')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('business') || doc.type?.includes('gst')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>ITR (Last 2-3 years)</label>
                <span className={docs.some(doc => doc.type?.includes('itr')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('itr')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
              <div className="info-item">
                <label>Bank Statements (6-12 months)</label>
                <span className={docs.some(doc => doc.type?.includes('bank')) ? 'verified' : 'pending'}>
                  {docs.some(doc => doc.type?.includes('bank')) ? '✓ Provided' : '⏳ Pending'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmploymentTab;