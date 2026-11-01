import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { DonorCard } from '../components/DonorCard';
import { HospitalCard } from '../components/HospitalCard';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  AlertCircle,
  Building2,
  FileText,
  User,
  CheckCircle,
  Phone,
  Clock,
  Droplet,
  MapPin,
  Send,
  ShieldCheck,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { api, VERIFIED_HOSPITALS_26 } from '../services/api';

export const SeekerDashboard = ({ activeTab = 'dashboard' }) => {
  const { user, updateUserProfile } = useAuth();

  // Requests
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Donors
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [searchBg, setSearchBg] = useState('ALL');
  const [searchState, setSearchState] = useState(user?.state || 'ALL');
  const [searchDistrict, setSearchDistrict] = useState('ALL');

  // Facilities
  const [facilities, setFacilities] = useState(VERIFIED_HOSPITALS_26);

  // Post Blood Request Form
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: 2,
    hospitalName: '',
    hospitalAddress: '',
    state: user?.state || 'Telangana',
    district: user?.district || 'Hyderabad',
    urgency: 'Urgent - Within 6 Hours',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    caseNotes: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.state || 'Telangana',
    district: user?.district || 'Hyderabad'
  });

  // Sync profile form data
  useEffect(() => {
    if (user) {
      setProfileFormData({
        name: user?.name || '',
        phone: user?.phone || '',
        state: user?.state || 'Telangana',
        district: user?.district || 'Hyderabad'
      });
      setFormData(prev => ({
        ...prev,
        state: user?.state || prev.state,
        district: user?.district || prev.district,
        contactName: user?.name || prev.contactName,
        contactPhone: user?.phone || prev.contactPhone
      }));
    }
  }, [user]);

  // Load Seeker's Own Requests from Backend
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      // 1. Fetch seeker's own requests directly from authenticated endpoint
      const myRes = await api.getMyRequests();
      if (myRes && myRes.requests) {
        setMyRequests(myRes.requests);
      } else {
        setMyRequests([]);
      }

      // 2. Fetch all public requests for emergency SOS tab
      const allRes = await api.getRequests();
      if (allRes && allRes.requests) {
        setAllRequests(allRes.requests);
      }
    } catch (err) {
      console.warn('Error loading requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch Donors with filters
  const searchForDonors = async () => {
    setLoadingDonors(true);
    try {
      const params = {};
      if (searchBg !== 'ALL') params.bloodGroup = searchBg;
      if (searchState !== 'ALL') params.state = searchState;
      if (searchDistrict !== 'ALL') params.district = searchDistrict;
      params.availableOnly = 'true';

      const res = await api.searchDonors(params);
      if (res && res.donors) {
        setDonors(res.donors);
      }
    } catch (err) {
      console.warn('Error loading donors:', err);
    } finally {
      setLoadingDonors(false);
    }
  };

  useEffect(() => {
    loadRequests();
    searchForDonors();
  }, [user]);

  // Handle Post Blood Request Submission
  const handlePostRequest = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await api.createRequest(formData);
      if (res && res.success) {
        setFormSuccess('Emergency blood requisition broadcast successfully! Matching voluntary donors are being alerted.');
        const createdReq = res.request || {
          _id: 'req-' + Date.now(),
          ...formData,
          status: 'Active',
          createdAt: new Date().toISOString()
        };
        setMyRequests(prev => [createdReq, ...prev]);
        setAllRequests(prev => [createdReq, ...prev]);

        // Reset form
        setFormData({
          patientName: '',
          bloodGroup: 'O+',
          unitsNeeded: 2,
          hospitalName: '',
          hospitalAddress: '',
          state: user?.state || 'Telangana',
          district: user?.district || 'Hyderabad',
          urgency: 'Urgent - Within 6 Hours',
          contactName: user?.name || '',
          contactPhone: user?.phone || '',
          caseNotes: ''
        });
      } else {
        setFormError(res.message || 'Failed to submit blood request. Please check inputs.');
      }
    } catch (err) {
      setFormError(err.message || 'Error communicating with emergency dispatch.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Request Status Update (Fulfilled / Cancelled)
  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      const res = await api.updateRequestStatus(requestId, newStatus);
      if (res && res.success) {
        setMyRequests(prev =>
          prev.map(r => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
        setAllRequests(prev =>
          prev.map(r => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.warn('Error updating request status:', err);
    }
  };

  // Handle Edit Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await api.updateProfile(profileFormData);
      if (res && res.success) {
        updateUserProfile(res.user);
        setProfileSuccess('Your profile details and hospital locator settings have been successfully updated.');
        setIsEditingProfile(false);
        setTimeout(() => setProfileSuccess(''), 6000);
      } else {
        setProfileError(res.message || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      setProfileError(err.message || 'Error updating profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const currentStateObj = INDIAN_STATES.find(s => s.name === formData.state);
  const districtList = currentStateObj ? currentStateObj.districts : ['Hyderabad'];

  const searchStateObj = INDIAN_STATES.find(s => s.name === searchState);
  const searchDistrictList = searchStateObj ? searchStateObj.districts : [];

  const profileStateObj = INDIAN_STATES.find(s => s.name === profileFormData.state);
  const profileDistrictList = profileStateObj ? profileStateObj.districts : ['Hyderabad'];

  return (
    <div className="scholarfind-dashboard-page">
      {/* 1. DASHBOARD OVERVIEW TAB */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <div className="scholarfind-welcome-banner">
            <h1 className="welcome-heading">Welcome, {user?.name}!</h1>
            <p className="welcome-description">
              HemoConnect Blood Seeker Portal allows you to find compatible blood donors in real-time,
              post hospital requisitions for urgent patient care, and access 26 verified blood bank centers across India.
            </p>
          </div>

          {/* Metric Stat Cards */}
          <div className="scholarfind-stats-row">
            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-blue">
                  <FileText size={20} />
                </span>
                <span className="stat-number">{myRequests.length}</span>
              </div>
              <span className="stat-label">My Requisitions</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-emerald">
                  <User size={20} />
                </span>
                <span className="stat-number">{donors.length}</span>
              </div>
              <span className="stat-label">Available Donors Found</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-indigo">
                  <Building2 size={20} />
                </span>
                <span className="stat-number">26</span>
              </div>
              <span className="stat-label">Verified Regional Centers</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-red">
                  <Phone size={20} />
                </span>
                <span className="stat-number stat-badge status-active">112 / 104</span>
              </div>
              <span className="stat-label">Emergency Helplines</span>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="scholarfind-action-tiles-grid mb-6">
            <div className="action-tile-item">
              <div className="action-tile-icon-box icon-blue">
                <Search size={22} />
              </div>
              <div className="action-tile-content">
                <h4>Find Compatible Donors</h4>
                <p>Filter registered voluntary donors by blood type and location</p>
              </div>
            </div>

            <div className="action-tile-item">
              <div className="action-tile-icon-box icon-red">
                <AlertCircle size={22} />
              </div>
              <div className="action-tile-content">
                <h4>Post Emergency Request</h4>
                <p>Broadcast high-priority requisition directly to registered donors</p>
              </div>
            </div>

            <div className="action-tile-item">
              <div className="action-tile-icon-box icon-indigo">
                <Building2 size={22} />
              </div>
              <div className="action-tile-content">
                <h4>Blood Bank Directory</h4>
                <p>Locate 26 24/7 government transfusion centers with map coordinates</p>
              </div>
            </div>
          </div>

          {/* Active Blood Requests List */}
          <div className="scholarfind-section-card">
            <div className="card-heading-row">
              <div>
                <h3 className="card-section-title">My Recent Blood Requisitions</h3>
                <p className="card-section-subtitle">
                  Current dispatch status of blood requests submitted under your account.
                </p>
              </div>
            </div>

            {loadingRequests ? (
              <div className="loading-state-box">Loading your blood requisitions...</div>
            ) : myRequests.length > 0 ? (
              <div className="emergency-cards-grid">
                {myRequests.map(req => (
                  <EmergencySOSCard
                    key={req._id}
                    request={req}
                    isOwner={true}
                    onUpdateStatus={handleUpdateRequestStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state-panel">
                <CheckCircle size={36} className="text-emerald" />
                <h4>No pending requisitions right now</h4>
                <p>Use the "Post Blood Request" option in the left sidebar to broadcast an emergency requirement when needed.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. FIND DONORS TAB */}
      {activeTab === 'donors' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Search Compatible Blood Donors</h2>
              <p className="card-section-subtitle">
                Filter voluntary donors based on clinical compatibility, state, and real-time availability.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="search-filter-card mb-6">
            <div className="filter-row-grid">
              <div className="filter-field">
                <label className="input-label">Blood Group Needed</label>
                <select
                  value={searchBg}
                  onChange={(e) => setSearchBg(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Blood Groups</option>
                  {ALL_BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label className="input-label">State</label>
                <select
                  value={searchState}
                  onChange={(e) => {
                    setSearchState(e.target.value);
                    setSearchDistrict('ALL');
                  }}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All States</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {searchState !== 'ALL' && (
                <div className="filter-field">
                  <label className="input-label">District</label>
                  <select
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    className="scholarfind-input select-input"
                  >
                    <option value="ALL">All Districts</option>
                    {searchDistrictList.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="filter-field btn-filter-align">
                <button
                  type="button"
                  onClick={searchForDonors}
                  className="scholarfind-btn-primary"
                >
                  <Search size={16} />
                  <span>Search Donors</span>
                </button>
              </div>
            </div>
          </div>

          {/* Donors Grid */}
          {loadingDonors ? (
            <div className="loading-state-box">Searching verified voluntary donors...</div>
          ) : donors.length > 0 ? (
            <div className="donors-cards-grid">
              {donors.map(donor => (
                <DonorCard key={donor._id} donor={donor} />
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <Search size={36} className="text-slate" />
              <h4>No donors found for selected criteria</h4>
              <p>Try expanding your search to all blood groups or neighboring states.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. POST BLOOD REQUEST TAB */}
      {activeTab === 'post-request' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Post Emergency Blood Request</h2>
              <p className="card-section-subtitle">
                Submit an emergency requisition for hospitalized patients. Broadcasts directly to compatible voluntary donors.
              </p>
            </div>
          </div>

          {formSuccess && (
            <div className="scholarfind-alert alert-success mb-5">
              <CheckCircle size={18} />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="scholarfind-alert alert-error mb-5">
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handlePostRequest} className="scholarfind-form requisition-form">
            <div className="form-grid-2col">
              <div className="scholarfind-input-group">
                <label className="input-label">Patient Full Name *</label>
                <div className="input-box-wrap">
                  <User size={17} className="input-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Enter patient's name"
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
                  <label className="input-label">Units Needed (Bags) *</label>
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
                  <Building2 size={17} className="input-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Hospital, Care Hospital, Osmania General"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="scholarfind-input-group">
                <label className="input-label">Hospital Ward / Address *</label>
                <div className="input-box-wrap">
                  <MapPin size={17} className="input-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICU Bed 4, Main Emergency Block"
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
                    onChange={(e) => {
                      const st = e.target.value;
                      const matchSt = INDIAN_STATES.find(s => s.name === st);
                      setFormData({ ...formData, state: st, district: matchSt?.districts[0] || '' });
                    }}
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
                    placeholder="Attendant / Family contact name"
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

            <div className="scholarfind-input-group mb-5">
              <label className="input-label">Case Details / Medical Notes (Optional)</label>
              <textarea
                rows="2"
                placeholder="e.g. Emergency surgery scheduled at 2:00 PM; replacement units needed urgently."
                value={formData.caseNotes}
                onChange={(e) => setFormData({ ...formData, caseNotes: e.target.value })}
                className="scholarfind-input textarea-input"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="scholarfind-btn-primary"
            >
              <Send size={17} />
              <span>{formLoading ? 'Submitting Requisition...' : 'Submit Emergency Blood Request'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. EMERGENCY SOS TAB */}
      {activeTab === 'sos' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Emergency SOS Center</h2>
              <p className="card-section-subtitle">
                Priority access to 24/7 national emergency services and live regional SOS broadcasts.
              </p>
            </div>
          </div>

          <div className="emergency-sos-helplines-banner mb-6">
            <div className="helpline-badge">
              <span className="sos-pulse-ring"></span>
              <strong>24x7 NATIONAL EMERGENCY HELPLINES</strong>
            </div>
            <div className="helplines-grid">
              <div className="helpline-box">
                <span className="hl-number">112</span>
                <span className="hl-desc">National Emergency Response System (All India)</span>
              </div>
              <div className="helpline-box">
                <span className="hl-number">104</span>
                <span className="hl-desc">National Health &amp; Blood Helpline</span>
              </div>
              <div className="helpline-box">
                <span className="hl-number">108</span>
                <span className="hl-desc">Free Emergency Ambulance Service</span>
              </div>
            </div>
          </div>

          <div className="emergency-cards-grid">
            {allRequests.map(req => (
              <EmergencySOSCard key={req._id} request={req} />
            ))}
          </div>
        </div>
      )}

      {/* 5. HOSPITALS AND BLOOD BANKS TAB */}
      {activeTab === 'hospitals' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Hospitals and Blood Banks Directory</h2>
              <p className="card-section-subtitle">
                Interactive geographical map and 26 verified regional healthcare transfusion centers.
              </p>
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div className="mb-6">
            <InteractiveMap facilities={facilities} />
          </div>

          {/* Facilities Cards Grid */}
          <div className="hospitals-grid">
            {facilities.map(facility => (
              <HospitalCard key={facility._id} facility={facility} />
            ))}
          </div>
        </div>
      )}

      {/* 6. MY REQUESTS TAB */}
      {activeTab === 'my-requests' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">My Blood Requisitions</h2>
              <p className="card-section-subtitle">
                History and live fulfillment tracking of all requests submitted by your account.
              </p>
            </div>
            <button
              type="button"
              onClick={loadRequests}
              className="scholarfind-btn-secondary"
            >
              Refresh Status
            </button>
          </div>

          {loadingRequests ? (
            <div className="loading-state-box">Loading your requisitions...</div>
          ) : myRequests.length > 0 ? (
            <div className="emergency-cards-grid">
              {myRequests.map(req => (
                <EmergencySOSCard
                  key={req._id}
                  request={req}
                  isOwner={true}
                  onUpdateStatus={handleUpdateRequestStatus}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <FileText size={36} className="text-slate" />
              <h4>No requests submitted yet</h4>
              <p>When you post an emergency blood requisition, its real-time progress and fulfillment controls will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* 7. MY PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Blood Seeker Account Profile</h2>
              <p className="card-section-subtitle">
                Your registered credentials and regional hospital contact settings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
                setProfileError('');
                setProfileSuccess('');
              }}
              className="scholarfind-btn-secondary"
            >
              {isEditingProfile ? (
                <>
                  <X size={15} />
                  <span>Cancel Edit</span>
                </>
              ) : (
                <>
                  <Edit3 size={15} />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {profileSuccess && (
            <div className="scholarfind-alert alert-success mb-5">
              <CheckCircle size={18} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="scholarfind-alert alert-error mb-5">
              <AlertCircle size={18} />
              <span>{profileError}</span>
            </div>
          )}

          {isEditingProfile ? (
            /* EDIT PROFILE FORM */
            <form onSubmit={handleSaveProfile} className="scholarfind-form edit-profile-form">
              <div className="form-grid-2col">
                <div className="scholarfind-input-group">
                  <label className="input-label">Full Name *</label>
                  <div className="input-box-wrap">
                    <User size={17} className="input-field-icon" />
                    <input
                      type="text"
                      required
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      className="scholarfind-input"
                    />
                  </div>
                </div>

                <div className="scholarfind-input-group">
                  <label className="input-label">Phone Number *</label>
                  <div className="input-box-wrap">
                    <Phone size={17} className="input-field-icon" />
                    <input
                      type="tel"
                      required
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      className="scholarfind-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="scholarfind-input-group">
                  <label className="input-label">State *</label>
                  <div className="input-box-wrap">
                    <select
                      value={profileFormData.state}
                      onChange={(e) => {
                        const st = e.target.value;
                        const match = INDIAN_STATES.find(s => s.name === st);
                        setProfileFormData({
                          ...profileFormData,
                          state: st,
                          district: match?.districts[0] || ''
                        });
                      }}
                      className="scholarfind-input select-input"
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s.code} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="scholarfind-input-group">
                  <label className="input-label">District *</label>
                  <div className="input-box-wrap">
                    <select
                      value={profileFormData.district}
                      onChange={(e) => setProfileFormData({ ...profileFormData, district: e.target.value })}
                      className="scholarfind-input select-input"
                    >
                      {profileDistrictList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="profile-edit-actions mt-4">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="scholarfind-btn-primary"
                >
                  <Save size={16} />
                  <span>{profileSaving ? 'Saving Updates to MongoDB...' : 'Save Profile Changes'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="scholarfind-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* VIEW PROFILE DETAILS */
            <div className="profile-details-grid">
              <div className="profile-item">
                <span className="profile-label">Full Name</span>
                <strong className="profile-value">{user?.name}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email Address</span>
                <strong className="profile-value">{user?.email}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Phone Number</span>
                <strong className="profile-value">{user?.phone || '+91 98765 43210'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">State</span>
                <strong className="profile-value">{user?.state || 'Telangana'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">District / City</span>
                <strong className="profile-value">{user?.district || 'Hyderabad'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Account Role</span>
                <strong className="profile-value">Registered Blood Seeker / Patient</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Verification Status</span>
                <strong className="profile-value text-emerald">Verified Account</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};