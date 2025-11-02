// components/ApplicationReview/Tabs/PersonalTab/PersonalTab.js
import React from 'react';
import DocumentSection from '../../DocumentSection/DocumentSection';
import './PersonalTab.css';
import { formatMaritalStatus, formatGender } from '../../../../../utils/enumFormatters';

const PersonalTab = ({ application }) => {
  const fd = application?.formData || {};
  const p = application?.personalDetails || {};
  
  const computeAge = (dobStr) => {
    if (!dobStr) return '';
    const d = new Date(dobStr);
    if (Number.isNaN(d.getTime())) return '';
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="tab-content active">
      <div className="info-grid">
        <div className="info-item">
          <label>First Name</label>
          <span>{fd.firstName || p.firstName || '-'}</span>
        </div>
        <div className="info-item">
          <label>Middle Name</label>
          <span>{fd.middleName || p.middleName || '-'}</span>
        </div>
        <div className="info-item">
          <label>Last Name</label>
          <span>{fd.lastName || p.lastName || '-'}</span>
        </div>
        <div className="info-item">
          <label>Phone Number</label>
          <span>{fd.phone || p.phone || '-'}</span>
        </div>
        <div className="info-item">
          <label>Email Address</label>
          <span>{fd.email || p.email || '-'}</span>
        </div>
        <div className="info-item full-width">
          <label>Current Address</label>
          <span>{fd.currentAddress || p.currentAddress || '-'}</span>
        </div>
        <div className="info-item full-width">
          <label>Permanent Address</label>
          <span>{fd.permanentAddress || p.permanentAddress || '-'}</span>
        </div>
        <div className="info-item">
          <label>Marital Status</label>
          <span>{formatMaritalStatus(fd.maritalStatus || p.maritalStatus) || '-'}</span>
        </div>
        <div className="info-item">
          <label>Gender</label>
          <span>{formatGender(fd.gender || p.gender) || '-'}</span>
        </div>
        <div className="info-item">
          <label>Date of Birth</label>
          <span>{fd.dob || p.dateOfBirth || '-'}</span>
        </div>
        <div className="info-item">
          <label>Age</label>
          <span>{fd.age || computeAge(fd.dob || p.dateOfBirth) || '-'}</span>
        </div>
        <div className="info-item">
          <label>Aadhaar Number</label>
          <span>{fd.aadharNumber || p.aadhaarNumber || p.aadharNumber || '-'}</span>
        </div>
        <div className="info-item">
          <label>PAN Number</label>
          <span>{fd.panNumber || p.panNumber || '-'}</span>
        </div>
        <div className="info-item">
          <label>Passport Number</label>
          <span>{fd.passportNumber || p.passportNumber || '-'}</span>
        </div>
        <div className="info-item">
          <label>Father's Name</label>
          <span>{fd.fatherName || p.fatherName || '-'}</span>
        </div>
        <div className="info-item">
          <label>Education</label>
          <span>{fd.highestQualification || p.education || p.highestQualification || '-'}</span>
        </div>
      </div>

      <DocumentSection
        title="Personal Documents"
        documents={application.personalDocuments || []}
        documentType="personal"
      />
    </div>
  );
};

export default PersonalTab;