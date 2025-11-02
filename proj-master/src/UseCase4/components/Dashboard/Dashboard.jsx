// components/Dashboard/Dashboard.js
import React, { useState } from 'react';
import ApplicationTile from './ApplicationTile/ApplicationTile';

import './Dashboard.css';

const Dashboard = ({
  applications,
  visibleApplications,
  applicationFilter,
  setApplicationFilter,
  setSelectedApplication,
  setCurrentPage,
  setActiveTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const normalizeStatus = (s) => {
    const x = String(s || '').toLowerCase();
    if (x.includes('reading')) return 'Pending';
    if (x.includes('checker')) return 'With Checker';
    if (x.includes('approved')) return 'Approved';
    if (x.includes('rejected')) return 'Rejected';
    if (x === 'pending') return 'Pending';
    return 'Pending';
  };

  const stats = applications.reduce((acc, app) => {
    const s = normalizeStatus(app.status);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, { 'Pending':0, 'With Checker':0, 'Approved':0, 'Rejected':0 });

  // Filter applications based on search
  const source = Array.isArray(visibleApplications) ? visibleApplications : applications;
  const filteredApplications = source.filter(application => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    
    switch (searchCategory) {
      case 'applicationId':
        return application.applicationId?.toLowerCase().includes(term);
      case 'customerName':
        return application.customerName?.toLowerCase().includes(term);
      case 'loanAmount':
        return application.loanAmount?.toString().includes(term);
      case 'all':
      default:
        return (
          application.applicationId?.toLowerCase().includes(term) ||
          application.customerName?.toLowerCase().includes(term) ||
          application.loanAmount?.toString().includes(term) ||
          application.status?.toLowerCase().includes(term)
        );
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled in the filteredApplications above
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchCategory('all');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Loan Applications Dashboard</h2>
        <p>Manage and review all loan applications</p>
        <div className="row mt-3">
          <div className="col-md-3 mb-3">
            <button className={`card card-custom text-center p-3 w-100 ${applicationFilter === 'Pending' ? 'kpi-card-selected' : ''}`} onClick={()=>setApplicationFilter('Pending')}>
              <div className="fs-3 text-warning fw-bold">{stats['Pending']}</div>
              <div className="text-muted">Pending</div>
            </button>
          </div>
          <div className="col-md-3 mb-3">
            <button className={`card card-custom text-center p-3 w-100 ${applicationFilter === 'With Checker' ? 'kpi-card-selected' : ''}`} onClick={()=>setApplicationFilter('With Checker')}>
              <div className="fs-3 text-info fw-bold">{stats['With Checker']}</div>
              <div className="text-muted">With Checker</div>
            </button>
          </div>
          <div className="col-md-3 mb-3">
            <button className={`card card-custom text-center p-3 w-100 ${applicationFilter === 'Approved' ? 'kpi-card-selected' : ''}`} onClick={()=>setApplicationFilter('Approved')}>
              <div className="fs-3 text-success fw-bold">{stats['Approved']}</div>
              <div className="text-muted">Approved</div>
            </button>
          </div>
          <div className="col-md-3 mb-3">
            <button className={`card card-custom text-center p-3 w-100 ${applicationFilter === 'Rejected' ? 'kpi-card-selected' : ''}`} onClick={()=>setApplicationFilter('Rejected')}>
              <div className="fs-3 text-danger fw-bold">{stats['Rejected']}</div>
              <div className="text-muted">Rejected</div>
            </button>
          </div>
        </div>
      </div>

   

      {/* Search Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Search Applications</h3>
          <p>Find specific applications using the search criteria below</p>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-controls">
            <div className="search-input-group">
              <select 
                className="search-category"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="applicationId">Application ID</option>
                <option value="customerName">Customer Name</option>
                <option value="loanAmount">Loan Amount</option>
                <option value="status">Status</option>
              </select>
              
              <div className="search-input-wrapper">
                <input 
                  type="text"
                  className="search-input"
                  placeholder={`Search by ${searchCategory === 'all' ? 'any field' : searchCategory}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    type="button"
                    className="clear-search"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <button type="submit" className="search-btn">
              <span className="search-icon">🔍</span>
              Search
            </button>
          </div>
        </form>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="search-results-info">
            <p>
              Found {filteredApplications.length} application(s) matching "{searchTerm}" 
              in {searchCategory === 'all' ? 'all fields' : searchCategory}
            </p>
            <button 
              className="clear-results-btn"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Applications Grid */}
      <div className="applications-grid">
        {filteredApplications.map(application => (
          <ApplicationTile
            key={application.applicationId}
            application={application}
            onClick={() => {
              setSelectedApplication(application);
              setCurrentPage('review');
              setActiveTab('personal');
            }}
          />
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>
            {searchTerm 
              ? `No applications match your search criteria. Try adjusting your search terms.`
              : 'There are no applications matching the current filter.'
            }
          </p>
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={handleClearSearch}
            >
              Show All Applications
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;