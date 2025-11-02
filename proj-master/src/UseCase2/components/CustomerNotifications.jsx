import React, { useEffect, useState } from "react";
import { getNotifications, markAsRead } from '../../api/notifications';
import "./CustomerNotifications.css";

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      for (const n of notifications.filter(n => !n.read)) {
        await markAsRead(n.id);
      }
      await fetchNotifications();
    } catch {}
  };

  const handleMarkRead = async (notifId) => {
    try {
      await markAsRead(notifId);
      await fetchNotifications();
    } catch {}
  };

  const getTypeIcon = (type) => {
    const icons = {
      status_update: "bi-arrow-repeat",
      request_docs: "bi-file-earmark-text",
      decision: "bi-check2-circle",
    };
    return icons[type] || "bi-info-circle";
  };
  const getTypeColor = (type) => {
    const colors = {
      status_update: "text-primary",
      request_docs: "text-warning",
      decision: "text-success",
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
    <div className="notif-container">
      <div className="notifications-page-hero d-flex align-items-center justify-content-center mb-4">
        <div className="text-center text-white">
          <h4 className="mb-1">Notifications</h4>
          <p className="sub mb-0">Status updates, document requests and decisions</p>
        </div>
      </div>
      <div className="section-card">
        <div className="notifications-list">
          {error && <div className="alert alert-danger">{error}</div>}
          {notifications.map((n) => (
            <div key={n.id} className={`notification-item${!n.read ? ' unread' : ''}`}>
              <div className="d-flex align-items-start">
                <div className="notification-icon me-3">
                  <i className={`bi ${getTypeIcon(n.type)} ${getTypeColor(n.type)}`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0 fw-semibold">{n.title || n.type || 'Notification'} {!n.read && <span className="notif-dot" aria-label="Unread"></span>}</h6>
                  </div>
                  <p className="text-muted mb-2">{n.message}</p>
                  <small className="text-muted">
                    {n.timestamp ? new Date(n.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
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
