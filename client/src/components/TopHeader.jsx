import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TopHeader = ({ onToggleSidebar, pageTitle }) => {
  const { user, logout, isDonor, isSeeker, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine page title dynamically if not passed
  const getComputedTitle = () => {
    if (pageTitle) return pageTitle;
    const path = location.pathname;
    if (path === '/') return 'HemoConnect Home';
    if (path === '/donor-dashboard') return 'Donor Home Dashboard';
    if (path === '/seeker-dashboard') return 'Seeker Home Dashboard';
    if (path === '/search') return 'Find Compatible Blood Donors';
    if (path === '/emergency-sos') return 'Emergency SOS Requisitions';
    if (path === '/hospitals') return 'Hospitals & Regional Blood Banks';
    if (path === '/login') return 'Account Sign In';
    if (path === '/register') return 'New User Registration';
    if (path === '/admin') return 'Administrative Operations Portal';
    return 'HemoConnect Platform';
  };

  return (
    <header className="scholarfind-top-header">
      <div className="header-left">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="header-menu-toggle"
          aria-label="Toggle navigation menu"
          title="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="header-brand-link" title="HemoConnect Home">
          <img
            src="/blood-drop-logo.svg"
            alt="HemoConnect Blood Drop"
            className="hemo-logo-img"
          />
          <span className="header-brand-title">HemoConnect</span>
        </Link>
        <div className="header-divider"></div>
        <h1 className="header-page-title">{getComputedTitle()}</h1>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <div className="header-icon-btn" title="Emergency notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </div>

        {user ? (
          <div className="header-user-section">
            <div className="header-user-badge">
              <div className="user-avatar-circle">
                <User size={15} />
              </div>
              <div className="user-details-mini">
                <span className="user-display-name">{user.name?.split(' ')[0]}</span>
                <span className="user-role-label">
                  {isAdmin ? 'Admin' : isDonor ? 'Donor' : 'Seeker'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-header-logout"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="desktop-text">Logout</span>
            </button>
          </div>
        ) : (
          <div className="header-auth-actions">
            <Link to="/login" className="btn-header-login">
              <LogIn size={15} />
              <span>Log In</span>
            </Link>
            <Link to="/register" className="btn-header-register">
              <UserPlus size={15} />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
