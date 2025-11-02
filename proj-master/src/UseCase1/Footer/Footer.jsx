import React from 'react';
import { useNavigate } from 'react-router-dom';
import STANL from '../Images/STAN.L.png';
import '../Footer/Footer.css';

function Footer() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src={STANL} 
                alt="Standard Chartered Bank" 
                className="footer-logo-image"
              />
            </div>
            <p>Leading international banking group committed to building a sustainable business over the long-term.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>Home</a></li>
              <li><a href="#personal-loan">Personal Loan</a></li>
              <li><a href="#home-loan">Home Loan</a></li>
              <li><a href="#credit-cards">Credit Cards</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-section footer-contact">
            <h4>Contact Info</h4>
            <p>📞 1800 102 7722</p>
            <p>✉️ service@sc.com</p>
            <p>🕒 Mon-Sat: 9:30 AM - 6:00 PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Standard Chartered Bank. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;