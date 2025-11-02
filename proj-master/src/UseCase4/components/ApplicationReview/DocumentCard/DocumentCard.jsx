// components/ApplicationReview/DocumentCard/DocumentCard.js
import React, { useState } from 'react';
import AllPopup from '../../../../components/AllPopup';
import './DocumentCard.css';
import { getDocument } from '../../../../api/documents';

const DocumentCard = ({ document, documentType, docIndex }) => {
  const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });
  const getDocumentIcon = (type) => {
    const icons = {
      identity: '🆔',
      address: '🏠',
      salary: '💰',
      itr: '📊',
      bank: '🏦',
      property: '🏢',
      vehicle: '🚗',
      photo: '📷'
    };
    return icons[type] || '📄';
  };

  const handleDocumentClick = async (doc) => {
    try {
      const blob = await getDocument(doc.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      setInfoModal({ show: true, title: 'Open Document', message: e.message || 'Unable to open document' });
    }
  };

  const toggleVerification = () => {
    // This would be connected to the parent component's state
    setInfoModal({ show: true, title: 'Verification', message: `Toggling verification for ${document.name}` });
  };

  return (
    <>
    <div className={`document-card ${document.verified ? 'verified' : 'pending'}`}>
      <div className="document-icon">
        {getDocumentIcon(document.documentType || document.type)}
      </div>
      <div className="document-info">
        <h4>{document.name || (document.documentType || 'Document')}</h4>
        <p className="document-file">ID: {document.id}</p>
      </div>
      <div className="document-actions">
        <button 
          className={`verify-btn ${document.verified ? 'verified' : 'pending'}`}
          onClick={toggleVerification}
        >
          {document.verified ? '✓ Verified' : 'Verify'}
        </button>
        <button 
          className="view-btn"
          onClick={() => handleDocumentClick(document)}
        >
          👁️ View
        </button>
      </div>
    </div>
    <AllPopup
      show={infoModal.show}
      title={infoModal.title}
      message={infoModal.message}
      onClose={() => setInfoModal({ ...infoModal, show: false })}
    />
    </>
  );
};

export default DocumentCard;