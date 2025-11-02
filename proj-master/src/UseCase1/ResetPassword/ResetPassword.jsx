import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScImage2 from '../Images/Signup_image.jpg';
import '../SignUp/SignUp.css';
import AllPopup from '../../components/AllPopup';
import { resetPassword } from '../../api/auth';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setModal({ show: true, title: 'Missing fields', message: 'Please fill all fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setModal({ show: true, title: 'Password mismatch', message: 'New password and confirm password do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setModal({ show: true, title: 'Weak password', message: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await resetPassword({ email, newPassword, confirmPassword });
      setModal({ 
        show: true, 
        title: 'Password reset successful', 
        message: res.message || 'Your password has been reset successfully. Please login with your new password.',
        isSuccess: true
      });
    } catch (err) {
      setModal({ show: true, title: 'Reset failed', message: err.message || 'Failed to reset password. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
    <div className="auth-page signup-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password</p>
            <button className="back-btn" onClick={handleBackToHome}>← Back to Home</button>
          </div>
          <form onSubmit={handleFormSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your registered email address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!location.state?.email}
                style={location.state?.email ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  placeholder="Enter your new password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  placeholder="Confirm your new password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>
            
            <button type="submit" className="submit-btn signup-submit-btn" disabled={submitting}>
              {submitting ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Remember your password? <span className="switch-form" onClick={handleBackToLogin}>Login</span></p>
          </div>
        </div>
        <div className="auth-image-section">
          <img src={ScImage2} alt="Standard Chartered Reset Password" className="auth-image" />
        </div>
      </div>
    </div>
    <AllPopup
      show={modal.show}
      title={modal.title}
      message={modal.message}
      onClose={() => setModal({ ...modal, show: false })}
      onConfirm={() => {
        setModal({ ...modal, show: false });
        // Navigate to login page after successful password reset
        if (modal.isSuccess) {
          navigate('/login');
        }
      }}
    />
    </>
  );
}

export default ResetPasswordPage;



