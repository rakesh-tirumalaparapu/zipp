import React, { useState, useEffect, useRef } from 'react';
import AllPopup from '../../components/AllPopup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getUnreadCount, getNotifications, markAsRead } from '../../api/notifications';
 

const Navbar = ({ user, onMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [logoutModal, setLogoutModal] = useState(false);
  const handleLogout = () => setLogoutModal(true);
  const confirmLogout = () => {
    try {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
    } catch {}
    setLogoutModal(false);
    navigate('/login', { replace: true });
  };

  // outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // route
  useEffect(() => {
    setShowDropdown(false);
    // TODO: fetch unread notifications count from backend
    setUnreadCount(0);
  }, [location]);

  // initial compute on mount
  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch { setUnreadCount(0); }
    }
    fetchUnreadCount();
  }, [location]);

  // live updates when notifications are modified
  useEffect(() => {
    // TODO: subscribe to real-time notifications if needed
  }, []);

  return (
    <>
      <style>{`
        .usecase2 .navbar-custom { background: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-bottom: 1px solid #eaeaea; padding-top: 10px; padding-bottom: 10px; position: sticky; top: 0; z-index: 1050; height: 70px; }
        .usecase2 .navbar-custom .container-fluid { padding-left: 0; padding-right: 16px; }
        .usecase2 .navbar-custom .navbar-brand { padding: 0; margin: 0; margin-left: -35px; }
        .usecase2 .navbar-custom .navbar-brand { font-size: 1.5rem; font-weight: bold; color: #0d6efd !important; text-decoration: none; border: none; background: none; }
        .usecase2 .navbar-custom .navbar-brand:hover { color: #0b5ed7 !important; }
        .usecase2 .navbar-custom .btn-primary { background: #0d6efd; border-color: #0d6efd; }
        .usecase2 .navbar-custom .btn-primary:hover { background: #0b5ed7; border-color: #0a58ca; }
        .usecase2 .dropdown { position: relative; }
        .usecase2 .dropdown-menu { border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; margin-top: 8px; min-width: 250px; z-index: 1050; right: 0 !important; left: auto !important; transform: none !important; }
        .usecase2 .dropdown-menu.dropdown-menu-end { right: 0 !important; left: auto !important; transform: translateX(0) !important; }
        .usecase2 .dropdown-item { padding: 10px 20px; transition: background-color 0.2s; }
        .usecase2 .dropdown-item:hover { background: #f8f9fa; }
        .usecase2 .dropdown-item.text-danger:hover { background: #f8d7da; color: #842029 !important; }
        .usecase2 .dropdown-item-text { padding: 15px 20px; margin: 0; }
        .usecase2 .navbar-custom .fw-semibold { color: #0d6efd; }
        /* Notifications bell */
        .usecase2 .notif-btn { position: relative; color: #0d6efd; transition: transform .2s ease, color .2s ease; background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; outline: none !important; }
        .usecase2 .notif-btn:focus { outline: none !important; box-shadow: none !important; border: none !important; }
        .usecase2 .notif-btn:active { outline: none !important; box-shadow: none !important; border: none !important; background: transparent !important; }
        .usecase2 .notif-btn .bell { display: inline-block; transition: transform .2s ease; }
        .usecase2 .notif-btn:hover { color: #0b5ed7; transform: translateY(-1px); background: transparent !important; border: none !important; box-shadow: none !important; outline: none !important; }
        .usecase2 .notif-btn:hover .bell { transform: scale(1.08); }
        .usecase2 .notif-badge { position: absolute; top: -2px; right: -2px; min-width: 18px; height: 18px; border-radius: 9px; background: #dc3545; box-shadow: 0 0 0 2px #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: #fff; padding: 0 4px; }
        /* Profile button - remove box styling */
        .usecase2 .profile-btn { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; outline: none !important; }
        .usecase2 .profile-btn:focus { outline: none !important; box-shadow: none !important; border: none !important; }
        .usecase2 .profile-btn:active { outline: none !important; box-shadow: none !important; border: none !important; background: transparent !important; }
        .usecase2 .profile-btn:hover { background: transparent !important; border: none !important; box-shadow: none !important; outline: none !important; }
        /* Optional subtle pulse */
        .usecase2 .notif-badge::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: 0 0 0 0 rgba(220,53,69,.5); animation: uc2-pulse 1.8s infinite; }
        @keyframes uc2-pulse { 0% { box-shadow: 0 0 0 0 rgba(220,53,69,.5); } 70% { box-shadow: 0 0 0 6px rgba(220,53,69,0); } 100% { box-shadow: 0 0 0 0 rgba(220,53,69,0); } }
        /* burger */
        .usecase2 .menu-btn { display: none; }
        @media (max-width: 768px) { .usecase2 .dropdown-menu { min-width: 220px; right: 0 !important; left: auto !important; } }
        @media (max-width: 576px) { .usecase2 .dropdown-menu { min-width: 200px; right: 0 !important; left: auto !important; } }
        @media (max-width: 992px) { .usecase2 .menu-btn { display: inline-flex; } }
      `}</style>
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
        <div className="container-fluid">
          <Link
            to="/customer-dashboard/dashboard"
            className="navbar-brand d-flex align-items-center p-0"
            aria-label="Home"
          >
            <img
              src="/assets/sc-logo.png"
              alt="Standard Chartered"
              width="240"
              height="65"
              style={{ objectFit: 'contain', display: 'block' }}
            />
          </Link>
          <button
            className="btn bg-transparent border-0 me-2 menu-btn"
            type="button"
            aria-label="Menu"
            onClick={() => onMenu && onMenu()}
          >
            <i className="bi bi-list fs-3"></i>
          </button>
          
          <div className="navbar-nav ms-auto">
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn position-relative notif-btn"
                aria-label="Notifications"
                onClick={async () => { try { const list = await getNotifications(); const unread = (list||[]).filter(n=>!n.read); await Promise.all(unread.map(n=>markAsRead(n.id))); } catch {} setUnreadCount(0); navigate('/customer-dashboard/notifications'); }}
                title={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
              >
                <i className="bi bi-bell fs-5 bell"></i>
                {unreadCount > 0 && (
                  <span className="notif-badge" aria-hidden="true">{unreadCount}</span>
                )}
              </button>
              <div className="dropdown" ref={dropdownRef}>
                <button 
                  className="btn profile-btn text-primary"
                  onClick={() => setShowDropdown(!showDropdown)}
                  type="button"
                  aria-label="User menu"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                </button>
                
                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show position-absolute">
                    <div className="dropdown-item-text">
                      <strong>{user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item" 
                      onClick={() => { navigate('/customer-dashboard/profile'); setShowDropdown(false); }}
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile Settings
                    </button>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <AllPopup
        show={logoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onClose={() => setLogoutModal(false)}
        onConfirm={confirmLogout}
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </>
  );
};

export default Navbar;