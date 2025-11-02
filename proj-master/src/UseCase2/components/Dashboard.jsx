import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatLoanType } from '../../utils/enumFormatters';
 

const Dashboard = ({ applications, user }) => {
  const navigate = useNavigate();
  const recentApplications = [...applications]
    .sort((a, b) => a.id - b.id)
    .slice(-3);
  
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

  return (
    <>
      <style>{`
        /* dashboard */
        .quick-action-card { cursor: pointer; text-align: center; padding: 30px 20px; height: 100%; }
        .quick-action-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .quick-action-card i { font-size: 3rem; color: #0072AA; margin-bottom: 15px; display: block; }
        .quick-action-card h5 { color: #2c3e50; font-weight: 600; margin-bottom: 10px; }
        .quick-action-card p { color: #7f8c8d; font-size: 0.9rem; }
      `}</style>

      
      <div className="dashboard-container">
      <div className="container-fluid">
        <div className="mb-4">
          <h1 className="mb-1">Welcome back, {user.name}!</h1>
          <div className="text-secondary fst-italic fs-5 fw-semibold">Welcome to the world of benifits</div>
        </div>

        
        {/* quick */}
        <div>
        <h3 className="mb-4">Quick Actions</h3>
        <div className="row mb-5">
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card card-custom quick-action-card text-center" onClick={() => navigate('/customer-dashboard/loanapplication')}>
              <i className="bi bi-file-earmark-text mb-3"></i>
              <h5>Apply for New Loan</h5>
              <p className="text-muted">Start your loan application process</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card card-custom quick-action-card text-center" onClick={() => navigate('/customer-dashboard/applications')}>
              <i className="bi bi-list-ul mb-3"></i>
              <h5>View All Applications</h5>
              <p className="text-muted">Track your loan applications</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card card-custom quick-action-card text-center" onClick={() => navigate('/customer-dashboard/profile')}>
              <i className="bi bi-person-circle mb-3"></i>
              <h5>Update Profile</h5>
              <p className="text-muted">Manage your personal information</p>
            </div>
          </div>
        </div>
        </div>

        {/* recent */}
        <h2 className="mb-4">Recent Applications</h2>
        <div className="card card-custom">
          <div className="card-body">
            {recentApplications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Loan Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map(app => (
                      <tr key={app.applicationId || app.id}>
                        <td>
                          <strong>#{app.applicationId || app.id}</strong>
                        </td>
                        <td>{formatLoanType(app.loanType)}</td>
                        <td>{formatCurrency(app.amount)}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>{app.appliedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-applications text-center py-5">
                <i className="bi bi-inbox mb-3" style={{fontSize: '3rem', color: '#bdc3c7'}}></i>
                <h5>No Applications Yet</h5>
                <p className="text-muted">Start your loan journey by creating your first application</p>
                <button className="btn btn-primary-custom mt-3" onClick={() => navigate('/customer-dashboard/loanapplication')}>
                  <i className="bi bi-plus-lg me-2"></i>Apply for Loan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
