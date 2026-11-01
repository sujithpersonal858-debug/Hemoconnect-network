import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  AlertCircle,
  Clock,
  History,
  User,
  Users,
  LogOut,
  Building2,
  PlusCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Shield,
  KeyRound,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed, onToggleCollapse, activeTab, onTabChange }) => {
  const { user, logout, isDonor, isSeeker, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (path, tabKey) => {
    if (tabKey && onTabChange) {
      onTabChange(tabKey);
    }
    if (path && location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <aside className={`scholarfind-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Sidebar Header with Blood Drop Logo, HemoConnect Text, and Minimize/Expand Button */}
      <div className="sidebar-top-bar">
        {!isCollapsed ? (
          <Link to="/" className="sidebar-brand-text">
            <img
              src="/blood-drop-logo.svg"
              alt="HemoConnect Blood Drop"
              className="hemo-logo-img"
            />
            <span className="brand-plain">HemoConnect</span>
          </Link>
        ) : (
          <Link to="/" className="sidebar-brand-collapsed" title="HemoConnect">
            <img
              src="/blood-drop-logo.svg"
              alt="HemoConnect Blood Drop"
              className="hemo-logo-img-collapsed"
            />
          </Link>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="sidebar-toggle-btn"
          title={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Label */}
      {!isCollapsed && (
        <div className="sidebar-section-label">
          <span>NAVIGATION</span>
        </div>
      )}

      {/* Vertical Navigation Options */}
      <nav className="sidebar-nav-list">
        {/* DONOR NAVIGATION */}
        {user && isDonor && (
          <>
            <button
              type="button"
              onClick={() => handleNavClick('/donor-dashboard', 'dashboard')}
              className={`sidebar-nav-btn ${location.pathname === '/donor-dashboard' && (!activeTab || activeTab === 'dashboard') ? 'active' : ''}`}
              title="Dashboard"
            >
              <LayoutDashboard size={20} className="nav-icon" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/donor-dashboard', 'requests')}
              className={`sidebar-nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
              title="Find Blood Requests"
            >
              <Search size={20} className="nav-icon" />
              {!isCollapsed && <span>Find Blood Requests</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/donor-dashboard', 'sos')}
              className={`sidebar-nav-btn ${activeTab === 'sos' ? 'active' : ''}`}
              title="Emergency SOS Requests"
            >
              <AlertCircle size={20} className="nav-icon text-red-accent" />
              {!isCollapsed && <span>Emergency SOS Requests</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/donor-dashboard', 'availability')}
              className={`sidebar-nav-btn ${activeTab === 'availability' ? 'active' : ''}`}
              title="My Availability"
            >
              <Clock size={20} className="nav-icon" />
              {!isCollapsed && <span>My Availability</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/donor-dashboard', 'history')}
              className={`sidebar-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              title="Donation History"
            >
              <History size={20} className="nav-icon" />
              {!isCollapsed && <span>Donation History</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/donor-dashboard', 'profile')}
              className={`sidebar-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              title="My Profile"
            >
              <User size={20} className="nav-icon" />
              {!isCollapsed && <span>My Profile</span>}
            </button>
          </>
        )}

        {/* BLOOD SEEKER NAVIGATION */}
        {user && isSeeker && (
          <>
            <button
              type="button"
              onClick={() => handleNavClick('/seeker-dashboard', 'dashboard')}
              className={`sidebar-nav-btn ${location.pathname === '/seeker-dashboard' && (!activeTab || activeTab === 'dashboard') ? 'active' : ''}`}
              title="Dashboard"
            >
              <LayoutDashboard size={20} className="nav-icon" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/seeker-dashboard', 'donors')}
              className={`sidebar-nav-btn ${activeTab === 'donors' ? 'active' : ''}`}
              title="Find Donors"
            >
              <Search size={20} className="nav-icon" />
              {!isCollapsed && <span>Find Donors</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/seeker-dashboard', 'post-request')}
              className={`sidebar-nav-btn ${activeTab === 'post-request' ? 'active' : ''}`}
              title="Post Blood Request"
            >
              <PlusCircle size={20} className="nav-icon" />
              {!isCollapsed && <span>Post Blood Request</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/seeker-dashboard', 'sos')}
              className={`sidebar-nav-btn ${activeTab === 'sos' ? 'active' : ''}`}
              title="Emergency SOS"
            >
              <AlertCircle size={20} className="nav-icon text-red-accent" />
              {!isCollapsed && <span>Emergency SOS</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/hospitals', 'hospitals')}
              className={`sidebar-nav-btn ${location.pathname === '/hospitals' ? 'active' : ''}`}
              title="Hospitals and Blood Banks"
            >
              <Building2 size={20} className="nav-icon" />
              {!isCollapsed && <span>Hospitals and Blood Banks</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/seeker-dashboard', 'my-requests')}
              className={`sidebar-nav-btn ${activeTab === 'my-requests' ? 'active' : ''}`}
              title="My Requests"
            >
              <FileText size={20} className="nav-icon" />
              {!isCollapsed && <span>My Requests</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/seeker-dashboard', 'profile')}
              className={`sidebar-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              title="My Profile"
            >
              <User size={20} className="nav-icon" />
              {!isCollapsed && <span>My Profile</span>}
            </button>
          </>
        )}

        {/* ADMIN NAVIGATION */}
        {user && isAdmin && (
          <>
            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'dashboard')}
              className={`sidebar-nav-btn ${location.pathname === '/admin' && (!activeTab || activeTab === 'dashboard') ? 'active' : ''}`}
              title="Admin Dashboard"
            >
              <LayoutDashboard size={20} className="nav-icon" />
              {!isCollapsed && <span>Admin Dashboard</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'donors')}
              className={`sidebar-nav-btn ${activeTab === 'donors' ? 'active' : ''}`}
              title="Manage Donors"
            >
              <Users size={20} className="nav-icon" />
              {!isCollapsed && <span>Manage Donors</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'seekers')}
              className={`sidebar-nav-btn ${activeTab === 'seekers' ? 'active' : ''}`}
              title="Manage Seekers"
            >
              <User size={20} className="nav-icon" />
              {!isCollapsed && <span>Manage Seekers</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'requests')}
              className={`sidebar-nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
              title="Manage Emergency Requests"
            >
              <AlertCircle size={20} className="nav-icon text-red-accent" />
              {!isCollapsed && <span>Manage Requests</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'verification')}
              className={`sidebar-nav-btn ${activeTab === 'verification' ? 'active' : ''}`}
              title="Donor Verification Queue"
            >
              <ShieldCheck size={20} className="nav-icon" />
              {!isCollapsed && <span>Verification Queue</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'hospitals')}
              className={`sidebar-nav-btn ${activeTab === 'hospitals' ? 'active' : ''}`}
              title="Hospitals and Blood Banks"
            >
              <Building2 size={20} className="nav-icon" />
              {!isCollapsed && <span>Hospitals & Banks</span>}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/admin', 'security')}
              className={`sidebar-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              title="Admin Security & Password"
            >
              <KeyRound size={20} className="nav-icon" />
              {!isCollapsed && <span>Admin Security</span>}
            </button>
          </>
        )}

        {/* PUBLIC / GUEST NAVIGATION */}
        {!user && (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `sidebar-nav-btn ${isActive ? 'active' : ''}`}
              title="Home"
            >
              <Home size={20} className="nav-icon" />
              {!isCollapsed && <span>Home</span>}
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) => `sidebar-nav-btn ${isActive ? 'active' : ''}`}
              title="Find Donors"
            >
              <Search size={20} className="nav-icon" />
              {!isCollapsed && <span>Find Donors</span>}
            </NavLink>

            <NavLink
              to="/emergency-sos"
              className={({ isActive }) => `sidebar-nav-btn ${isActive ? 'active' : ''}`}
              title="Emergency SOS"
            >
              <AlertCircle size={20} className="nav-icon text-red-accent" />
              {!isCollapsed && <span>Emergency SOS</span>}
            </NavLink>

            <NavLink
              to="/hospitals"
              className={({ isActive }) => `sidebar-nav-btn ${isActive ? 'active' : ''}`}
              title="Hospitals and Blood Banks"
            >
              <Building2 size={20} className="nav-icon" />
              {!isCollapsed && <span>Hospitals and Blood Banks</span>}
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) => `sidebar-nav-btn ${isActive ? 'active' : ''}`}
              title="Sign In"
            >
              <User size={20} className="nav-icon" />
              {!isCollapsed && <span>Sign In</span>}
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) => `sidebar-nav-btn ${isActive ? 'active' : ''}`}
              title="Register"
            >
              <PlusCircle size={20} className="nav-icon" />
              {!isCollapsed && <span>Register</span>}
            </NavLink>
          </>
        )}
      </nav>

      {/* Sidebar Footer with Logout for Authenticated Users */}
      {user && (
        <div className="sidebar-footer-section">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout-btn"
            title="Logout"
          >
            <LogOut size={18} className="nav-icon text-red-accent" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      )}
    </aside>
  );
};
