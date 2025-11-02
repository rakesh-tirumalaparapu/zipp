import React, { useMemo, useState } from 'react';

export default function MakerDashboard({
  applications,
  applicationFilter,
  setApplicationFilter,
  setSelectedApplication,
  setCurrentPage,
  setActiveTab,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => (a.status || 'Pending').toLowerCase() === 'pending').length,
    withChecker: applications.filter(a => (a.status || '').toLowerCase() === 'with checker').length,
    approved: applications.filter(a => (a.status || '').toLowerCase() === 'approved').length,
    rejected: applications.filter(a => (a.status || '').toLowerCase() === 'rejected').length,
  }), [applications]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = [...applications];
    if (applicationFilter !== 'all') list = list.filter(a => a.status === applicationFilter);
    if (!q) return list;
    return list.filter(a =>
      String(a.id || '').toLowerCase().includes(q) ||
      String(a.formData?.fullName || '').toLowerCase().includes(q) ||
      String(a.loanType || a.formData?.loanType || '').toLowerCase().includes(q)
    );
  }, [applications, applicationFilter, searchQuery]);

  const onReview = (app) => {
    setSelectedApplication && setSelectedApplication(app);
    setActiveTab && setActiveTab('personal');
    setCurrentPage && setCurrentPage('review');
  };

  return (
    <div className="container-fluid" style={{padding:'20px'}}>
      <style>{`
        .maker-hero { background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: #fff; border-radius: 12px; padding: 40px 20px; margin-bottom: 30px; }
        .maker-kpi { border-radius: 12px; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 24px 18px; text-align:center; transition: transform 0.2s; cursor: pointer; }
        .maker-kpi:hover { transform: translateY(-4px); box-shadow: 0 6px 28px rgba(0,0,0,0.12); }
        .maker-kpi .num { font-size: 32px; font-weight: 700; line-height:1.2; }
        .maker-kpi .label { font-size: 14px; color: #666; margin-top: 8px; }
        .maker-card { background:#fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 20px; }
        .bucket-tabs .btn { margin-left: 6px; border-radius: 8px; }
        .bucket-tabs .btn-sm { padding: 6px 14px; }
        .kpi-row { margin-left: 0; margin-right: 0; }
        .kpi-row > div { padding-left: 12px; padding-right: 12px; }
      `}</style>

      <div className="maker-hero d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #198754 0%, #28a745 100%)'}}>
        <div className="text-center">
          <h4 className="mb-2">Application Review Dashboard</h4>
          <p className="mb-0 opacity-90">Review and process loan applications</p>
        </div>
      </div>

      <div className="row kpi-row mb-4" style={{ marginLeft: 0, marginRight: 0 }}>
        <div className="col-md-3" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="maker-kpi" style={{cursor:'default'}}>
            <div className="num text-primary">{stats.total}</div>
            <div className="label">Total Applications</div>
          </div>
        </div>
        <div className="col-md-3" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="maker-kpi" style={{cursor:'default'}}>
            <div className="num text-warning">{stats.pending}</div>
            <div className="label">Pending Review</div>
          </div>
        </div>
        <div className="col-md-3" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="maker-kpi" style={{cursor:'default'}}>
            <div className="num text-info">{stats.withChecker}</div>
            <div className="label">With Checker</div>
          </div>
        </div>
        <div className="col-md-3" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="maker-kpi" style={{cursor:'default'}}>
            <div className="num text-success">{stats.approved}</div>
            <div className="label">Approved</div>
          </div>
        </div>
      </div>

      <div className="maker-card mb-3">
        <h5 className="mb-3 fw-semibold">Search & Filter</h5>
        <div className="row g-2 align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-semibold mb-2">Search Applications</label>
            <div className="position-relative">
              <i className="bi bi-search position-absolute" style={{left:12, top:10, color:'#999'}}></i>
              <input className="form-control ps-4" placeholder="Search by name, ID, email, or loan type..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{borderRadius:'8px'}} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold mb-2">Loan Type Filter</label>
            <select className="form-select" style={{borderRadius:'8px'}}>
              <option>All Loan Types</option>
              <option>Personal Loan</option>
              <option>Home Loan</option>
              <option>Vehicle Loan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="maker-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-semibold">Applications ({filtered.length})</h5>
          <div className="bucket-tabs">
            <button className={`btn btn-sm ${applicationFilter==='all'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setApplicationFilter('all')}>All</button>
            <button className={`btn btn-sm ${applicationFilter==='Pending'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setApplicationFilter('Pending')}>Pending</button>
            <button className={`btn btn-sm ${applicationFilter==='With Checker'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setApplicationFilter('With Checker')}>With Checker</button>
            <button className={`btn btn-sm ${applicationFilter==='Approved'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setApplicationFilter('Approved')}>Approved</button>
            <button className={`btn btn-sm ${applicationFilter==='Rejected'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setApplicationFilter('Rejected')}>Rejected</button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Customer Name</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">
                  <i className="bi bi-inbox display-6 text-muted"></i>
                  <p className="text-muted mt-2">No applications found</p>
                </td></tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id}>
                    <td className="fw-semibold text-primary">{app.id}</td>
                    <td>{app.formData?.fullName || app.customerName || '-'}</td>
                    <td>{app.loanType || app.formData?.loanType || '-'}</td>
                    <td className="fw-semibold">₹{Number(app.amount ?? app.loanAmount ?? 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${app.status==='Pending'?'status-pending':app.status==='With Checker'?'status-with-checker':app.status==='Approved'?'status-approved':'status-rejected'}`} style={{
                        background: app.status==='Pending'?'#fffbe6':app.status==='With Checker'?'#e6f2fa':app.status==='Approved'?'#e6f7ed':'#fde7e7',
                        color: app.status==='Pending'?'#d39e00':app.status==='With Checker'?'#0055a4':app.status==='Approved'?'#2d8c50':'#b02a37',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontWeight: '600'
                      }}>{(() => {
                        if (!app.status) return '';
                        const s = String(app.status).toLowerCase();
                        return s.charAt(0).toUpperCase() + s.slice(1);
                      })()}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary review-btn" onClick={()=>onReview(app)}>
                        <i className="bi bi-eye me-1"></i>
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


