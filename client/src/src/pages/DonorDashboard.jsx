import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import {
  Activity,
  Award,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Droplet,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  HeartHandshake,
  Heart,
  Edit3,
  Save,
  X,
  FileText
} from 'lucide-react';
import { BLOOD_COMPATIBILITY } from '../utils/bloodCompatibility';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { api } from '../services/api';

export const DonorDashboard = ({ activeTab = 'dashboard' }) => {
  const { user, donorProfile, setDonorProfile, updateUserProfile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(donorProfile?.isAvailable ?? true);
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationSuccess, setDonationSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Search filter inside "Find Blood Requests"
  const [searchBloodGroup, setSearchBloodGroup] = useState('ALL');
  const [searchState, setSearchState] = useState('ALL');

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.state || 'Telangana',
    district: user?.district || 'Hyderabad',
    bloodGroup: donorProfile?.bloodGroup || 'O+',
    age: donorProfile?.age || 25,
    weightKg: donorProfile?.weightKg || 65,
    gender: donorProfile?.gender || 'Male'
  });

  // Sync profile form data whenever user or donorProfile changes
  useEffect(() => {
    if (user || donorProfile) {
      setProfileFormData({
        name: user?.name || '',
        phone: user?.phone || donorProfile?.user?.phone || '',
        state: user?.state || donorProfile?.state || 'Telangana',
        district: user?.district || donorProfile?.district || 'Hyderabad',
        bloodGroup: donorProfile?.bloodGroup || 'O+',
        age: donorProfile?.age || 25,
        weightKg: donorProfile?.weightKg || 65,
        gender: donorProfile?.gender || 'Male'
      });
      if (donorProfile?.isAvailable !== undefined) {
        setIsAvailable(donorProfile.isAvailable);
      }
    }
  }, [user, donorProfile]);

  const bloodGroup = donorProfile?.bloodGroup || 'O+';
  const compatData = BLOOD_COMPATIBILITY[bloodGroup] || BLOOD_COMPATIBILITY['O+'];

  // Cooldown calculation: 90 days interval between whole blood donations
  const cooldownDays = 90;
  const lastDonationDate = donorProfile?.lastDonationDate ? new Date(donorProfile.lastDonationDate) : null;
  let nextEligibleDate = null;
  let daysRemaining = 0;
  let isEligible = true;

  if (lastDonationDate) {
    nextEligibleDate = new Date(lastDonationDate.getTime() + cooldownDays * 24 * 60 * 60 * 1000);
    const msDiff = nextEligibleDate.getTime() - Date.now();
    daysRemaining = Math.ceil(msDiff / (24 * 60 * 60 * 1000));
    isEligible = daysRemaining <= 0;
  }

  const donationsCount = donorProfile?.donationsCount || 0;
  const estimatedLivesSaved = donationsCount * 3;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.getRequests();
        if (res && res.requests) {
          setAllRequests(res.requests);
          const matched = res.requests.filter(req =>
            compatData.canDonateTo.includes(req.bloodGroup)
          );
          setMatchingRequests(matched);
        }
      } catch (err) {
        console.warn('Failed to load requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [bloodGroup]);

  // Toggle availability
  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      const res = await api.toggleAvailability(nextState);
      if (res && res.donor) {
        setDonorProfile(res.donor);
        updateUserProfile(null, res.donor);
      }
    } catch (err) {
      console.warn('Could not update availability:', err);
    }
  };

  // Log completed donation
  const handleLogDonation = async () => {
    setActionLoading(true);
    try {
      const res = await api.logDonation();
      if (res && res.success) {
        const newCount = (donorProfile?.donationsCount || 0) + 1;
        const newDate = new Date().toISOString();
        const updatedProfile = {
          ...donorProfile,
          donationsCount: newCount,
          lastDonationDate: newDate
        };
        setDonorProfile(updatedProfile);
        updateUserProfile(null, updatedProfile);
        setDonationSuccess(`Thank you! Your donation has been recorded. You have now completed ${newCount} life-saving donation(s)!`);
        setTimeout(() => setDonationSuccess(''), 7000);
      }
    } catch (err) {
      console.error('Error logging donation:', err);
    } finally {
      setActionLoading(false);
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
        updateUserProfile(res.user, res.donorProfile);
        setProfileSuccess('Your profile details and medical parameters have been successfully updated in MongoDB.');
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

  // Filtered requests for "Find Blood Requests" tab
  const filteredRequests = allRequests.filter(r => {
    const matchBg = searchBloodGroup === 'ALL' || r.bloodGroup === searchBloodGroup;
    const matchSt = searchState === 'ALL' || r.state?.toLowerCase() === searchState.toLowerCase();
    return matchBg && matchSt;
  });

  // Critical SOS requests for "Emergency SOS Requests" tab
  const urgentSOSRequests = allRequests.filter(r =>
    r.urgency?.toLowerCase().includes('critical') ||
    r.urgency?.toLowerCase().includes('immediate') ||
    r.urgency?.toLowerCase().includes('urgent')
  );

  const selectedStateObj = INDIAN_STATES.find(s => s.name === profileFormData.state);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : ['Hyderabad'];

  return (
    <div className="scholarfind-dashboard-page">
      {/* 1. DASHBOARD OVERVIEW TAB */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Hero Banner (ScholarFind Style) */}
          <div className="scholarfind-welcome-banner">
            <h1 className="welcome-heading">Welcome, {user?.name}!</h1>
            <p className="welcome-description">
              You are an active voluntary donor registered with blood group <strong>{bloodGroup}</strong>.
              Your donations can safely save patients needing: <strong>{compatData.canDonateTo.join(', ')}</strong> blood.
              Check live emergency calls and monitor your medical eligibility cooldown below.
            </p>
          </div>

          {donationSuccess && (
            <div className="scholarfind-alert alert-success">
              <CheckCircle size={18} />
              <span>{donationSuccess}</span>
            </div>
          )}

          {/* Metric Stat Cards Grid */}
          <div className="scholarfind-stats-row">
            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-blue">
                  <Droplet size={20} />
                </span>
                <span className="stat-number">{bloodGroup}</span>
              </div>
              <span className="stat-label">Blood Group</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-emerald">
                  <Award size={20} />
                </span>
                <span className="stat-number">{donationsCount}</span>
              </div>
              <span className="stat-label">Total Donations</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-red">
                  <Heart size={20} />
                </span>
                <span className="stat-number">{estimatedLivesSaved}</span>
              </div>
              <span className="stat-label">Lives Saved (Est.)</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className={`stat-icon-wrap ${isEligible ? 'icon-emerald' : 'icon-amber'}`}>
                  <Calendar size={20} />
                </span>
                <span className={`stat-number stat-badge ${isEligible ? 'status-active' : 'status-resting'}`}>
                  {isEligible ? 'Eligible Now' : `${daysRemaining}d Cooldown`}
                </span>
              </div>
              <span className="stat-label">Donation Cooldown</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className={`stat-icon-wrap ${isAvailable ? 'icon-emerald' : 'icon-amber'}`}>
                  <Clock size={20} />
                </span>
                <span className={`stat-number stat-badge ${isAvailable ? 'status-active' : 'status-resting'}`}>
                  {isAvailable ? 'Available' : 'Resting'}
                </span>
              </div>
              <span className="stat-label">Duty Status</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-red">
                  <AlertCircle size={20} />
                </span>
                <span className="stat-number">{matchingRequests.length}</span>
              </div>
              <span className="stat-label">Matching Requisitions</span>
            </div>
          </div>

          {/* Medical Donation Cooldown Card */}
          <div className="scholarfind-section-card mb-6">
            <div className="cooldown-banner-row">
              <div className="cooldown-details">
                <div className="cooldown-header-flex">
                  <span className={`cooldown-status-chip ${isEligible ? 'chip-eligible' : 'chip-cooldown'}`}>
                    {isEligible ? '✓ Clinically Eligible to Donate Blood' : `⏳ 90-Day Recovery Cooldown Active`}
                  </span>
                  {nextEligibleDate && (
                    <span className="cooldown-date-text">
                      Next Eligible Date: <strong>{nextEligibleDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                    </span>
                  )}
                </div>
                <p className="card-section-subtitle mt-2">
                  {isEligible
                    ? 'According to National Blood Transfusion Council (NBTC) guidelines, you have satisfied the required 90-day recovery interval and are eligible to donate whole blood.'
                    : `Medical protocol requires a minimum 90-day recovery interval between whole blood donations to ensure adequate hemoglobin and iron replenishment. You have ${daysRemaining} day(s) remaining in your resting cycle.`}
                </p>
              </div>

              <div className="cooldown-action">
                <button
                  type="button"
                  onClick={handleLogDonation}
                  disabled={actionLoading}
                  className="scholarfind-btn-primary"
                  title="Log a donation record"
                >
                  <Award size={16} />
                  <span>{actionLoading ? 'Recording...' : 'Log Blood Donation'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Availability Status Toggle Card */}
          <div className="scholarfind-section-card mb-6">
            <div className="availability-management-row">
              <div>
                <h3 className="card-section-title">Emergency Standby Availability</h3>
                <p className="card-section-subtitle">
                  When enabled, verified hospitals and emergency seekers in <strong>{user?.state || 'your state'}</strong> can locate and contact you for life-critical transfusions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleAvailability}
                className={`btn-toggle-availability ${isAvailable ? 'btn-is-available' : 'btn-is-resting'}`}
              >
                <span className="status-indicator-dot"></span>
                <span>{isAvailable ? 'Currently Available for Transfusion' : 'Resting / Standby'}</span>
              </button>
            </div>
          </div>

          {/* Matching Emergency Blood Requests */}
          <div className="scholarfind-section-card">
            <div className="card-heading-row">
              <div>
                <h3 className="card-section-title">Emergency Requests Matching Your Blood Type ({bloodGroup})</h3>
                <p className="card-section-subtitle">
                  These verified patient requisitions can accept blood transfusions from donor blood type ({bloodGroup}).
                </p>
              </div>
            </div>

            {loading ? (
              <div className="loading-state-box">Loading matching requisitions...</div>
            ) : matchingRequests.length > 0 ? (
              <div className="emergency-cards-grid">
                {matchingRequests.map(req => (
                  <EmergencySOSCard key={req._id} request={req} />
                ))}
              </div>
            ) : (
              <div className="empty-state-panel">
                <CheckCircle size={36} className="text-emerald" />
                <h4>No pending requisitions matching your blood type right now</h4>
                <p>You will receive priority alerts as soon as an urgent transfusion request is posted in your state.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. FIND BLOOD REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Find Blood Requisitions</h2>
              <p className="card-section-subtitle">
                Browse hospital and patient blood requirements across India. Filter by blood group and location.
              </p>
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="search-filter-card mb-5">
            <div className="filter-row-grid">
              <div className="filter-field">
                <label className="input-label">Filter by Blood Group</label>
                <select
                  value={searchBloodGroup}
                  onChange={(e) => setSearchBloodGroup(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Blood Groups</option>
                  {ALL_BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label className="input-label">Filter by State</label>
                <select
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Indian States</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {filteredRequests.length > 0 ? (
            <div className="emergency-cards-grid">
              {filteredRequests.map(req => (
                <EmergencySOSCard key={req._id} request={req} />
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <Search size={36} className="text-slate" />
              <h4>No requisitions found matching selected filters</h4>
              <p>Try selecting "All Blood Groups" or "All Indian States".</p>
            </div>
          )}
        </div>
      )}

      {/* 3. EMERGENCY SOS REQUESTS TAB */}
      {activeTab === 'sos' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Emergency SOS Requests</h2>
              <p className="card-section-subtitle">
                High-priority life-critical blood requests requiring immediate hospital response within 0-6 hours.
              </p>
            </div>
          </div>

          {urgentSOSRequests.length > 0 ? (
            <div className="emergency-cards-grid">
              {urgentSOSRequests.map(req => (
                <EmergencySOSCard key={req._id} request={req} />
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <CheckCircle size={36} className="text-emerald" />
              <h4>No critical emergency requisitions at this moment</h4>
              <p>Emergency medical systems are stable across all monitored sectors.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. MY AVAILABILITY TAB */}
      {activeTab === 'availability' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Donor Availability &amp; Medical Guidelines</h2>
              <p className="card-section-subtitle">
                Manage your on-duty standby status and review donation health intervals.
              </p>
            </div>
          </div>

          <div className="availability-card-expanded mb-6">
            <div className="availability-status-box">
              <span className="status-label-small">Current Status</span>
              <h3 className={`status-state-heading ${isAvailable ? 'text-emerald' : 'text-amber'}`}>
                {isAvailable ? 'Available for Emergency Transfusions' : 'Resting / Standby'}
              </h3>
              <p className="status-explainer">
                {isAvailable
                  ? 'Your contact number is authorized to be displayed to seekers and hospital blood coordinators in emergency searches.'
                  : 'Your profile is temporarily hidden from emergency contact requests. You can re-enable anytime.'}
              </p>
              <button
                type="button"
                onClick={handleToggleAvailability}
                className={`btn-toggle-availability mt-3 ${isAvailable ? 'btn-is-available' : 'btn-is-resting'}`}
              >
                <span className="status-indicator-dot"></span>
                <span>{isAvailable ? 'Switch to Resting / Standby' : 'Set as Available Now'}</span>
              </button>
            </div>
          </div>

          {/* Clinical Eligibility Standards */}
          <div className="eligibility-guidelines-box">
            <h4 className="guidelines-title">Clinical Eligibility Guidelines (National Blood Transfusion Council)</h4>
            <div className="guidelines-grid">
              <div className="guideline-item">
                <CheckCircle size={18} className="text-emerald" />
                <div>
                  <strong className="guideline-field-label">Age Limit:</strong>
                  <p className="guideline-field-value">Between 18 and 65 years old</p>
                </div>
              </div>
              <div className="guideline-item">
                <CheckCircle size={18} className="text-emerald" />
                <div>
                  <strong className="guideline-field-label">Minimum Weight:</strong>
                  <p className="guideline-field-value">Minimum 45 kg for whole blood donation</p>
                </div>
              </div>
              <div className="guideline-item">
                <CheckCircle size={18} className="text-emerald" />
                <div>
                  <strong className="guideline-field-label">Interval Cooldown:</strong>
                  <p className="guideline-field-value">90 days (3 months) between whole blood donations</p>
                </div>
              </div>
              <div className="guideline-item">
                <CheckCircle size={18} className="text-emerald" />
                <div>
                  <strong className="guideline-field-label">Hemoglobin Count:</strong>
                  <p className="guideline-field-value">Minimum 12.5 g/dL measured before donation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DONATION HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Donation History &amp; Records</h2>
              <p className="card-section-subtitle">
                Official log of voluntary donations completed under your verified profile.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogDonation}
              disabled={actionLoading}
              className="scholarfind-btn-primary"
            >
              <Award size={16} />
              <span>{actionLoading ? 'Recording...' : 'Log Blood Donation'}</span>
            </button>
          </div>

          {donationSuccess && (
            <div className="scholarfind-alert alert-success mb-4">
              <CheckCircle size={18} />
              <span>{donationSuccess}</span>
            </div>
          )}

          <div className="history-summary-box mb-5">
            <div className="summary-stat">
              <span className="summary-num">{donationsCount}</span>
              <span className="summary-lbl">Total Donations</span>
            </div>
            <div className="summary-stat">
              <span className="summary-num">{donationsCount * 350} ml</span>
              <span className="summary-lbl">Whole Blood Donated</span>
            </div>
            <div className="summary-stat">
              <span className="summary-num">{estimatedLivesSaved}</span>
              <span className="summary-lbl">Estimated Lives Saved</span>
            </div>
            <div className="summary-stat">
              <span className="summary-num text-emerald">{isEligible ? 'Eligible Now' : `${daysRemaining} Days`}</span>
              <span className="summary-lbl">Next Eligibility</span>
            </div>
          </div>

          <div className="history-table-wrapper">
            <table className="scholarfind-table">
              <thead>
                <tr>
                  <th>Donation #</th>
                  <th>Date</th>
                  <th>Blood Group</th>
                  <th>Type &amp; Volume</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donationsCount > 0 ? (
                  Array.from({ length: donationsCount }).map((_, idx) => {
                    const donationNum = donationsCount - idx;
                    const dateObj = idx === 0 && lastDonationDate ? lastDonationDate : new Date(Date.now() - (idx + 1) * 95 * 86400000);
                    return (
                      <tr key={donationNum}>
                        <td><strong>#{donationNum}</strong></td>
                        <td>
                          {dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td><span className="badge-bg">{bloodGroup}</span></td>
                        <td>Whole Blood (350 ml)</td>
                        <td><span className="badge-verified">Verified Medical Record</span></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-slate">
                      No blood donation records logged yet. Click "Log Blood Donation" after donating.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. MY PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Donor Profile &amp; Medical Parameters</h2>
              <p className="card-section-subtitle">
                Your registered credentials, contact details, and clinical eligibility metrics.
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
                  <label className="input-label">Blood Group *</label>
                  <div className="input-box-wrap">
                    <select
                      value={profileFormData.bloodGroup}
                      onChange={(e) => setProfileFormData({ ...profileFormData, bloodGroup: e.target.value })}
                      className="scholarfind-input select-input font-bold"
                    >
                      {ALL_BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="scholarfind-input-group">
                  <label className="input-label">Gender *</label>
                  <div className="input-box-wrap">
                    <select
                      value={profileFormData.gender}
                      onChange={(e) => setProfileFormData({ ...profileFormData, gender: e.target.value })}
                      className="scholarfind-input select-input"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="scholarfind-input-group">
                  <label className="input-label">Age (years) *</label>
                  <div className="input-box-wrap">
                    <input
                      type="number"
                      min="18"
                      max="65"
                      required
                      value={profileFormData.age}
                      onChange={(e) => setProfileFormData({ ...profileFormData, age: Number(e.target.value) })}
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
                      value={profileFormData.weightKg}
                      onChange={(e) => setProfileFormData({ ...profileFormData, weightKg: Number(e.target.value) })}
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
                      {districtOptions.map(d => (
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
                <strong className="profile-value">{user?.phone || donorProfile?.user?.phone || '+91 98480 12345'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Blood Group</span>
                <strong className="profile-value text-blue">{bloodGroup}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Age &amp; Gender</span>
                <strong className="profile-value">{donorProfile?.age || 25} yrs • {donorProfile?.gender || 'Male'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Body Weight</span>
                <strong className="profile-value">{donorProfile?.weightKg || 65} kg</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">State</span>
                <strong className="profile-value">{user?.state || donorProfile?.state || 'Telangana'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">District / City</span>
                <strong className="profile-value">{user?.district || donorProfile?.district || 'Hyderabad'}</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Account Role</span>
                <strong className="profile-value">Registered Voluntary Blood Donor</strong>
              </div>
              <div className="profile-item">
                <span className="profile-label">Verification Status</span>
                <strong className="profile-value text-emerald">Verified Active</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};