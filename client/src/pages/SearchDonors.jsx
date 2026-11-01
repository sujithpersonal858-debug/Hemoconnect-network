import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, AlertCircle, Users, MapPin, CheckCircle } from 'lucide-react';
import { DonorCard } from '../components/DonorCard';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { BLOOD_COMPATIBILITY, getCompatibleDonorGroups } from '../utils/bloodCompatibility';
import { api } from '../services/api';

export const SearchDonors = () => {
  const [searchParams] = useSearchParams();

  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'ALL');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'ALL');
  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || 'ALL');
  const [availableOnly, setAvailableOnly] = useState(true);

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentStateObj = INDIAN_STATES.find(s => s.name === selectedState);
  const districtList = currentStateObj ? currentStateObj.districts : [];

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedState !== 'ALL') params.state = selectedState;
      if (selectedDistrict !== 'ALL') params.district = selectedDistrict;
      if (availableOnly) params.availableOnly = 'true';
      if (bloodGroup !== 'ALL') params.bloodGroup = bloodGroup;

      const res = await api.searchDonors(params);
      if (res && res.donors) {
        setDonors(res.donors);
      }
    } catch (err) {
      console.warn('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedState, selectedDistrict, bloodGroup, availableOnly]);

  const handleStateChange = (e) => {
    const st = e.target.value;
    setSelectedState(st);
    setSelectedDistrict('ALL');
  };

  return (
    <div className="scholarfind-dashboard-page">
      {/* Banner */}
      <div className="scholarfind-welcome-banner">
        <h1 className="welcome-heading">Find Compatible Blood Donors</h1>
        <p className="welcome-description">
          Search registered voluntary blood donors by required blood group, Indian state, and district. Only available, active donors with verified contact details are listed.
        </p>
      </div>

      {/* Filter Card */}
      <div className="scholarfind-section-card mb-6">
        <div className="card-heading-row">
          <div>
            <h3 className="card-section-title">Donor Filter Parameters</h3>
            <p className="card-section-subtitle">Select blood group and regional district to filter results.</p>
          </div>
          <button
            type="button"
            onClick={fetchDonors}
            className="scholarfind-btn-primary btn-sm"
          >
            <RefreshCw size={14} />
            <span>Refresh Results</span>
          </button>
        </div>

        <div className="search-filter-card">
          <div className="filter-row-grid four-cols">
            <div className="filter-field">
              <label className="input-label">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="scholarfind-input select-input"
              >
                <option value="ALL">All Blood Groups</option>
                {ALL_BLOOD_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label className="input-label">State:</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="scholarfind-input select-input"
              >
                <option value="ALL">All Indian States</option>
                {INDIAN_STATES.map(s => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label className="input-label">District / City:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={selectedState === 'ALL'}
                className="scholarfind-input select-input"
              >
                <option value="ALL">All Districts</option>
                {districtList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="filter-field filter-checkbox-field">
              <label className="input-label">Availability Filter:</label>
              <label className="checkbox-toggle-label">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <span>Available Donors Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="scholarfind-section-card">
        <div className="card-heading-row">
          <div>
            <h3 className="card-section-title">Matching Voluntary Donors ({donors.length})</h3>
            <p className="card-section-subtitle">
              Contact verified voluntary donors directly for emergency hospital requirements.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state-box">Loading matching donors...</div>
        ) : donors.length > 0 ? (
          <div className="donors-cards-grid">
            {donors.map(donor => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className="empty-state-panel">
            <AlertCircle size={36} className="text-red-accent" />
            <h4>No voluntary donors found matching selected criteria</h4>
            <p>Try selecting "All Blood Groups" or expanding to all districts.</p>
          </div>
        )}
      </div>
    </div>
  );
};
