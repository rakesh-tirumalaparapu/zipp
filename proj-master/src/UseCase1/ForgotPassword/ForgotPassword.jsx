import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScImage2 from '../Images/Signup_image.jpg';
import '../SignUp/SignUp.css';
import AllPopup from '../../components/AllPopup';
import { verifySecurityQuestions } from '../../api/auth';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [favoriteCity, setFavoriteCity] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email || !favoriteCity || !favoriteFood || !favoriteColor) {
      setModal({ show: true, title: 'Missing fields', message: 'Please fill all fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await verifySecurityQuestions({ email, favoriteCity, favoriteFood, favoriteColor });
      setModal({ 
        show: true, 
        title: 'Verification successful', 
        message: 'Security questions verified. You can now reset your password.',
        isSuccess: true,
        email: email // Pass email to modal for next step
      });
    } catch (err) {
      setModal({ show: true, title: 'Verification failed', message: err.message || 'Security questions verification failed. Please check your answers.' });
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
            <h1>Forgot Password</h1>
            <p>Answer your security questions to reset your password</p>
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
              />
            </div>
            
            <div className="form-group" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Security Questions *</label>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>Answer the security questions you set during signup.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteCity">What is your favorite city? *</label>
              <input 
                type="text" 
                id="favoriteCity" 
                placeholder="Enter your favorite city" 
                required 
                value={favoriteCity}
                onChange={(e) => setFavoriteCity(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteFood">What is your favorite food? *</label>
              <input 
                type="text" 
                id="favoriteFood" 
                placeholder="Enter your favorite food" 
                required 
                value={favoriteFood}
                onChange={(e) => setFavoriteFood(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteColor">What is your favorite color? *</label>
              <input 
                type="text" 
                id="favoriteColor" 
                placeholder="Enter your favorite color" 
                required 
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
              />
            </div>
            
            <button type="submit" className="submit-btn signup-submit-btn" disabled={submitting}>
              {submitting ? 'VERIFYING...' : 'VERIFY & CONTINUE'}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Remember your password? <span className="switch-form" onClick={handleBackToLogin}>Login</span></p>
          </div>
        </div>
        <div className="auth-image-section">
          <img src={ScImage2} alt="Standard Chartered Forgot Password" className="auth-image" />
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
        // Navigate to reset password page after successful verification
        if (modal.isSuccess && modal.email) {
          navigate('/reset-password', { state: { email: modal.email } });
        }
      }}
    />
    </>
  );
}

export default ForgotPasswordPage;



