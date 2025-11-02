import React, { useEffect, useRef, useState } from "react";
import AllPopup from "../components/AllPopup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCheckerProfile } from "../api/apiChecker";
import { getUnreadCount, getNotifications, markAsRead } from '../api/notifications';
import "./CheckerNavbar.css";

export default function CheckerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileInitials, setProfileInitials] = useState('JC');
  const [unreadCount, setUnreadCount] = useState(0);

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
      getCheckerProfile()
        .then((data) => {
          const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
          setProfileName(fullName);
          // Generate initials: first letter of first name, first letter of last name
          const firstName = data.firstName || '';
          const lastName = data.lastName || '';
          let initials = '';
          if (firstName) initials += firstName.charAt(0).toUpperCase();
          if (lastName) initials += lastName.charAt(0).toUpperCase();
          if (!initials) initials = 'JC'; // Fallback to JC if no name
          setProfileInitials(initials);
        })
        .catch(() => {
          setProfileName("Checker User");
          setProfileInitials('JC');
        });
    }
  }, [showDropdown, profileName]);

  const handleLogout = () => setLogoutModal(true);
  const confirmLogout = () => {
    try {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
    } catch {}
    setLogoutModal(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
    <style>{`
      /* Standardized navbar look (align with UC2) */
      .navbar-sc { background: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-bottom: 1px solid #eaeaea; position: sticky; top: 0; z-index: 1050; padding-top: 10px; padding-bottom: 10px; height: 70px; }
      .navbar-sc .container-fluid { padding-left: 24px; padding-right: 16px; }
      .navbar-sc .navbar-brand { text-decoration: none; padding: 0; margin: 0; margin-right: 20px; }
      .navbar-sc .sc-logo { object-fit: contain; display: block; }
      .navbar-sc .nav-link { color: #0d6efd; }
      .navbar-sc .nav-link.active, .navbar-sc .nav-link:hover { color: #0b5ed7; }
      /* Notifications bell */
      .navbar-sc .notif-btn { position: relative; color: #0d6efd; transition: transform .2s ease, color .2s ease; }
      .navbar-sc .notif-btn .bell { display: inline-block; transition: transform .2s ease; }
      .navbar-sc .notif-btn:hover { color: #0b5ed7; transform: translateY(-1px); }
      .navbar-sc .notif-btn:hover .bell { transform: scale(1.08); }
      .navbar-sc .notif-badge { position: absolute; top: 2px; right: 2px; min-width: 19px; height: 19px; border-radius: 50%; background: #dc3545; box-shadow: 0 0 0 2px #fff; color: #fff; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; font-weight: 700; padding: 2px; }
      .navbar-sc .notif-badge::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: 0 0 0 0 rgba(220,53,69,.5); animation: sc-pulse 1.8s infinite; }
      @keyframes sc-pulse { 0% { box-shadow: 0 0 0 0 rgba(220,53,69,.5);} 70% { box-shadow: 0 0 0 6px rgba(220,53,69,0);} 100% { box-shadow: 0 0 0 0 rgba(220,53,69,0);} }
      /* Profile dropdown menu */
      .navbar-sc .profile-dropdown { border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; margin-top: 8px; min-width: 240px; z-index: 1050; right: 0 !important; left: auto !important; transform: none !important; }
      .navbar-sc .profile-icon-btn { color: #0d6efd; }
      .navbar-sc .profile-icon-btn:hover { color: #0b5ed7; }
    `}</style>
    <nav className="navbar navbar-expand-lg navbar-light navbar-sc">
      <div className="container-fluid">
        <Link to="/checker-dashboard/dashboard" className="navbar-brand d-flex align-items-center">
          <img
            src="/assets/sc-logo.png"
            alt="SCB"
            width="240"
            height="65"
            style={{ objectFit: 'contain', display: 'block' }}
            className="sc-logo"
            onError={(e) => {
              e.currentTarget.src = "https://www.sc.com/wp-content/themes/standard-chartered/images/standard-chartered-logo.svg";
            }}
          />
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
                className={`nav-link ${location.pathname.includes("/checker-dashboard/dashboard") ? "active" : ""}`} 
                to="/checker-dashboard/dashboard"
              >
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </Link>
            </li>
          </ul>

          <div className="navbar-actions d-flex align-items-center gap-3">
            <Link 
              className={`nav-link position-relative notif-btn ${location.pathname.includes("/checker-dashboard/notifications") ? "active" : ""}`} 
              to="#"
              title="Notifications"
              onClick={async e => {e.preventDefault(); try { const list = await getNotifications(); const unread = (list||[]).filter(n=>!n.read); await Promise.all(unread.map(n=>markAsRead(n.id))); } catch {} setUnreadCount(0); navigate('/checker-dashboard/notifications');}}
            >
              <i className="bi bi-bell fs-5 bell"></i>
              {unreadCount > 0 && <span className="notif-badge" aria-hidden="true">{unreadCount > 0 ? unreadCount : ''}</span>}
            </Link>

            <div className="profile-menu" ref={dropdownRef}>
              <button 
                className="btn btn-link profile-icon-btn" 
                type="button" 
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
              >
                <div className="profile-avatar">{profileInitials}</div>
              </button>
              {showDropdown && (
                <>
                  <div className="dropdown-menu dropdown-menu-end show profile-dropdown position-absolute">
                    <div className="profile-header">
                      <div className="profile-info">
                        <div className="profile-name">{profileName || "Checker User"}</div>
                        <div className="profile-role">Checker Portal</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-btn"
                      type="button"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </div>
                  <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}></div>
                </>
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
}