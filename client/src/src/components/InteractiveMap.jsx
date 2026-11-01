import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Building, Phone, AlertCircle, Compass, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { INDIAN_STATES } from '../utils/indianLocations';

export const InteractiveMap = ({
  facilities = [],
  selectedState = 'ALL',
  onStateChange,
  onSelectFacility
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFacility, setActiveFacility] = useState(null);
  const [internalState, setInternalState] = useState(selectedState);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setInternalState(selectedState);
  }, [selectedState]);

  // Filter facilities
  const filteredFacilities = facilities.filter(f => {
    const matchState = internalState === 'ALL' || f.state?.toLowerCase() === internalState.toLowerCase();
    const matchCat = categoryFilter === 'ALL' || f.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchState && matchCat;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    let checkTimer;

    const initLeaflet = () => {
      if (!window.L) {
        checkTimer = setTimeout(initLeaflet, 100);
        return;
      }

      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const L = window.L;

        // Create Leaflet map centered at India
        const map = L.map(mapContainerRef.current, {
          center: [20.5937, 78.9629],
          zoom: 5,
          zoomControl: false // custom controls rendered in UI
        });

        // Real OpenStreetMap Tile Layer (shows real geographic boundaries, states, cities)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const markersLayer = L.featureGroup().addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
        setMapReady(true);
      }
    };

    initLeaflet();

    return () => {
      if (checkTimer) clearTimeout(checkTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Markers when facilities or filters change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersLayerRef.current || !window.L) return;

    const L = window.L;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const bounds = [];

    filteredFacilities.forEach(facility => {
      const lat = Number(facility.latitude);
      const lng = Number(facility.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      // Category specific marker styling
      const isBloodBank = facility.category?.toLowerCase().includes('blood');
      const isEmergency = facility.category?.toLowerCase().includes('emergency');
      
      const markerClass = isBloodBank
        ? 'custom-marker blood-bank-marker'
        : isEmergency
        ? 'custom-marker emergency-marker'
        : 'custom-marker hospital-marker';

      const markerLetter = isBloodBank ? 'BB' : isEmergency ? 'SOS' : 'H';

      const customIcon = L.divIcon({
        className: 'leaflet-custom-div-icon',
        html: `<div class="${markerClass}"><span>${markerLetter}</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const bloodGroupsHtml = facility.availableBloodGroups?.length
        ? `<div class="popup-chips">${facility.availableBloodGroups.map(g => `<span class="popup-chip">${g}</span>`).join('')}</div>`
        : '';

      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-header">
            <span class="popup-category-badge">${facility.category || 'Hospital'}</span>
            ${facility.emergencyAvailable24x7 ? '<span class="popup-24x7">24/7 Transfusion</span>' : ''}
          </div>
          <h4 class="popup-title">${facility.name}</h4>
          <p class="popup-address">${facility.address}</p>
          <div class="popup-location"><strong>${facility.district}</strong>, ${facility.state}</div>
          ${bloodGroupsHtml}
          <div class="popup-action-row">
            <a href="tel:${facility.contactPhone}" class="popup-call-link">
              Call ${facility.contactPhone}
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setActiveFacility(facility);
        if (onSelectFacility) onSelectFacility(facility);
      });

      markersLayer.addLayer(marker);
    });

    // Auto zoom/fit bounds if we have coordinates
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        mapInstanceRef.current.setView(bounds[0], 12);
      } else {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    } else {
      mapInstanceRef.current.setView([20.5937, 78.9629], 5);
    }
  }, [filteredFacilities, mapReady]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    setInternalState('ALL');
    setCategoryFilter('ALL');
    if (onStateChange) onStateChange('ALL');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([20.5937, 78.9629], 5);
    }
  };

  const handleStateSelect = (e) => {
    const val = e.target.value;
    setInternalState(val);
    if (onStateChange) onStateChange(val);
  };

  return (
    <div className="interactive-geographical-map-card">
      {/* Map Control Toolbar */}
      <div className="map-toolbar">
        <div className="map-toolbar-left">
          <div className="map-toolbar-title">
            <Compass size={18} className="text-blue" />
            <span>Regional Blood Facilities Map</span>
          </div>
          <span className="map-facility-count-badge">
            {filteredFacilities.length} Verified Facilities
          </span>
        </div>

        <div className="map-toolbar-controls">
          <select
            value={internalState}
            onChange={handleStateSelect}
            className="map-filter-select"
          >
            <option value="ALL">All Indian States</option>
            {INDIAN_STATES.map(s => (
              <option key={s.code} value={s.name}>{s.name}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="map-filter-select"
          >
            <option value="ALL">All Facility Types</option>
            <option value="Hospital">Hospitals</option>
            <option value="Blood Bank">Blood Banks</option>
          </select>

          <div className="map-zoom-buttons">
            <button
              type="button"
              onClick={handleZoomIn}
              className="map-ctrl-btn"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="map-ctrl-btn"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="map-ctrl-btn"
              title="Reset Map View"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="leaflet-map-wrapper">
        <div ref={mapContainerRef} className="leaflet-map-surface" style={{ height: '420px', width: '100%' }}></div>

        {/* Legend */}
        <div className="map-floating-legend">
          <div className="legend-chip">
            <span className="legend-pin blue-pin">H</span>
            <span>Hospital</span>
          </div>
          <div className="legend-chip">
            <span className="legend-pin red-pin">BB</span>
            <span>Blood Bank</span>
          </div>
          <div className="legend-chip">
            <span className="legend-pin amber-pin">SOS</span>
            <span>Emergency Hub</span>
          </div>
        </div>
      </div>

      {/* Selected Facility Bottom Panel */}
      {activeFacility && (
        <div className="active-facility-banner">
          <div className="facility-banner-details">
            <div className="facility-banner-tag">
              <Building size={14} />
              <span>{activeFacility.category}</span>
            </div>
            <strong>{activeFacility.name}</strong>
            <p>{activeFacility.address} &bull; {activeFacility.district}, {activeFacility.state}</p>
          </div>
          <div className="facility-banner-actions">
            <a href={`tel:${activeFacility.contactPhone}`} className="btn btn-primary btn-sm">
              <Phone size={14} />
              <span>Call {activeFacility.contactPhone}</span>
            </a>
            <button
              onClick={() => setActiveFacility(null)}
              className="btn btn-ghost btn-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
