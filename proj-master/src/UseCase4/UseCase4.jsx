// App.js
import React, { useState, useEffect } from 'react';
import AllPopup from '../components/AllPopup';
import { useNavigate } from 'react-router-dom';

import MakerNavbar from './MakerNavbar';
import Dashboard from './components/Dashboard/Dashboard';
import CommentsSection from './components/ApplicationReview/CommentsSection/CommentsSection';
import MakerReview from './MakerReview';
import MakerNotifications from './MakerNotifications';
// Removed static mock data; will integrate with backend APIs
import { listMakerApplications, getMakerApplicationById, reviewMakerApplication } from '../api/apiMaker';
import { listDocumentIdsByApplication, getDocument } from '../api/documents';
import { getNotifications, markAsRead, getUnreadCount } from '../api/notifications';

const UseCase4 = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard | review | notifications
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [logoutModal, setLogoutModal] = useState(false);
  const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const notifs = await getNotifications();
      setNotifications(notifs || []);
    } catch (e) {
      setNotifications([]);
    }
  };
  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadNotificationsCount(typeof count === 'number' ? count : 0);
    } catch {
      setUnreadNotificationsCount(0);
    }
  };
  useEffect(() => { fetchNotifications(); fetchUnreadCount(); }, []);

  // Fetch applications
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listMakerApplications();
        if (!mounted) return;
        const mapped = (data || []).map((a) => ({
          applicationId: a.applicationId, // string code
          customerName: a.customerName || a.name,
          loanType: a.loanType,
          loanAmount: a.loanAmount,
          status: a.status,
          submittedDate: a.submittedDate,
        }));
        setApplications(mapped);
      } catch (e) {
        setApplications([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, title: '', message: '' });

  // Approve application
  const handleApprove = () => {
    if (!selectedApplication || !reviewComments.trim()) {
      setInfoModal({ show: true, title: 'Approve Application', message: 'Please add review comments before approving.' });
      return;
    }
    setConfirmModal({
      show: true,
      action: 'approve',
      title: 'Confirm Approval',
      message: 'Are you sure you want to approve this application and send it to checker?'
    });
  };

  // Reject application
  const handleReject = () => {
    if (!selectedApplication || !reviewComments.trim()) {
      setInfoModal({ show: true, title: 'Reject Application', message: 'Please add review comments before rejecting.' });
      return;
    }
    setConfirmModal({
      show: true,
      action: 'reject',
      title: 'Confirm Rejection',
      message: 'Are you sure you want to reject this application?'
    });
  };

  // Execute approve/reject after confirmation
  const executeAction = async () => {
    const { action } = confirmModal;
    setConfirmModal({ show: false, action: null, title: '', message: '' });
    
    try {
      if (action === 'approve') {
        await reviewMakerApplication(selectedApplication.applicationId, 'approve', reviewComments.trim());
        const updated = applications.map(app =>
          app.applicationId === selectedApplication.applicationId ? { ...app, status: 'With Checker' } : app
        );
        setApplications(updated);
      } else if (action === 'reject') {
        await reviewMakerApplication(selectedApplication.applicationId, 'reject', reviewComments.trim());
        const updated = applications.map(app =>
          app.applicationId === selectedApplication.applicationId ? { ...app, status: 'Rejected' } : app
        );
        setApplications(updated);
      }
      setSelectedApplication(null);
      setReviewComments('');
      setActiveTab('personal');
      setCurrentPage('dashboard');
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (e) {
      setInfoModal({ show: true, title: `${action === 'approve' ? 'Approve' : 'Reject'} Failed`, message: e.message || `Unable to ${action} application` });
    }
  };

  // Notifications
  const markNotificationAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    await fetchNotifications();
    await fetchUnreadCount();
  };
  const markAllNotificationsAsRead = async () => {
    const unread = (notifications || []).filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
    await fetchNotifications();
    await fetchUnreadCount();
  };

  const handleLogout = () => setLogoutModal(true);
  const confirmLogout = () => { navigate('/login'); };

  // Filtered applications (normalize statuses)
  const normalizeStatus = (s) => {
    const x = String(s || '').toLowerCase();
    if (x.includes('reading')) return 'Pending';
    if (x.includes('checker')) return 'With Checker';
    if (x.includes('approved')) return 'Approved';
    if (x.includes('rejected')) return 'Rejected';
    if (x === 'pending') return 'Pending';
    return 'Pending';
  };

  // ------ in filter/search logic use application.applicationId ---
  const filteredApplications =
    applicationFilter === 'all'
      ? applications
      : applications.filter(app => normalizeStatus(app.status) === applicationFilter);

  // Handle "Review" click from Dashboard
  const handleReviewClick = async (application) => {
    try {
      const appId = application.applicationId;
      const [details, docIds] = await Promise.all([
        getMakerApplicationById(appId),
        listDocumentIdsByApplication(appId),
      ]);
      // Group docs by sections
      const byType = (docIds || []).reduce((acc, d) => {
        (acc[d.documentType] = acc[d.documentType] || []).push({ id: d.id, documentType: d.documentType });
        return acc;
      }, {});
      const personal = ['PHOTOGRAPH','IDENTITY_PROOF','ADDRESS_PROOF'].flatMap(t => byType[t] || []);
      const employment = ['SALARY_SLIPS','ITR_SALARIED','BANK_STATEMENTS_SALARIED','EMPLOYMENT_PROOF','BUSINESS_PROOF_GST','ITR_SELF_EMPLOYED','BANK_STATEMENTS_SELF_EMPLOYED'].flatMap(t => byType[t] || []);
      const loan = ['SALE_AGREEMENT','EC_CERTIFICATE','INVOICE_FROM_DEALER','QUOTATION','INCOME_PROOF'].flatMap(t => byType[t] || []);
      const existing = ['CIBIL_REPORT'].flatMap(t => byType[t] || []);
      const enriched = {
        ...details,
        personalDocuments: personal,
        employmentDocuments: employment,
        loanDocuments: loan,
        existingDocuments: existing,
      };
      setSelectedApplication(enriched);
      setCurrentPage('review');
      setActiveTab('personal');
    } catch (e) {
      setInfoModal({ show: true, title: 'Load Failed', message: e.message || 'Unable to load application details' });
    }
  };

  // listen for path changes
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path.includes('/maker-dashboard/notifications')) {
        setCurrentPage('notifications');
      } else if (path.includes('/maker-dashboard')) {
        setCurrentPage('dashboard');
      }
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  return (
    <>
    <div className="app">
      <MakerNavbar
        unreadCount={unreadNotificationsCount}
        onLogout={confirmLogout}
        onGoDashboard={() => { setApplicationFilter('all'); setCurrentPage('dashboard'); }}
        onGoNotifications={() => setCurrentPage('notifications')}
      />
      <div className="container-fluid px-4">
        <div className="main-content">
          {currentPage === 'dashboard' && (
            <Dashboard
              applications={applications}
              visibleApplications={filteredApplications}
              applicationFilter={applicationFilter}
              setApplicationFilter={setApplicationFilter}
              setSelectedApplication={handleReviewClick} // passes application to review
              setCurrentPage={setCurrentPage}
              setActiveTab={setActiveTab}
            />
          )}
          {currentPage === 'review' && selectedApplication && (
            <>
              <MakerReview
                applicationId={selectedApplication.applicationId}
                onBack={() => setCurrentPage('dashboard')}
              />
              {selectedApplication.status === 'WITH_MAKER' && (
                <CommentsSection
                  reviewComments={reviewComments}
                  setReviewComments={setReviewComments}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                />
              )}
            </>
          )}
          {currentPage === 'notifications' && (
            <MakerNotifications
              notifications={notifications}
              onMarkRead={markNotificationAsRead}
              onMarkAll={markAllNotificationsAsRead}
            />
          )}
          {currentPage === 'review' && !selectedApplication && (
            <div className="no-application">
              <h3>Select an application to review</h3>
              <p>Choose an application from the dashboard to view details and take action</p>
              <button
                className="back-btn"
                onClick={() => setCurrentPage('dashboard')}
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Modals */}
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
    <AllPopup
      show={infoModal.show}
      title={infoModal.title}
      message={infoModal.message}
      onClose={() => setInfoModal({ ...infoModal, show: false })}
    />
    <AllPopup
      show={confirmModal.show}
      title={confirmModal.title}
      message={confirmModal.message}
      onClose={() => setConfirmModal({ show: false, action: null, title: '', message: '' })}
      onConfirm={executeAction}
      confirmText="Confirm"
      cancelText="Cancel"
      confirmVariant={confirmModal.action === 'reject' ? 'danger' : 'primary'}
    />
    </>
  );
};

export default UseCase4;
