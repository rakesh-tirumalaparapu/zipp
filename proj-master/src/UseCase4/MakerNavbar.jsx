import React, { useEffect, useRef, useState } from 'react';
import AllPopup from '../components/AllPopup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUnreadCount, getNotifications, markAsRead } from '../api/notifications';
import { getMakerProfile } from '../api/apiMaker';

export default function MakerNavbar({ onLogout, onGoDashboard, onGoNotifications }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [profileInitials, setProfileInitials] = useState('M');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    async function fetchUnreadCount() {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch { setUnreadCount(0); }
    }
    fetchUnreadCount();
  }, [location]);

  useEffect(() => {
    if (showDropdown && !profileName) {
      getMakerProfile()
        .then((data) => {
          const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
          setProfileName(fullName);
          // Generate initials: first letter of first name, first letter of last name
          const firstName = data.firstName || '';
          const lastName = data.lastName || '';
          let initials = '';
          if (firstName) initials += firstName.charAt(0).toUpperCase();
          if (lastName) initials += lastName.charAt(0).toUpperCase();
          if (!initials) initials = 'M'; // Fallback to M if no name
          setProfileInitials(initials);
        })
        .catch(() => {
          setProfileName("Maker User");
          setProfileInitials('M');
        });
    }
  }, [showDropdown, profileName]);

  const confirmLogout = () => {
    setLogoutModal(false);
    if (typeof onLogout === 'function') onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <>
    <style>{`
      .maker-navbar { background: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-bottom: 1px solid #eaeaea; padding: 10px 0; position: sticky; top: 0; z-index: 1050; height: 70px; }
      .maker-navbar .container-fluid { padding-left: 0; padding-right: 16px; }
      .maker-navbar .navbar-brand { text-decoration: none; padding: 0; margin: 0; margin-left: -35px; margin-right: 20px; }
      .maker-navbar .navbar-brand img { object-fit: contain; display: block; }
      .maker-navbar .nav-link { color: #198754; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; transition: all 0.2s ease; position: relative; display: inline-flex; align-items: center; }
      .maker-navbar .nav-link:hover:not(.active) { color: #157347; background-color: #f0fdf4; }
      .maker-navbar .nav-link:hover:not(.active)::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #198754; }
      .maker-navbar .nav-link.active { color: #157347; background-color: #f0fdf4; font-weight: 600; border-bottom: none; border-left: none; padding-left: 1rem; }
      .maker-navbar .nav-link.active:hover { background-color: #f0fdf4; border-bottom: none; }
      .maker-navbar .nav-link.active::after { display: none; }
      .maker-navbar .notif-btn { position: relative; color: #198754; }
      .maker-navbar .notif-badge { position: absolute; top: 2px; right: 2px; min-width: 19px; height: 19px; border-radius: 50%; background: #dc3545; box-shadow: 0 0 0 2px #fff; color: #fff; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; font-weight: 700; padding: 2px; }
      .maker-navbar .profile-icon-btn { color: #198754; }
      .maker-navbar .profile-avatar { width: 35px; height: 35px; border-radius: 50%; background: #198754; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
      .maker-navbar .dropdown { position: relative; }
      .maker-navbar .dropdown-menu { position: absolute; right: 0; top: 100%; margin-top: 8px; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; min-width: 220px; z-index: 1051; }
    `}</style>
    <nav className="navbar navbar-expand-lg maker-navbar">
      <div className="container-fluid">
        <Link to="/maker-dashboard" className="navbar-brand d-flex align-items-center" onClick={(e)=>{if(onGoDashboard) onGoDashboard();}}>
          <img src="/assets/sc-logo.png" alt="SCB" width="240" height="65" style={{ objectFit: 'contain', display: 'block' }} />
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/maker-dashboard" || location.pathname === "/maker-dashboard/" ? "active" : ""}`} 
                to="/maker-dashboard"
                onClick={(e)=>{if(onGoDashboard) onGoDashboard();}}
              >
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button className="btn bg-transparent border-0 position-relative notif-btn" onClick={async () => { try { const list = await getNotifications(); const unread = (list||[]).filter(n=>!n.read); await Promise.all(unread.map(n=>markAsRead(n.id))); } catch {} setUnreadCount(0); if(onGoNotifications) onGoNotifications(); navigate('/maker-dashboard/notifications'); }} aria-label="Notifications">
            <i className="bi bi-bell fs-5"></i>
            {unreadCount > 0 && <span className="notif-badge" aria-hidden="true">{unreadCount > 0 ? unreadCount : ''}</span>}
          </button>
          <div className="dropdown" ref={dropdownRef}>
            <button className="btn btn-link profile-icon-btn p-0" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="profile-avatar">{profileInitials}</div>
            </button>
            {showDropdown && (
              <div className="dropdown-menu dropdown-menu-end show">
                <div className="px-3 py-2">
                  <strong>{profileName || "Maker User"}</strong><br/>
                  <small className="text-muted">Maker Portal</small>
                </div>
                <div className="dropdown-divider my-0"></div>
                <button className="dropdown-item text-danger" onClick={() => setLogoutModal(true)}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </div>
            )}
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
}


