import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../Navbar/Navbar.css";
import StanLogo from "../Images/STAN.L.png"; // ✅ Import your local logo

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container-fluid">
        {/* ===== Logo Section ===== */}
        <Link className="navbar-brand d-flex align-items-center p-0" to="/">
          <img
            src={StanLogo}
            alt="Standard Chartered"
            width="200"
            height="55"
            style={{ objectFit: 'contain', display: 'block' }}
            className="me-2 logo-img"
          />
          <span className="fw-bold text-primary bank-name"></span>
        </Link>

        {/* ===== Mobile Toggle Button ===== */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ===== Navbar Links ===== */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
              <NavLink exact="true" to="/" className="nav-link">
                HOME
              </NavLink>
            </li>

            <li className="nav-item mx-2">
              <NavLink to="/about" className="nav-link">
                ABOUT US
              </NavLink>
            </li>

            <li className="nav-item mx-2">
              <NavLink to="/login" className="btn login-btn">
                🔒 LOGIN
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

