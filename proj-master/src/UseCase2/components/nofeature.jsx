import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/customer.base.css';

const NoFeature = ({ message = 'This feature is not available for now' }) => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <div className="container-fluid">
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <h4 className="mb-2 text-center">{message}</h4>
          <div className="d-flex gap-2">
            <button className="btn btn-back" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i>Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoFeature;
