// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ===== Main Website (UseCase1) =====
import Main from './UseCase1/Main';

// ===== Maker Dashboard (UseCase4) =====
import UseCase4App from './UseCase4/UseCase4';

// ===== Checker Dashboard (UseCase5) =====
import Checker from './UseCase5/Checker';

// ===== Customer Dashboard (UseCase2) =====
import Customer from './UseCase2/Customer';

// ===== Global Styles =====
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Main website (home, about, login, signup, etc.) ===== */}
        <Route path="/*" element={<Main />} />

        {/* ===== Maker dashboard ===== */}
        <Route path="/maker-dashboard/*" element={<UseCase4App />} />

        {/* ===== Checker dashboard ===== */}
        <Route path="/checker-dashboard/*" element={<Checker />} />

        {/* ✅ FIXED: Added leading slash here */}
        <Route path="/customer-dashboard/*" element={<Customer />} />
      </Routes>
    </Router>
  );
}

export default App;
