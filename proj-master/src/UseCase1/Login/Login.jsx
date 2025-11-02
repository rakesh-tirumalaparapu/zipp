import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScImage1 from '../Images/Sc-Image1.jpeg';
import './Login.css';
import AllPopup from '../../components/AllPopup';
import { login } from '../../api/auth';

function Login() {
  const navigate = useNavigate();

  // ====== States ======
  const [role, setRole] = useState('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ show: false, title: '', message: '' });

  // ====== Handle Form Submit ======
  const [submitting, setSubmitting] = useState(false);
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // 🔸 Basic Validation
    if (!username.trim() || !password.trim()) {
      setModal({ show: true, title: 'Login Error', message: 'Please enter both email ID and password.' });
      return;
    }
    try {
      setSubmitting(true);
      const mappedRole = role.toUpperCase();
      const resp = await login({ email: username.trim(), password, role: mappedRole });
      window.__authToken = resp.token;
      window.__authUser = { id: resp.userId, name: resp.name, email: resp.email, role: mappedRole };
      try {
        sessionStorage.setItem('auth_token', resp.token);
        sessionStorage.setItem('auth_user', JSON.stringify(window.__authUser));
      } catch {}

      switch (role) {
        case 'customer':
          navigate('/customer-dashboard');
          break;
        case 'maker':
          navigate('/maker-dashboard');
          break;
        case 'checker':
          navigate('/checker-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setModal({ show: true, title: 'Login failed', message: err.message || 'Unable to login. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // ====== Navigation Buttons ======
  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // ====== JSX Layout ======
  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        
        {/* ===== FORM SECTION ===== */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to access your Standard Chartered account</p>
            <button className="back-btn" onClick={handleBackToHome}>
              ← Back to Home
            </button>
          </div>

          {/* ===== LOGIN FORM ===== */}
          <form onSubmit={handleFormSubmit} className="auth-form">
            
            {/* Role Dropdown */}
            <div className="form-group">
              <label htmlFor="role">Login As</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="customer">Customer</option>
                <option value="maker">Maker</option>
                <option value="checker">Checker</option>
              </select>
            </div>

            {/* Email ID */}
            <div className="form-group">
              <label htmlFor="username">Email ID</label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email ID"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <span className="forgot-password" onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={submitting}>
              <span className="lock-icon">🔒</span> LOGIN
            </button>
          </form>

          {/* ===== Footer Section ===== */}
          <div className="form-footer">
            <p>
              Don’t have an account?{' '}
              <span className="switch-form" onClick={handleSignupClick}>
                Sign Up
              </span>
            </p>
          </div>
        </div>

        {/* ===== IMAGE SECTION ===== */}
        <div className="auth-image-section">
          <img
            src={ScImage1}
            alt="Standard Chartered Banking"
            className="auth-image"
          />
        </div>
      </div>
      <AllPopup
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
}

export default Login;
