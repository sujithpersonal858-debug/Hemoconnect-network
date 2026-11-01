import React, { useState, useEffect } from 'react';
import { AlertCircle, Send, Clock, MapPin, Building, Phone, User, CheckCircle, ShieldAlert } from 'lucide-react';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const EmergencySOS = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: 1,
    urgency: 'Critical - Immediate',
    hospitalName: '',
    hospitalAddress: '',
    state: user?.state || 'Telangana',
    district: user?.district || 'Hyderabad',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    caseNotes: ''
  });

  const [activeRequests, setActiveRequests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchActiveRequests = async () => {
    try {
      const res = await api.getRequests();
      if (res && res.requests) {
        setActiveRequests(res.requests);
      }
    } catch (err) {
      console.warn('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetchActiveRequests();
  }, []);

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
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.createRequest(formData);
      if (res && res.success) {
        setSuccessMsg('Emergency blood request broadcast successfully! Voluntary donors are being alerted.');
        const newReq = res.request || {
          _id: 'req-' + Date.now(),
          ...formData,
          status: 'Active',
          createdAt: new Date().toISOString()
        };
        setActiveRequests([newReq, ...activeRequests]);
        setFormData({
          patientName: '',
          bloodGroup: 'O+',
          unitsNeeded: 1,
          urgency: 'Critical - Immediate',
          hospitalName: '',
          hospitalAddress: '',
          state: user?.state || 'Telangana',
          district: user?.district || 'Hyderabad',
          contactName: user?.name || '',
          contactPhone: user?.phone || '',
          caseNotes: ''
        });
      } else {
        setErrorMsg(res.message || 'Failed to submit emergency request.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="scholarfind-dashboard-page">
      {/* Welcome Banner */}
      <div className="scholarfind-welcome-banner">
        <h1 className="welcome-heading">Emergency SOS &amp; Urgent Blood Requests</h1>
        <p className="welcome-description">
          Broadcast life-saving blood requisitions directly to registered voluntary donors in your district. Use this service for hospital surgeries, trauma emergencies, and acute transfusion needs.
        </p>
      </div>

      {/* 24x7 Emergency Helplines Card */}
      <div className="emergency-sos-helplines-banner mb-6">
        <div className="helpline-badge">
          <span className="sos-pulse-ring"></span>
          <strong>24/7 NATIONAL EMERGENCY HELPLINES</strong>
        </div>
        <div className="helplines-grid">
          <div className="helpline-box">
            <span className="hl-number">112</span>
            <span className="hl-desc">National Emergency Response (All India)</span>
          </div>
          <div className="helpline-box">
            <span className="hl-number">104</span>
            <span className="hl-desc">National Health &amp; Blood Support Line</span>
          </div>
          <div className="helpline-box">
            <span className="hl-number">108</span>
            <span className="hl-desc">Free Emergency Ambulance Service</span>
          </div>
        </div>
      </div>

      {/* Broadcast Form Card */}
      <div className="scholarfind-section-card mb-6">
        <div className="card-heading-row">
          <div>
            <h2 className="card-section-title">Post New Emergency Blood Requisition</h2>
            <p className="card-section-subtitle">
              Fill in verified patient and hospital details. Request will be dispatched immediately.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="scholarfind-alert alert-success mb-5">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="scholarfind-alert alert-error mb-5">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="scholarfind-form requisition-form">
          <div className="form-grid-2col">
            <div className="scholarfind-input-group">
              <label className="input-label">Patient Name *</label>
              <div className="input-box-wrap">
                <User size={17} className="input-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="Patient's official full name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="scholarfind-input"
                />
              </div>
            </div>

            <div className="form-grid-2col-nested">
              <div className="scholarfind-input-group">
                <label className="input-label">Blood Group Needed *</label>
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
                <label className="input-label">Units Needed *</label>
                <div className="input-box-wrap">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: Number(e.target.value) })}
                    className="scholarfind-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="scholarfind-input-group">
              <label className="input-label">Hospital Name *</label>
              <div className="input-box-wrap">
                <Building size={17} className="input-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Osmania General Hospital, Apollo Jubilee Hills"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="scholarfind-input"
                />
              </div>
            </div>

            <div className="scholarfind-input-group">
              <label className="input-label">Hospital Address &amp; Ward *</label>
              <div className="input-box-wrap">
                <MapPin size={17} className="input-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Trauma ICU Ward 3, Ground Floor"
                  value={formData.hospitalAddress}
                  onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
                  className="scholarfind-input"
                />
              </div>
            </div>
          </div>

          <div className="form-grid-3col">
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

            <div className="scholarfind-input-group">
              <label className="input-label">Urgency Level *</label>
              <div className="input-box-wrap">
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="scholarfind-input select-input text-red-accent font-bold"
                >
                  <option value="Critical - Immediate">Critical - Immediate</option>
                  <option value="Urgent - Within 6 Hours">Urgent - Within 6 Hours</option>
                  <option value="Within 24 Hours">Within 24 Hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="scholarfind-input-group">
              <label className="input-label">Contact Person Name *</label>
              <div className="input-box-wrap">
                <User size={17} className="input-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="Doctor, nurse, or patient attendant"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="scholarfind-input"
                />
              </div>
            </div>

            <div className="scholarfind-input-group">
              <label className="input-label">Contact Phone Number *</label>
              <div className="input-box-wrap">
                <Phone size={17} className="input-field-icon" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98480 12345"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="scholarfind-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="scholarfind-btn-primary"
          >
            <Send size={17} />
            <span>{submitting ? 'Broadcasting...' : 'Broadcast Emergency Blood Request'}</span>
          </button>
        </form>
      </div>

      {/* Live Requisitions Stream */}
      <div className="scholarfind-section-card">
        <div className="card-heading-row">
          <div>
            <h3 className="card-section-title">Active Emergency Requisitions Stream ({activeRequests.length})</h3>
            <p className="card-section-subtitle">
              Live dispatches across monitored hospitals and regional trauma networks.
            </p>
          </div>
        </div>

        <div className="emergency-cards-grid">
          {activeRequests.map(req => (
            <EmergencySOSCard key={req._id} request={req} />
          ))}
        </div>
      </div>
    </div>
  );
};
