import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Search,
  Building2,
  ShieldCheck,
  Activity,
  CheckCircle,
  Clock,
  Phone,
  ArrowRight,
  Droplet,
  UserPlus
} from 'lucide-react';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { BLOOD_COMPATIBILITY, ALL_BLOOD_GROUPS } from '../utils/bloodCompatibility';
import { INDIAN_STATES } from '../utils/indianLocations';
import { api } from '../services/api';

export const Home = () => {
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchUrgent = async () => {
      try {
        const res = await api.getRequests({ urgency: 'Critical - Immediate' });
        if (res && res.requests) {
          setUrgentRequests(res.requests.slice(0, 3));
        }
      } catch (err) {
        console.warn('Failed to load urgent requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchUrgent();
  }, []);

  const currentCompat = BLOOD_COMPATIBILITY[selectedGroup] || BLOOD_COMPATIBILITY['O+'];

  return (
    <div className="scholarfind-dashboard-page">
      {/* ScholarFind-styled Hero Banner */}
      <div className="scholarfind-welcome-banner">
        <h1 className="welcome-heading">Welcome to HemoConnect!</h1>
        <p className="welcome-description">
          HemoConnect is a national blood donor matching and emergency assistance network connecting voluntary donors with patients across 15 Indian states, with dedicated coverage in Telangana, Andhra Pradesh, Maharashtra, Karnataka, and Tamil Nadu.
        </p>

        {/* Action Buttons */}
        <div className="hero-btn-row mt-4">
          <Link to="/search" className="scholarfind-btn-primary">
            <Search size={16} />
            <span>Find Blood Donors</span>
          </Link>
          <Link to="/emergency-sos" className="btn-emergency-action">
            <AlertCircle size={16} />
            <span>Post Emergency Request</span>
          </Link>
          <Link to="/register?role=donor" className="btn-secondary-action">
            <UserPlus size={16} />
            <span>Register as Donor</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="scholarfind-stats-row">
        <div className="scholarfind-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-wrap icon-blue">
              <Droplet size={20} />
            </span>
            <span className="stat-number">8 / 8</span>
          </div>
          <span className="stat-label">Blood Groups Supported</span>
        </div>

        <div className="scholarfind-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-wrap icon-emerald">
              <ShieldCheck size={20} />
            </span>
            <span className="stat-number">15</span>
          </div>
          <span className="stat-label">States Covered</span>
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
              <AlertCircle size={20} />
            </span>
            <span className="stat-number stat-badge status-active">24/7 SOS</span>
          </div>
          <span className="stat-label">Emergency Helplines (112/104)</span>
        </div>
      </div>

      {/* Critical SOS Broadcasts Section */}
      <div className="scholarfind-section-card mb-6">
        <div className="card-heading-row">
          <div>
            <h2 className="card-section-title">Critical Blood Requisitions</h2>
            <p className="card-section-subtitle">
              Urgent hospital requirements needing immediate blood donor response within 0-6 hours.
            </p>
          </div>
          <Link to="/emergency-sos" className="scholarfind-link-action">
            <span>View All Requisitions</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loadingRequests ? (
          <div className="loading-state-box">Loading active emergency requisitions...</div>
        ) : urgentRequests.length > 0 ? (
          <div className="emergency-cards-grid">
            {urgentRequests.map(req => (
              <EmergencySOSCard key={req._id} request={req} />
            ))}
          </div>
        ) : (
          <div className="empty-state-panel">
            <CheckCircle size={36} className="text-emerald" />
            <h4>No critical emergencies pending in your immediate area right now</h4>
            <p>Voluntary donors remain on standby for emergency dispatches.</p>
          </div>
        )}
      </div>

      {/* Blood Group Compatibility Engine Section */}
      <div className="scholarfind-section-card mb-6">
        <div className="card-heading-row">
          <div>
            <h2 className="card-section-title">Blood Group Transfusion Compatibility Guide</h2>
            <p className="card-section-subtitle">
              Select any blood group below to inspect transfusion compatibility matrices and population prevalence.
            </p>
          </div>
        </div>

        {/* Group Selector Pills */}
        <div className="blood-groups-pill-grid mb-5">
          {ALL_BLOOD_GROUPS.map(group => (
            <button
              key={group}
              type="button"
              onClick={() => setSelectedGroup(group)}
              className={`blood-pill-btn ${selectedGroup === group ? 'active' : ''}`}
            >
              <span>{group}</span>
            </button>
          ))}
        </div>

        {/* Compatibility Details Card */}
        <div className="compat-breakdown-box">
          <div className="compat-top-header">
            <div className="compat-badge-row">
              <span className="compat-main-tag">{selectedGroup}</span>
              <span className="compat-rarity-pill">{currentCompat.rarity}</span>
            </div>
            <p className="compat-summary-notes">{currentCompat.notes}</p>
          </div>

          <div className="compat-grid-2col">
            <div className="compat-box can-receive-box">
              <h4 className="compat-box-title">Can Safely Receive From:</h4>
              <div className="compat-chips-row">
                {currentCompat.canReceiveFrom.map(g => (
                  <span key={g} className="compat-badge-pill">{g}</span>
                ))}
              </div>
            </div>

            <div className="compat-box can-donate-box">
              <h4 className="compat-box-title">Can Safely Donate To:</h4>
              <div className="compat-chips-row">
                {currentCompat.canDonateTo.map(g => (
                  <span key={g} className="compat-badge-pill donate">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
