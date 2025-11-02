import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/customer.base.css';
import { formatLoanType } from '../../utils/enumFormatters';

const MyApplications = ({ applications }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.applicationId || app.id).toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  const getStatusBadgeClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'approved') return 'status-approved';
    if (s === 'rejected') return 'status-rejected';
    return 'status-pending';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };


  const handleViewDetails = (application) => {
    navigate('/customer-dashboard/application-details', {
      state: { application, applicationId: application.applicationId }
    });
  };

  const getStatusIcon = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'approved') return { className: 'bi bi-check-circle', color: '#28a745' };
    if (s === 'rejected') return { className: 'bi bi-x-circle', color: '#dc3545' };
    return { className: 'bi bi-clock', color: '#ffc107' };
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '100%', paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px' }}>
      <div className="container-fluid" style={{ maxWidth: '100%', paddingLeft: '0', paddingRight: '0' }}>
        <div className="mb-4">
          <h1 className="mb-1" style={{ fontSize: '1.75rem', fontWeight: '700' }}>My Applications</h1>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-secondary fst-italic fs-4 fw-semibold">Total: {applications.length}</div>
            <button className="btn btn-primary-custom" onClick={() => navigate('/customer-dashboard/loanapplication')}>
              <i className="bi bi-plus-lg me-2"></i>New Application
            </button>
          </div>
        </div>

        {/* success */}
        {showSuccessMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            {successMessage}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowSuccessMessage(false)}
            ></button>
          </div>
        )}

        {/* filters */}
        <div className="card card-custom mb-4" style={{ maxWidth: '100%', width: '100%' }}>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <label className="form-label">Search Applications</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0" style={{ paddingLeft: '16px', paddingRight: '0px' }}>
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input 
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by ID, loan type, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '8px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* list */}
        <div className="card card-custom" style={{ maxWidth: '100%', width: '100%' }}>
          <div className="card-body">
            {filteredApplications.length > 0 ? (
              <div className="table-responsive" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                <table className="table table-hover" style={{ minWidth: '800px' }}>
                  <thead className="table-light sticky-top" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr>
                      <th style={{ minWidth: '120px' }}>Application ID</th>
                      <th style={{ minWidth: '120px' }}>Loan Type</th>
                      <th style={{ minWidth: '120px' }}>Amount</th>
                      <th style={{ minWidth: '100px' }}>Tenure</th>
                      <th style={{ minWidth: '120px' }}>Status</th>
                      <th style={{ minWidth: '120px' }}>Applied Date</th>
                      <th style={{ minWidth: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => (
                      <tr key={app.applicationId || app.id}>
                        <td>
                          <strong>#{app.applicationId || app.id}</strong>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-file-earmark-text text-primary me-2"></i>
                            <span>{formatLoanType(app.loanType)}</span>
                          </div>
                        </td>
                        <td className="fw-bold">{formatCurrency(app.amount)}</td>
                        <td>{app.tenure ? `${app.tenure} months` : 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                            <i className={`${getStatusIcon(app.status).className} me-1`} style={{ color: getStatusIcon(app.status).color }}></i>
                            {app.status}
                          </span>
                        </td>
                        <td>{app.appliedDate ? (() => {
                          const date = new Date(app.appliedDate);
                          if (isNaN(date.getTime())) return app.appliedDate;
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const year = date.getFullYear();
                          return `${day}-${month}-${year}`;
                        })() : '-'}</td>
                        <td>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewDetails(app)}
                            title="View Details"
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-applications text-center py-5">
                <i className="bi bi-search mb-3" style={{fontSize: '3rem', color: '#bdc3c7'}}></i>
                <h5>No Applications Found</h5>
                <p className="text-muted">
                  {statusFilter !== 'all' || searchTerm ? 
                    'Try adjusting your filters or search terms' : 
                    'You haven\'t submitted any loan applications yet'
                  }
                </p>
                {statusFilter === 'all' && !searchTerm && (
                  <button className="btn btn-primary-custom mt-3" onClick={() => navigate('/customer-dashboard/loanapplication')}>
                    <i className="bi bi-plus-lg me-2"></i>Apply for Your First Loan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* removed: rejected applications edit section */}
      </div>
    </div>
  );
};

export default MyApplications;
