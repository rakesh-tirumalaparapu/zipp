import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScImage2 from '../Images/Signup_image.jpg';
import '../SignUp/SignUp.css';
import AllPopup from '../../components/AllPopup';
import { signup } from '../../api/auth';

function SignupPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  const [submitting, setSubmitting] = useState(false);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName')?.value?.trim();
    const middleName = document.getElementById('middleName')?.value?.trim();
    const lastName = document.getElementById('lastName')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const phoneNumber = document.getElementById('phone')?.value?.trim();
    const password = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const favoriteCity = document.getElementById('favoriteCity')?.value?.trim();
    const favoriteFood = document.getElementById('favoriteFood')?.value?.trim();
    const favoriteColor = document.getElementById('favoriteColor')?.value?.trim();

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setModal({ show: true, title: 'Missing fields', message: 'Please fill all required fields.' });
      return;
    }
    if (password !== confirmPassword) {
      setModal({ show: true, title: 'Password mismatch', message: 'Passwords do not match.' });
      return;
    }
    if (!favoriteCity || !favoriteFood || !favoriteColor) {
      setModal({ show: true, title: 'Security questions required', message: 'Please answer all security questions for password recovery.' });
      return;
    }

    try {
      setSubmitting(true);
      // Clear any existing auth token before signup to avoid conflicts
      sessionStorage.removeItem('auth_token');
      window.__authToken = null;
      
      const res = await signup({ firstName, middleName, lastName, email, phoneNumber, password, favoriteCity, favoriteFood, favoriteColor });
      setModal({ 
        show: true, 
        title: 'Signup successful', 
        message: res.message || 'Account created. Please login.',
        isSuccess: true // Flag to indicate successful signup
      });
    } catch (err) {
      setModal({ show: true, title: 'Signup failed', message: err.message || 'Unable to sign up. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginClick = () => {
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
            <h1>Create Your Account</h1>
            <p>Join Standard Chartered Bank today</p>
            <button className="back-btn" onClick={handleBackToHome}>← Back to Home</button>
          </div>
          <form onSubmit={handleFormSubmit} className="auth-form">
            <div className="form-row form-row-3">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder="Enter your first name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input 
                  type="text" 
                  id="middleName" 
                  placeholder="Enter your middle name" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  placeholder="Enter your last name" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email address" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input 
                type="tel" 
                id="phone" 
                placeholder="Enter your phone number" 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Create Password *</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  placeholder="Create a strong password" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  placeholder="Confirm your password" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Security Questions (for password recovery) *</label>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>Please answer these questions. You'll need them to reset your password if you forget it.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteCity">What is your favorite city? *</label>
              <input 
                type="text" 
                id="favoriteCity" 
                placeholder="Enter your favorite city" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteFood">What is your favorite food? *</label>
              <input 
                type="text" 
                id="favoriteFood" 
                placeholder="Enter your favorite food" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="favoriteColor">What is your favorite color? *</label>
              <input 
                type="text" 
                id="favoriteColor" 
                placeholder="Enter your favorite color" 
                required 
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required />
                I agree to the Terms & Conditions and Privacy Policy
              </label>
            </div>
            
            <button type="submit" className="submit-btn signup-submit-btn" disabled={submitting}>
              CREATE ACCOUNT
            </button>
          </form>
          
          <div className="form-footer">
            <p>Already have an account? <span className="switch-form" onClick={handleLoginClick}>Login</span></p>
          </div>
        </div>
        <div className="auth-image-section">
          <img src={ScImage2} alt="Standard Chartered Signup" className="auth-image" />
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
        // Redirect to login page after successful signup when OK is clicked
        if (modal.isSuccess && modal.title === 'Signup successful') {
          navigate('/login');
        }
      }}
    />
    </>
  );
}

export default SignupPage;