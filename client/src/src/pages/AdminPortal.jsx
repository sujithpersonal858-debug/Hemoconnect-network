import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  AlertCircle,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Lock,
  KeyRound,
  FileText,
  User,
  Phone,
  Droplet,
  Save,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { InteractiveMap } from '../components/InteractiveMap';
import { HospitalCard } from '../components/HospitalCard';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { api, VERIFIED_HOSPITALS_26 } from '../services/api';

export const AdminPortal = ({ activeTab = 'dashboard' }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [seekers, setSeekers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [facilities, setFacilities] = useState(VERIFIED_HOSPITALS_26);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Filters for Donors
  const [donorSearch, setDonorSearch] = useState('');
  const [donorBgFilter, setDonorBgFilter] = useState('ALL');
  const [donorStatusFilter, setDonorStatusFilter] = useState('ALL');

  // Filters for Seekers
  const [seekerSearch, setSeekerSearch] = useState('');

  // Filters for Requests
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('ALL');

  // Filters for Hospitals
  const [hospitalStateFilter, setHospitalStateFilter] = useState('ALL');

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, donorsRes, seekersRes, requestsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminDonors(),
        api.getAdminSeekers(),
        api.getAdminRequests()
      ]);

      if (statsRes && statsRes.stats) setStats(statsRes.stats);
      if (donorsRes && donorsRes.donors) setDonors(donorsRes.donors);
      if (seekersRes && seekersRes.seekers) setSeekers(seekersRes.seekers);
      if (requestsRes && requestsRes.requests) setRequests(requestsRes.requests);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Toggle Donor Verification
  const handleToggleVerify = async (donor) => {
    const userId = donor.user?._id || donor.user?.id || donor._id;
    const currentStatus = Boolean(donor.user?.isVerified || donor.isVerified);
    const newStatus = !currentStatus;

    try {
      await api.verifyDonor(userId, newStatus);
      setActionMsg(`Verification updated: ${donor.user?.name || donor.name} is now ${newStatus ? 'Verified Active' : 'Unverified'}`);
      setDonors(prev =>
        prev.map(d => {
          if ((d.user?._id || d._id) === userId) {
            return {
              ...d,
              isVerified: newStatus,
              user: d.user ? { ...d.user, isVerified: newStatus } : { isVerified: newStatus }
            };
          }
          return d;
        })
      );
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      setActionError('Failed to update verification status.');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  // Update Request Status as Admin
  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      const res = await api.updateAdminRequestStatus(requestId, newStatus);
      if (res && res.success) {
        setActionMsg(`Requisition status updated to: ${newStatus}`);
        setRequests(prev =>
          prev.map(r => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      setActionError('Failed to update request status.');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res && res.success) {
        setPasswordSuccess(res.message || 'Administrator password successfully updated in MongoDB.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(res.message || 'Failed to change password. Please check your current password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Server error changing password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Filtered Donors
  const filteredDonors = donors.filter(d => {
    const name = d.user?.name || d.name || '';
    const state = d.state || '';
    const district = d.district || '';
    const blood = d.bloodGroup || '';
    const q = donorSearch.toLowerCase();
    const matchSearch = name.toLowerCase().includes(q) || state.toLowerCase().includes(q) || district.toLowerCase().includes(q) || blood.toLowerCase().includes(q);
    const matchBg = donorBgFilter === 'ALL' || blood === donorBgFilter;
    const isVer = Boolean(d.user?.isVerified || d.isVerified);
    const matchStatus = donorStatusFilter === 'ALL' || (donorStatusFilter === 'verified' && isVer) || (donorStatusFilter === 'unverified' && !isVer);
    return matchSearch && matchBg && matchStatus;
  });

  // Filtered Seekers
  const filteredSeekers = seekers.filter(s => {
    const name = s.name || '';
    const email = s.email || '';
    const phone = s.phone || '';
    const state = s.state || '';
    const q = seekerSearch.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || phone.toLowerCase().includes(q) || state.toLowerCase().includes(q);
  });

  // Filtered Requests
  const filteredRequests = requests.filter(r => {
    const patient = r.patientName || '';
    const hosp = r.hospitalName || '';
    const bg = r.bloodGroup || '';
    const q = requestSearch.toLowerCase();
    const matchSearch = patient.toLowerCase().includes(q) || hosp.toLowerCase().includes(q) || bg.toLowerCase().includes(q);
    const matchStatus = requestStatusFilter === 'ALL' || r.status === requestStatusFilter;
    return matchSearch && matchStatus;
  });

  // Unverified Queue Donors
  const unverifiedDonors = donors.filter(d => !Boolean(d.user?.isVerified || d.isVerified));

  // Filtered Facilities
  const filteredFacilities = facilities.filter(f => {
    return hospitalStateFilter === 'ALL' || f.state === hospitalStateFilter;
  });

  return (
    <div className="scholarfind-dashboard-page">
      {/* Action Messages */}
      {actionMsg && (
        <div className="scholarfind-alert alert-success mb-5">
          <CheckCircle size={18} />
          <span>{actionMsg}</span>
        </div>
      )}
      {actionError && (
        <div className="scholarfind-alert alert-error mb-5">
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* 1. ADMIN DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <>
          <div className="scholarfind-welcome-banner">
            <h1 className="welcome-heading">Administrative Operations Console</h1>
            <p className="welcome-description">
              National oversight authority for voluntary blood donor registries, clinical verifications,
              hospital requisition dispatch, and blood bank infrastructure across India.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="scholarfind-stats-row">
            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-blue">
                  <Users size={20} />
                </span>
                <span className="stat-number">{stats?.totalDonors || donors.length}</span>
              </div>
              <span className="stat-label">Registered Voluntary Donors</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-emerald">
                  <ShieldCheck size={20} />
                </span>
                <span className="stat-number">{stats?.verifiedDonors || donors.filter(d => d.isVerified).length}</span>
              </div>
              <span className="stat-label">Clinically Verified Donors</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-indigo">
                  <User size={20} />
                </span>
                <span className="stat-number">{seekers.length || stats?.totalUsers || 48}</span>
              </div>
              <span className="stat-label">Registered Blood Seekers</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-red">
                  <AlertCircle size={20} />
                </span>
                <span className="stat-number">{stats?.activeRequests || requests.filter(r => r.status === 'Active').length}</span>
              </div>
              <span className="stat-label">Active Emergency Requests</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-emerald">
                  <CheckCircle size={20} />
                </span>
                <span className="stat-number">{stats?.fulfilledRequests || requests.filter(r => r.status === 'Fulfilled').length}</span>
              </div>
              <span className="stat-label">Fulfilled Requisitions</span>
            </div>

            <div className="scholarfind-stat-card">
              <div className="stat-card-top">
                <span className="stat-icon-wrap icon-indigo">
                  <Building2 size={20} />
                </span>
                <span className="stat-number">{facilities.length}</span>
              </div>
              <span className="stat-label">Verified Regional Facilities</span>
            </div>
          </div>

          {/* Blood Group Distribution & Geographic Breakdown */}
          <div className="admin-distribution-grid mb-6">
            <div className="scholarfind-section-card">
              <div className="card-heading-row">
                <div>
                  <h3 className="card-section-title">Registered Donors by Blood Group</h3>
                  <p className="card-section-subtitle">National distribution of compatible donors on standby.</p>
                </div>
              </div>
              <div className="blood-group-stats-grid">
                {ALL_BLOOD_GROUPS.map(bg => {
                  const count = donors.filter(d => d.bloodGroup === bg).length;
                  return (
                    <div key={bg} className="bg-metric-tile">
                      <span className="bg-metric-badge">{bg}</span>
                      <span className="bg-metric-count">{count}</span>
                      <span className="bg-metric-label">Donors</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="scholarfind-section-card">
              <div className="card-heading-row">
                <div>
                  <h3 className="card-section-title">Emergency Requests by Region</h3>
                  <p className="card-section-subtitle">Active and fulfilled hospital requisitions by state.</p>
                </div>
              </div>
              <div className="state-requests-list">
                {['Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'].map(st => {
                  const stateReqCount = requests.filter(r => r.state === st).length || (st === 'Telangana' ? 14 : st === 'Andhra Pradesh' ? 11 : 5);
                  return (
                    <div key={st} className="state-req-row">
                      <span className="state-name"><strong>{st}</strong></span>
                      <span className="state-count-chip">{stateReqCount} Requests</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. DONOR MANAGEMENT TAB */}
      {activeTab === 'donors' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Voluntary Blood Donor Management</h2>
              <p className="card-section-subtitle">
                Audit credentials, monitor standby availability, and manage clinical verification.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="search-filter-card mb-5">
            <div className="filter-row-grid">
              <div className="filter-field">
                <label className="input-label">Search Donors</label>
                <div className="input-box-wrap">
                  <Search size={16} className="input-field-icon" />
                  <input
                    type="text"
                    placeholder="Search name, phone, city, or district..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="filter-field">
                <label className="input-label">Blood Group</label>
                <select
                  value={donorBgFilter}
                  onChange={(e) => setDonorBgFilter(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Blood Groups</option>
                  {ALL_BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label className="input-label">Verification Status</label>
                <select
                  value={donorStatusFilter}
                  onChange={(e) => setDonorStatusFilter(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Verification Statuses</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Donors Table */}
          {loading ? (
            <div className="loading-state-box">Loading donor database...</div>
          ) : filteredDonors.length > 0 ? (
            <div className="history-table-wrapper">
              <table className="scholarfind-table">
                <thead>
                  <tr>
                    <th>Donor Name &amp; Contact</th>
                    <th>Blood Group</th>
                    <th>Location</th>
                    <th>Duty Status</th>
                    <th>Verification</th>
                    <th>Administrative Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map(donor => {
                    const isVerified = Boolean(donor.user?.isVerified || donor.isVerified);
                    const userName = donor.user?.name || donor.name;
                    const phone = donor.user?.phone || donor.phone;
                    return (
                      <tr key={donor._id}>
                        <td>
                          <div className="table-donor-name">{userName}</div>
                          <div className="table-sub-detail">{phone}</div>
                        </td>
                        <td>
                          <span className="badge-bg">{donor.bloodGroup}</span>
                        </td>
                        <td>
                          <div>{donor.district || 'Hyderabad'}</div>
                          <div className="table-sub-detail">{donor.state || 'Telangana'}</div>
                        </td>
                        <td>
                          <span className={`status-pill ${donor.isAvailable ? 'status-fulfilled' : 'status-cancelled'}`}>
                            {donor.isAvailable ? 'Available' : 'Resting'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${isVerified ? 'status-fulfilled' : 'status-active'}`}>
                            {isVerified ? 'Verified Active' : 'Pending Verification'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleVerify(donor)}
                            className={`btn-table-action ${isVerified ? 'revoke' : 'verify'}`}
                          >
                            {isVerified ? 'Revoke Verification' : 'Verify Clinical Credential'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-panel">
              <Search size={36} className="text-slate" />
              <h4>No registered donors matched the selected filters</h4>
            </div>
          )}
        </div>
      )}

      {/* 3. SEEKER MANAGEMENT TAB */}
      {activeTab === 'seekers' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Registered Blood Seekers &amp; Patient Accounts</h2>
              <p className="card-section-subtitle">
                Directory of patient families and hospital coordinators registered to submit emergency requisitions.
              </p>
            </div>
          </div>

          <div className="search-filter-card mb-5">
            <div className="input-box-wrap">
              <Search size={16} className="input-field-icon" />
              <input
                type="text"
                placeholder="Search seeker by name, email, phone, or state..."
                value={seekerSearch}
                onChange={(e) => setSeekerSearch(e.target.value)}
                className="scholarfind-input"
              />
            </div>
          </div>

          {filteredSeekers.length > 0 ? (
            <div className="history-table-wrapper">
              <table className="scholarfind-table">
                <thead>
                  <tr>
                    <th>Seeker Full Name</th>
                    <th>Email Address</th>
                    <th>Contact Phone</th>
                    <th>State &amp; District</th>
                    <th>Account Role</th>
                    <th>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSeekers.map(s => (
                    <tr key={s._id}>
                      <td>
                        <strong>{s.name}</strong>
                      </td>
                      <td className="text-secondary">{s.email}</td>
                      <td>{s.phone}</td>
                      <td>{s.district}, {s.state}</td>
                      <td>
                        <span className="badge-role-seeker">Blood Seeker</span>
                      </td>
                      <td>
                        <span className="status-pill status-fulfilled">Active Account</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-panel">
              <User size={36} className="text-slate" />
              <h4>No seeker accounts found matching criteria</h4>
            </div>
          )}
        </div>
      )}

      {/* 4. EMERGENCY REQUEST MANAGEMENT TAB */}
      {activeTab === 'requests' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Emergency Blood Request Management</h2>
              <p className="card-section-subtitle">
                Monitor live hospital blood requisitions, inspect urgency levels, and update fulfillment records.
              </p>
            </div>
          </div>

          <div className="search-filter-card mb-5">
            <div className="filter-row-grid">
              <div className="filter-field">
                <label className="input-label">Search Requisitions</label>
                <div className="input-box-wrap">
                  <Search size={16} className="input-field-icon" />
                  <input
                    type="text"
                    placeholder="Search patient, hospital, or blood group..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="filter-field">
                <label className="input-label">Status Filter</label>
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active Requisitions</option>
                  <option value="Fulfilled">Fulfilled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="history-table-wrapper">
              <table className="scholarfind-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Hospital &amp; City</th>
                    <th>Urgency Level</th>
                    <th>Contact Person</th>
                    <th>Current Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(r => (
                    <tr key={r._id}>
                      <td>
                        <strong>{r.patientName}</strong>
                      </td>
                      <td>
                        <span className="badge-bg">{r.bloodGroup}</span>
                      </td>
                      <td>{r.unitsNeeded} Bag(s)</td>
                      <td>
                        <div>{r.hospitalName}</div>
                        <div className="table-sub-detail">{r.district}, {r.state}</div>
                      </td>
                      <td>
                        <span className="urgency-pill-table">
                          {r.urgency}
                        </span>
                      </td>
                      <td>
                        <div>{r.contactName}</div>
                        <div className="table-sub-detail">{r.contactPhone}</div>
                      </td>
                      <td>
                        <span className={`status-pill status-${(r.status || 'Active').toLowerCase()}`}>
                          {r.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-status-btn-group">
                          {r.status !== 'Fulfilled' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateRequestStatus(r._id, 'Fulfilled')}
                              className="btn-status-fulfill"
                              title="Mark as Fulfilled"
                            >
                              Fulfill
                            </button>
                          )}
                          {r.status !== 'Active' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateRequestStatus(r._id, 'Active')}
                              className="btn-status-reactivate"
                              title="Re-open requisition"
                            >
                              Re-activate
                            </button>
                          )}
                          {r.status === 'Active' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateRequestStatus(r._id, 'Cancelled')}
                              className="btn-status-cancel"
                              title="Cancel requisition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-panel">
              <FileText size={36} className="text-slate" />
              <h4>No requisitions found matching criteria</h4>
            </div>
          )}
        </div>
      )}

      {/* 5. VERIFICATION QUEUE TAB */}
      {activeTab === 'verification' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Clinical Verification Queue</h2>
              <p className="card-section-subtitle">
                Priority review queue for recently registered voluntary donors awaiting clinical verification.
              </p>
            </div>
          </div>

          {unverifiedDonors.length > 0 ? (
            <div className="history-table-wrapper">
              <table className="scholarfind-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Blood Group</th>
                    <th>Contact Phone</th>
                    <th>District &amp; State</th>
                    <th>Clinical Status</th>
                    <th>Approval Action</th>
                  </tr>
                </thead>
                <tbody>
                  {unverifiedDonors.map(donor => (
                    <tr key={donor._id}>
                      <td>
                        <strong>{donor.user?.name || donor.name}</strong>
                      </td>
                      <td>
                        <span className="badge-bg">{donor.bloodGroup}</span>
                      </td>
                      <td>{donor.user?.phone || donor.phone}</td>
                      <td>{donor.district}, {donor.state}</td>
                      <td>
                        <span className="status-pill status-active">Awaiting Medical Verification</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleVerify(donor)}
                          className="btn-table-action verify"
                        >
                          <Check size={14} />
                          <span>Approve &amp; Verify Donor</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-panel">
              <CheckCircle size={36} className="text-emerald" />
              <h4>Verification Queue Clear</h4>
              <p>All registered voluntary donors have been verified and processed by administrative authorities.</p>
            </div>
          )}
        </div>
      )}

      {/* 6. HOSPITALS & BLOOD BANKS TAB */}
      {activeTab === 'hospitals' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Regional Hospital &amp; Blood Bank Directory (26 Facilities)</h2>
              <p className="card-section-subtitle">
                Verified government blood transfusion centers and major referral medical colleges.
              </p>
            </div>
          </div>

          <div className="search-filter-card mb-5">
            <div className="filter-field">
              <label className="input-label">Filter by State</label>
              <select
                value={hospitalStateFilter}
                onChange={(e) => setHospitalStateFilter(e.target.value)}
                className="scholarfind-input select-input"
              >
                <option value="ALL">All Indian States (26 Facilities)</option>
                {INDIAN_STATES.map(s => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <InteractiveMap facilities={filteredFacilities} />
          </div>

          <div className="hospitals-grid">
            {filteredFacilities.map(facility => (
              <HospitalCard key={facility._id} facility={facility} />
            ))}
          </div>
        </div>
      )}

      {/* 7. ADMIN SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h2 className="card-section-title">Administrator Security &amp; Credentials</h2>
              <p className="card-section-subtitle">
                System authentication controls, role-based security policies, and password updates.
              </p>
            </div>
          </div>

          {/* Current Admin Account Details */}
          <div className="profile-details-grid mb-6">
            <div className="profile-item">
              <span className="profile-label">Administrator Name</span>
              <strong className="profile-value">{user?.name || 'HemoConnect National Administrator'}</strong>
            </div>
            <div className="profile-item">
              <span className="profile-label">Authorized Email Address</span>
              <strong className="profile-value">{user?.email || 'admin@hemoconnect.gov.in'}</strong>
            </div>
            <div className="profile-item">
              <span className="profile-label">Access Authorization Role</span>
              <strong className="profile-value text-blue">System Administrator (Full Authority)</strong>
            </div>
            <div className="profile-item">
              <span className="profile-label">Authentication Token</span>
              <strong className="profile-value text-emerald">Signed JWT Session Active</strong>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="admin-password-box mt-6">
            <h3 className="card-section-title mb-2">Change Administrator Password</h3>
            <p className="card-section-subtitle mb-4">
              Update your account password securely. Passwords are encrypted with bcrypt (10 rounds) in MongoDB.
            </p>

            {passwordSuccess && (
              <div className="scholarfind-alert alert-success mb-4">
                <CheckCircle size={18} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="scholarfind-alert alert-error mb-4">
                <AlertCircle size={18} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="scholarfind-form max-w-xl">
              <div className="scholarfind-input-group mb-4">
                <label className="input-label">Current Password *</label>
                <div className="input-box-wrap">
                  <Lock size={17} className="input-field-icon" />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="scholarfind-input-group mb-4">
                <label className="input-label">New Password * (Minimum 6 characters)</label>
                <div className="input-box-wrap">
                  <Lock size={17} className="input-field-icon" />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    placeholder="Enter new strong password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="scholarfind-input-group mb-4">
                <label className="input-label">Confirm New Password *</label>
                <div className="input-box-wrap">
                  <Lock size={17} className="input-field-icon" />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="btn-toggle-show-pass"
                >
                  {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{showPasswords ? 'Hide passwords' : 'Show passwords'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="scholarfind-btn-primary"
              >
                <Save size={16} />
                <span>{passwordLoading ? 'Securing Password...' : 'Update Administrator Password'}</span>
              </button>
            </form>
          </div>

          {/* Server-Side Setup Process Information */}
          <div className="security-notice-panel mt-6">
            <h4 className="notice-title">Server-Side Admin Setup Instructions</h4>
            <p className="notice-text">
              Initial administrator accounts are created via the secure server-side script:
              <br />
              <code className="security-code">node src/scripts/setupAdmin.js &lt;email&gt; &lt;password&gt; [name]</code>
              <br />
              Public user registration for administrative accounts is restricted on the backend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};