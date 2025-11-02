import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ open = false, onClose }) => {
  const menuItems = [
    { to: '/customer-dashboard/dashboard', icon: 'bi bi-house', label: 'Dashboard' },
    { to: '/customer-dashboard/loanapplication', icon: 'bi bi-file-earmark-text', label: 'Apply for Loan' },
    { to: '/customer-dashboard/applications', icon: 'bi bi-list-ul', label: 'My Applications' },
    { to: '/customer-dashboard/profile', icon: 'bi bi-person', label: 'Profile' }
  ];

  return (
    <>
      <style>{`
        .usecase2 .sidebar { 
          width: 220px; 
          background: #ffffff;
          box-shadow: 2px 0 15px rgba(0,0,0,0.05); 
          display: flex; flex-direction: column; 
          position: sticky; top: var(--navbar-height); 
          height: calc(100vh - var(--navbar-height)); 
          overflow-y: auto; z-index: 100;
          padding: 15px 10px;
          border-right: 1px solid #f0f0f0;
        }
        /* drawer */
        .usecase2 .sidebar-overlay { display: none; }
        @media (max-width: 992px) {
          .usecase2 .sidebar { position: fixed; top: var(--navbar-height); left: 0; height: calc(100vh - var(--navbar-height)); transform: translateX(-100%); transition: transform .25s ease; z-index: 1050; }
          .usecase2 .sidebar.open { transform: translateX(0); }
          .usecase2 .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 1040; top: var(--navbar-height); }
        }
        .usecase2 .sidebar .nav-link { 
          color: #4a5568; 
          padding: 10px 15px; 
          font-weight: 500; 
          font-size: 0.9rem;
          transition: all 0.2s ease; 
          margin-bottom: 4px; 
          border-radius: 8px; 
          border: 1px solid transparent;
          background-color: transparent !important; 
          appearance: none; -webkit-appearance: none; 
          outline: none; 
          width: 100%; 
          text-align: left; 
          -webkit-tap-highlight-color: transparent; 
          text-decoration: none !important;
        }
        .usecase2 .sidebar .nav .nav-item:hover,
        .usecase2 .sidebar .nav .nav-item:focus-within { background: transparent !important; }
        .usecase2 .sidebar .nav .nav-link:hover,
        .usecase2 .sidebar .nav .nav-link:focus,
        .usecase2 .sidebar .nav .nav-link:focus-visible {
          background-color: #f0fdf4 !important;
          color: #15803d;
          border-color: #dcfce7;
          padding-left: 15px;
          transform: translateX(2px);
        }
        /* active */
        .usecase2 .sidebar .nav .nav-link:active {
          background-color: #e6f7ee !important;
          transform: translateX(0);
        }
        /* pseudo */
        .usecase2 .sidebar .nav .nav-link::before,
        .usecase2 .sidebar .nav .nav-link::after { display: none !important; }
        .usecase2 .sidebar .nav-link.active { 
          background-color: #f0fdf4 !important;
          color: #15803d;
          border-left: 4px solid #22c55e;
          padding: 10px 15px;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .usecase2 .sidebar .nav-link.active:hover { 
          background-color: #e6f7ee !important;
          color: #166534;
          transform: translateX(0);
          padding: 10px 15px;
        }
        .usecase2 .sidebar .nav-link i { width: 20px; text-align: center; }
        @media (max-width: 768px) { .usecase2 .sidebar { width: 85%; } }
      `}</style>
      <div className="usecase2">
        {/* overlay */}
        {open && <div className="sidebar-overlay" onClick={() => onClose && onClose()}></div>}
        <div className={`sidebar ${open ? 'open' : ''}`}>
          <div className="sidebar-content">
            {/* close */}
            <div className="d-lg-none d-flex justify-content-end mb-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => onClose && onClose()}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <ul className="nav flex-column">
              {menuItems.map(item => (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    end={item.to === '/customer-dashboard/dashboard'}
                    onClick={() => onClose && onClose()}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
