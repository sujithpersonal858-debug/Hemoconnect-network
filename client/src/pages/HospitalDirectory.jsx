import React, { useState, useEffect } from 'react';
import { Building2, Search, Map, List, AlertCircle, Phone, Compass, MapPin } from 'lucide-react';
import { HospitalCard } from '../components/HospitalCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { INDIAN_STATES } from '../utils/indianLocations';
import { api, VERIFIED_HOSPITALS_26 } from '../services/api';

export const HospitalDirectory = () => {
  const [facilities, setFacilities] = useState(VERIFIED_HOSPITALS_26);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('both'); // 'cards', 'map', 'both'

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedState !== 'ALL') params.state = selectedState;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;

      const res = await api.getHospitals(params);
      if (res && res.facilities && res.facilities.length > 0) {
        setFacilities(res.facilities);
      } else {
        setFacilities(VERIFIED_HOSPITALS_26);
      }
    } catch (err) {
      console.warn('Using local verified hospital list:', err);
      setFacilities(VERIFIED_HOSPITALS_26);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [selectedState, selectedCategory]);

  const filteredFacilities = facilities.filter(f => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.district?.toLowerCase().includes(term) ||
      f.address?.toLowerCase().includes(term) ||
      f.state?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="scholarfind-dashboard-page">
      {/* Directory Header Banner */}
      <div className="scholarfind-welcome-banner">
        <div className="banner-title-flex">
          <div>
            <h1 className="welcome-heading">Hospitals &amp; Regional Blood Banks Directory</h1>
            <p className="welcome-description">
              Verified clinical healthcare centers, emergency trauma response units, and 24/7 blood banks across India,
              including Telangana, Andhra Pradesh, Maharashtra, Karnataka, Tamil Nadu, and priority states.
            </p>
          </div>
          {/* View Mode Toggle Buttons */}
          <div className="view-mode-toggle-group">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`btn-view-toggle ${viewMode === 'both' ? 'active' : ''}`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`btn-view-toggle ${viewMode === 'map' ? 'active' : ''}`}
            >
              <Map size={15} />
              <span>Map View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`btn-view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
            >
              <List size={15} />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Geographical Map */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <div className="scholarfind-section-card mb-6">
          <InteractiveMap
            facilities={facilities}
            selectedState={selectedState}
            onStateChange={(st) => setSelectedState(st)}
            onSelectFacility={(fac) => setSearchTerm(fac.district)}
          />
        </div>
      )}

      {/* Directory Filter Toolbar & Cards */}
      {(viewMode === 'both' || viewMode === 'cards') && (
        <div className="scholarfind-section-card">
          <div className="card-heading-row">
            <div>
              <h3 className="card-section-title">Directory Facilities ({filteredFacilities.length})</h3>
              <p className="card-section-subtitle">
                Inspect 24x7 emergency contacts, available blood units, and clinical coordinates.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="search-filter-card mb-6">
            <div className="filter-row-grid">
              <div className="filter-field">
                <label className="input-label">Search Facility Name or City</label>
                <div className="input-box-wrap">
                  <Search size={16} className="input-field-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Osmania, King George, Apollo, Pune..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="scholarfind-input"
                  />
                </div>
              </div>

              <div className="filter-field">
                <label className="input-label">Filter by State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Indian States (26 facilities)</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label className="input-label">Facility Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="scholarfind-input select-input"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Hospital">Hospitals</option>
                  <option value="Blood Bank">Blood Banks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="loading-state-box">Loading healthcare facilities...</div>
          ) : filteredFacilities.length > 0 ? (
            <div className="hospitals-grid">
              {filteredFacilities.map(facility => (
                <HospitalCard key={facility._id} facility={facility} />
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <AlertCircle size={36} className="text-red-accent" />
              <h4>No facilities found matching filters</h4>
              <p>Try resetting the state filter or clearing your search keywords.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setSelectedState('ALL'); setSelectedCategory('ALL'); }}
                className="scholarfind-btn-primary mt-3"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
