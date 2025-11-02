// components/ApplicationReview/DocumentSection/DocumentSection.js
import React, { useState } from 'react';
import './DocumentSection.css';
import DocumentCard from '../DocumentCard/DocumentCard';

const DocumentSection = ({ title, documents, documentType }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Safely handle undefined documents
  const docsArray = documents || [];

  return (
    <div className="documents-section">
      <h3>{title}</h3>

      {/* Document Grid */}
      <div className="documents-grid">
        {docsArray.map((doc, index) => (
          <DocumentCard
            key={index}
            document={doc}
            documentType={documentType}
            docIndex={index}
            onView={() => setSelectedDoc(doc)} // Open PDF on click
          />
        ))}
      </div>

      {/* Inline PDF Viewer */}
      {selectedDoc && (
        <div className="pdf-viewer-overlay">
          <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
              <h4>{selectedDoc.name || 'Document Preview'}</h4>
              <button className="close-btn" onClick={() => setSelectedDoc(null)}>
                ✕
              </button>
            </div>
            <iframe
              src={selectedDoc.url}
              title="PDF Viewer"
              className="pdf-frame"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSection;
