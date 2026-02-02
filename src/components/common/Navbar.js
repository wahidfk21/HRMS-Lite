/**
 * Navigation Bar Component
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">HR</div>
          <span className="brand-text">HRMS Lite</span>
        </Link>

        <div className="navbar-menu">
          <Link
            to="/employees"
            className={`nav-link ${isActive('/employees') ? 'nav-link-active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <span>Employees</span>
          </Link>
          <Link
            to="/attendance"
            className={`nav-link ${isActive('/attendance') ? 'nav-link-active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            <span>Attendance</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
