import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, AlertCircle, Search, Building2, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, isDonor, isSeeker } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-container">
      {/* Top Emergency Ticker */}
      <div className="emergency-top-bar">
        <div className="container top-bar-content">
          <div className="sos-badge">
            <span className="pulse-dot"></span>
            <strong>24/7 EMERGENCY BLOOD NETWORK</strong>
          </div>
          <div className="top-helpline">
            <span>National Emergency Helpline: <strong>112</strong> / Blood Center Support: <strong>104</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="container nav-content">
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/blood-drop-logo.svg" alt="HemoConnect" className="hemo-logo-img" />
            <div className="brand-text">
              <span className="brand-title">Hemo<span className="brand-accent">Connect</span></span>
              <span className="brand-tagline">Blood Donor Matching Network</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links desktop-only">
            <Link to="/search" className={`nav-item ${isActive('/search') ? 'active' : ''}`}>
              <Search size={16} />
              <span>Find Donors</span>
            </Link>
            <Link to="/emergency-sos" className={`nav-item ${isActive('/emergency-sos') ? 'active' : ''}`}>
              <AlertCircle size={16} className="text-red" />
              <span>Emergency SOS</span>
            </Link>
            <Link to="/hospitals" className={`nav-item ${isActive('/hospitals') ? 'active' : ''}`}>
              <Building2 size={16} />
              <span>Hospitals & Banks</span>
            </Link>
          </div>

          {/* Desktop Auth & Actions */}
          <div className="nav-actions desktop-only">
            <Link to="/emergency-sos" className="btn btn-sos">
              <AlertCircle size={17} />
              <span>Post Blood Request</span>
            </Link>

            {user ? (
              <div className="user-controls">
                {isAdmin && (
                  <Link to="/admin" className="btn btn-outline-admin">
                    <ShieldAlert size={16} />
                    <span>Admin Portal</span>
                  </Link>
                )}
                {isDonor && (
                  <Link to="/donor-dashboard" className="btn btn-outline-red">
                    <span>Donor Portal</span>
                  </Link>
                )}
                {isSeeker && (
                  <Link to="/seeker-dashboard" className="btn btn-outline-red">
                    <span>Seeker Portal</span>
                  </Link>
                )}
                <div className="user-pill">
                  <User size={15} />
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="btn-icon" title="Log Out">
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu mobile-only">
            <Link to="/search" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <Search size={18} /> Find Donors
            </Link>
            <Link to="/emergency-sos" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <AlertCircle size={18} className="text-red" /> Emergency SOS
            </Link>
            <Link to="/hospitals" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <Building2 size={18} /> Hospitals & Blood Banks
            </Link>

            <div className="mobile-divider"></div>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <ShieldAlert size={18} /> Admin Portal
                  </Link>
                )}
                {isDonor && (
                  <Link to="/donor-dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    Donor Portal
                  </Link>
                )}
                {isSeeker && (
                  <Link to="/seeker-dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    Seeker Portal
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-nav-item text-red">
                  <LogOut size={18} /> Sign Out ({user.name})
                </button>
              </>
            ) : (
              <div className="mobile-auth-grid">
                <Link to="/login" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
