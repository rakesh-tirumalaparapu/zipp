import React from 'react';

export default function MakerNotifications({ notifications = [], onMarkRead, onMarkAll }) {
  const hasUnread = (notifications || []).some(n => !n.read);

  return (
    <div className="container-fluid" style={{ padding: '20px' }}>
      <style>{`
        .notif-hero { background: linear-gradient(135deg, #198754 0%, #28a745 100%); color: #fff; border-radius: 12px; padding: 32px 20px; margin-bottom: 20px; }
        .section-card { background:#fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 20px; }
        .notif-item { border-bottom: 1px solid #f0f0f0; padding: 12px 0; }
        .notif-item:last-child { border-bottom: none; }
        .notif-badge { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; background:rgb(24, 76, 153); }
        .notif-unread .title { font-weight: 600; }
        .small-muted { font-size: 12px; color: #888; }
      `}</style>

      <div className="notif-hero text-center">
        <h5 className="mb-1">Notifications</h5>
        <div className="small">Updates about applications and actions</div>
      </div>

      <div className="section-card">
        {notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-bell-slash display-6"></i>
            <div className="mt-2">No notifications</div>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <div key={n.id} className={`notif-item ${n.read ? '' : 'notif-unread'}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    {!n.read && <span className="notif-badge" aria-hidden="true"></span>}
                    <span className="title">{n.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


