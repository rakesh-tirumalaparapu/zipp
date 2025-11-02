import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../api/notifications";
import "./CheckerNotifications.css";

export default function CheckerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications();
        setNotifications(data || []);
      } catch {
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(n => n.map(o => o.id === id ? { ...o, read: true } : o));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type) => {
    const icons = {
      maker_comment: "bi-chat-dots",
      loan_approved: "bi-check-circle",
      loan_rejected: "bi-x-circle"
    };
    return icons[type] || "bi-info-circle";
  };
  const getTypeColor = (type) => {
    const colors = {
      maker_comment: "text-primary",
      loan_approved: "text-success",
      loan_rejected: "text-danger"
    };
    return colors[type] || "text-muted";
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div>
      
      <div className="page-hero d-flex align-items-center justify-content-center mb-4">
        <div className="text-center text-white">
          <h4 className="mb-1">Notifications</h4>
          <p className="sub mb-0">Maker comments and loan decisions</p>
        </div>
      </div>

      <div className="section-card">
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className={"notification-item " + (!notification.read ? "notif-unread" : "") }>
              <div className="d-flex align-items-start">
                <div className="notification-icon me-3">
                  <i className={`bi ${getTypeIcon(notification.type)} ${getTypeColor(notification.type)}`}></i>
                  {!notification.read && <span className="notif-badge ms-2" title="Unread"></span>}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0 fw-semibold">{notification.title || 'Notification'}</h6>
                  </div>
                  <p className="text-muted mb-2">{notification.message}</p>
                  <small className="text-muted">
                    {notification.timestamp && (typeof notification.timestamp === 'string' ? new Date(notification.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date(notification.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }))}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-4">
            <i className="bi bi-bell-slash display-4 text-muted"></i>
            <p className="text-muted mt-2">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}