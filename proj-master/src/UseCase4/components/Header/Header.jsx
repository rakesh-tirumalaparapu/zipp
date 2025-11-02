// components/Header/Header.js
import React from 'react';

import './Header.css';

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  userMenuOpen,
  setUserMenuOpen,
  notificationOpen,
  setNotificationOpen,
  unreadNotificationsCount,
  notifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  handleLogout
}) => {
  return (
    <header className="header">
      <div className="container-fluid d-flex align-items-center justify-content-between">
      <div className="header-left">
        <button 
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <div className="logo-container">
          <img 
            src="/assets/sc-logo.png" 
            alt="Standard Chartered" 
            className="header-logo"
          />
        </div>
      </div>
      <div className="user-info">
        <div className="notification-menu">
          <button 
            className="notification-btn notif-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
            aria-label="Notifications"
            title="Notifications"
          >
            <i className="bi bi-bell fs-5 bell"></i>
            {unreadNotificationsCount > 0 ? (
              <span className="notif-badge" aria-label={`${unreadNotificationsCount} unread`}></span>
            ) : null}
          </button>
          {notificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                {unreadNotificationsCount > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length === 0 && (
                <div className="no-notifications">
                  No notifications
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="user-menu">
          <button 
            className="user-btn circular-profile"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="profile-circle">
              <span className="profile-initials">M</span>
            </div>
          </button>
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="user-profile">
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <strong>Maker User</strong>
                  <span>maker@bank.com</span>
                </div>
              </div>
              <div className="user-actions">
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;