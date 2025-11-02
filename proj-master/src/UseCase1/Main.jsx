// src/UseCase1/Main.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import HomePage from './HomePage/HomePage';
import AboutUs from './AboutUs/AboutUs';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword';
import EligibilityChecker from './EligibilityChecker/EligibilityChecker';
import Footer from './Footer/Footer';
import ScrollToTop from './ScrollToTop';
import './Main.css';

function Main() {
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/eligibility-checker" element={<EligibilityChecker />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default Main;
