import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'donor' ? 'donor' : 'seeker';

  const [role, setRole] = useState(initialRole);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: 'Telangana',
    district: 'Hyderabad',
    bloodGroup: 'O+',
    age: 25,
    gender: 'Male',
    weightKg: 62
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentStateObj = INDIAN_STATES.find(s => s.name === formData.state);
  const districtList = currentStateObj ? currentStateObj.districts : [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const matchState = INDIAN_STATES.find(s => s.name === newState);
    setFormData({
      ...formData,
      state: newState,
      district: matchState?.districts[0] || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await register({
      ...formData,
      role
    });

    setLoading(false);

    if (res.success) {
      if (role === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  return (
    <div className="scholarfind-auth-page">
      <div className="auth-card-container register-card-container">
        <div className="scholarfind-auth-card register-wide-card">
          {/* Header */}
          <div className="auth-header-block">
            <h2 className="auth-main-title">
              {role === 'donor' ? 'Donor Registration' : 'Blood Seeker Registration'}
            </h2>
            <p className="auth-main-subtitle">
              Join the national blood assistance and emergency matching network
            </p>
          </div>

          {/* Role Tabs */}
          <div className="auth-tabs-pill">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`auth-tab-btn ${role === 'donor' ? 'active' : ''}`}
            >
              Voluntary Donor
            </button>
            <button
              type="button"
              onClick={() => setRole('seeker')}
              className={`auth-tab-btn ${role === 'seeker' ? 'active' : ''}`}
            >
              Blood Seeker / Patient
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="scholarfind-form">
            <div className="form-grid-2col">
              {/* Full Name */}
              <div className="scholarfind-input-group">
                <label className="input-label">Full Name *</label>
                <div className="input-box-wrap">
                  <User size={17} className="input-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="scholarfind-input-group">
                <label className="input-label">Email Address *</label>
                <div className="input-box-wrap">
                  <Mail size={17} className="input-field-icon" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2col">
              {/* Password with Show/Hide toggle */}
              <div className="scholarfind-input-group">
                <div className="password-label-row">
                  <label className="input-label">Password *</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="input-box-wrap">
                  <Lock size={17} className="input-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter account password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="scholarfind-input-group">
                <label className="input-label">Phone Number *</label>
                <div className="input-box-wrap">
                  <Phone size={17} className="input-field-icon" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2col">
              {/* State */}
              <div className="scholarfind-input-group">
                <label className="input-label">State *</label>
                <div className="input-box-wrap">
                  <select
                    value={formData.state}
                    onChange={handleStateChange}
                    className="scholarfind-input select-input"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District / City */}
              <div className="scholarfind-input-group">
                <label className="input-label">District / City *</label>
                <div className="input-box-wrap">
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="scholarfind-input select-input"
                  >
                    {districtList.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Donor Clinical Attributes */}
            {role === 'donor' && (
              <div className="donor-clinical-section">
                <div className="donor-section-title">
                  <ShieldCheck size={16} className="text-blue" />
                  <span>Clinical Eligibility Parameters</span>
                </div>

                <div className="form-grid-3col">
                  <div className="scholarfind-input-group">
                    <label className="input-label">Blood Group *</label>
                    <div className="input-box-wrap">
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="scholarfind-input select-input font-bold"
                      >
                        {ALL_BLOOD_GROUPS.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="scholarfind-input-group">
                    <label className="input-label">Age (18-65) *</label>
                    <div className="input-box-wrap">
                      <input
                        type="number"
                        min="18"
                        max="65"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                        className="scholarfind-input"
                      />
                    </div>
                  </div>

                  <div className="scholarfind-input-group">
                    <label className="input-label">Weight (kg) *</label>
                    <div className="input-box-wrap">
                      <input
                        type="number"
                        min="45"
                        max="150"
                        required
                        value={formData.weightKg}
                        onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                        className="scholarfind-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="scholarfind-input-group mt-2">
                  <label className="input-label">Gender *</label>
                  <div className="radio-pills-row">
                    {['Male', 'Female', 'Other'].map(gen => (
                      <label
                        key={gen}
                        className={`radio-pill-item ${formData.gender === gen ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gen}
                          checked={formData.gender === gen}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="sr-only"
                        />
                        <span>{gen}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="scholarfind-btn-primary"
            >
              <span>{loading ? 'Creating Account...' : `Register as ${role === 'donor' ? 'Voluntary Donor' : 'Blood Seeker'}`}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-card-footer">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-link-bold">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
