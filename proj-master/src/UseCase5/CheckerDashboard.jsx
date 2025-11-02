import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listCheckerApplications } from "../api/apiChecker";
// Removed static applications JSON; will integrate with backend APIs
import "./CheckerDashboard.css";
import { formatLoanType } from "../utils/enumFormatters";

export default function CheckerDashboard() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Removed mock data; use backend data later

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCheckerApplications();
        if (!mounted) return;
        const mapped = (data || []).map((a) => {
          // Map status: WITH_CHECKER -> pending, APPROVED -> approved, REJECTED -> rejected
          const status = String(a.status || '').toUpperCase();
          let mappedStatus;
          if (status === 'WITH_CHECKER') {
            mappedStatus = 'pending';
          } else if (status === 'APPROVED') {
            mappedStatus = 'approved';
          } else if (status === 'REJECTED') {
            mappedStatus = 'rejected';
          } else {
            // Skip applications not meant for checker (WITH_MAKER, PENDING, etc.)
            return null;
          }
          return {
            id: a.applicationId || a.id,
            customerName: a.customerName || a.name,
            loanType: formatLoanType(a.loanType),
            loanAmount: a.loanAmount || 0,
            status: mappedStatus,
            email: a.email,
            submittedDate: a.submittedDate || a.createdAt || a.date || null,
          };
        }).filter(Boolean); // Remove null entries
        setApplications(mapped);
        setFilteredApplications(mapped);
      } catch (e) {
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchQuery) {
      const q = (searchQuery || '').toLowerCase();
      filtered = filtered.filter(app => 
        String(app.id || '').toLowerCase().includes(q) ||
        String(app.customerName || '').toLowerCase().includes(q) ||
        String(app.email || '').toLowerCase().includes(q) ||
        String(app.loanType || '').toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply loan type filter
    if (loanTypeFilter !== "all") {
      filtered = filtered.filter(app => app.loanType === loanTypeFilter);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, loanTypeFilter, applications]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge-status pending",
      approved: "badge-status approved",
      rejected: "badge-status rejected"
    };
    
    // Format status: first letter capital, rest lowercase
    const formatStatus = (s) => {
      if (!s) return '';
      const lower = String(s).toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    return (
      <span className={`badge ${statusClasses[status] || 'badge-status pending'}`}>
        {formatStatus(status)}
      </span>
    );
  };

  const getCibilScoreColor = (score) => {
    if (score >= 750) return "text-success";
    if (score >= 700) return "text-warning";
    return "text-danger";
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-hero d-flex align-items-center justify-content-center mb-4">
        <div className="text-center text-white">
          <h4 className="mb-1">Application Review Dashboard</h4>
          <p className="sub mb-0">Review and process loan applications</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div 
            className={`kpi-card text-center ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
            style={{ cursor: "pointer" }}
          >
            <h3 className="text-primary mb-1">{applications.length}</h3>
            <p className="text-muted mb-0">Total Applications</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div 
            className={`kpi-card text-center ${statusFilter === "pending" ? "active" : ""}`}
            onClick={() => setStatusFilter("pending")}
            style={{ cursor: "pointer" }}
          >
            <h3 className="text-warning mb-1">
              {applications.filter(app => app.status === "pending").length}
            </h3>
            <p className="text-muted mb-0">Pending Review</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div 
            className={`kpi-card text-center ${statusFilter === "approved" ? "active" : ""}`}
            onClick={() => setStatusFilter("approved")}
            style={{ cursor: "pointer" }}
          >
            <h3 className="text-success mb-1">
              {applications.filter(app => app.status === "approved").length}
            </h3>
            <p className="text-muted mb-0">Approved</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div 
            className={`kpi-card text-center ${statusFilter === "rejected" ? "active" : ""}`}
            onClick={() => setStatusFilter("rejected")}
            style={{ cursor: "pointer" }}
          >
            <h3 className="text-danger mb-1">
              {applications.filter(app => app.status === "rejected").length}
            </h3>
            <p className="text-muted mb-0">Rejected</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="section-card mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Search Applications</label>
            <div className="search-field">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by name, ID, email, or loan type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Loan Type Filter</label>
            <select 
              className="form-select" 
              value={loanTypeFilter} 
              onChange={(e) => setLoanTypeFilter(e.target.value)}
            >
              <option value="all">All Loan Types</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="section-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Applications ({filteredApplications.length})</h5>
          <div className="bucket-tabs">
            <button 
              className={`btn btn-sm ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === "approved" ? "active" : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              Approved
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === "rejected" ? "active" : ""}`}
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
          <table className="table table-hover table-bordered" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th><i className="bi bi-hash me-2"></i>Application ID</th>
                <th><i className="bi bi-person me-2"></i>Customer Name</th>
                <th><i className="bi bi-credit-card me-2"></i>Loan Type</th>
                <th><i className="bi bi-currency-rupee me-2"></i>Amount</th>
                <th><i className="bi bi-calendar3 me-2"></i>Date</th>
                <th><i className="bi bi-info-circle me-2"></i>Status</th>
                <th><i className="bi bi-gear me-2"></i>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td><span className="fw-semibold text-primary">{app.id}</span></td>
                  <td>
                    <div className="fw-semibold">{app.customerName}</div>
                  </td>
                  <td>{app.loanType}</td>
                  <td>
                    <span className="fw-semibold">
                      ₹{app.loanAmount.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    {app.submittedDate ? (() => {
                      const date = new Date(app.submittedDate);
                      if (isNaN(date.getTime())) return app.submittedDate;
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}-${month}-${year}`;
                    })() : '-'}
                  </td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <Link 
                      to={`../application/${app.id}`}
                      state={{ status: app.status }}
                      className="btn btn-sm btn-outline-primary review-btn"
                    >
                      <i className="bi bi-eye me-1"></i>
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-4">
            <i className="bi bi-inbox display-4 text-muted"></i>
            <p className="text-muted mt-2">No applications found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}