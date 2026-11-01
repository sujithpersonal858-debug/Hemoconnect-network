import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield, Activity, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active portal tab: 'donor', 'seeker', or 'admin'
  const [activeRole, setActiveRole] = useState('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password, activeRole);
    setLoading(false);

    if (res.success) {
      if (redirectPath && redirectPath !== '/login') {
        navigate(redirectPath);
      } else if (res.user?.role === 'admin' || email.includes('admin')) {
        navigate('/admin');
      } else if (res.user?.role === 'donor' || activeRole === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Invalid email or password');
    }
  };

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    setErrorMsg('');
  };

  return (
    <div className="scholarfind-auth-page">
      <div className="auth-card-container">
        {/* Main Sign In Card */}
        <div className="scholarfind-auth-card">
          {/* Card Header */}
          <div className="auth-header-block">
            <h2 className="auth-main-title">
              {activeRole === 'donor'
                ? 'Donor Sign In'
                : activeRole === 'seeker'
                ? 'Blood Seeker Sign In'
                : 'Administrator Sign In'}
            </h2>
            <p className="auth-main-subtitle">
              Sign in to access emergency requests and donor network
            </p>
          </div>

          {/* Role Selection Tabs (ScholarFind exact style) */}
          <div className="auth-tabs-pill">
            <button
              type="button"
              onClick={() => handleRoleSwitch('donor')}
              className={`auth-tab-btn ${activeRole === 'donor' ? 'active' : ''}`}
            >
              Donor Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('seeker')}
              className={`auth-tab-btn ${activeRole === 'seeker' ? 'active' : ''}`}
            >
              Blood Seeker Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`auth-tab-btn ${activeRole === 'admin' ? 'active' : ''}`}
            >
              Administrator Login
            </button>
          </div>

          {/* Sub-banner Portal Indicator & Quick Switch */}
          <div className="portal-sub-banner">
            <div className="portal-banner-tag">
              {activeRole === 'donor' && <Activity size={14} className="text-blue" />}
              {activeRole === 'seeker' && <User size={14} className="text-blue" />}
              {activeRole === 'admin' && <Shield size={14} className="text-blue" />}
              <span>
                {activeRole === 'donor'
                  ? 'Donor Portal'
                  : activeRole === 'seeker'
                  ? 'Blood Seeker Portal'
                  : 'Administrator Console'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRoleSwitch(activeRole === 'donor' ? 'seeker' : 'donor')}
              className="portal-banner-switch"
            >
              Switch to {activeRole === 'donor' ? 'Blood Seeker' : 'Donor'}
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="scholarfind-form">
            {/* Email Address */}
            <div className="scholarfind-input-group">
              <label className="input-label" htmlFor="email-input">
                {activeRole === 'donor' ? 'Donor Email Address' : activeRole === 'seeker' ? 'Seeker Email Address' : 'Email Address'}
              </label>
              <div className="input-box-wrap">
                <Mail size={17} className="input-field-icon" />
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="scholarfind-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password with Show/Hide toggle option */}
            <div className="scholarfind-input-group">
              <div className="password-label-row">
                <label className="input-label" htmlFor="password-input">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="input-box-wrap">
                <Lock size={17} className="input-field-icon" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="scholarfind-input"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Solid Blue Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="scholarfind-btn-primary"
            >
              <span>{loading ? 'Signing In...' : 'Sign In to HemoConnect'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Card Footer Link */}
          <div className="auth-card-footer">
            <span>Don't have an account? </span>
            <Link
              to={`/register?role=${activeRole === 'seeker' ? 'seeker' : 'donor'}`}
              className="auth-link-bold"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
