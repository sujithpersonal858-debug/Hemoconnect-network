import React from 'react';
import { Building2, MapPin, Phone, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export const HospitalCard = ({ facility, onSelectOnMap }) => {
  const isDemo = facility.isDemoRecord;

  return (
    <div className="hospital-card">
      <div className="hosp-card-header">
        <div className="category-pill">{facility.category || 'Hospital'}</div>
        <div className="badges-group">
          {facility.emergencyAvailable24x7 && (
            <span className="badge-24x7">
              <Clock size={12} /> 24x7 Emergency
            </span>
          )}
          {isDemo && <span className="demo-tag">Demonstration Sample</span>}
        </div>
      </div>

      <h3 className="hospital-title">{facility.name}</h3>

      <div className="hosp-address-row">
        <MapPin size={15} className="text-red shrink-0" />
        <span className="address-text">{facility.address}</span>
      </div>

      <div className="hosp-location-chips">
        <span className="chip">{facility.district}</span>
        <span className="chip">{facility.state}</span>
      </div>

      {facility.availableBloodGroups && facility.availableBloodGroups.length > 0 && (
        <div className="hosp-blood-groups">
          <span className="bg-label">Available Blood Groups:</span>
          <div className="groups-list">
            {facility.availableBloodGroups.map((g) => (
              <span key={g} className="mini-bg-chip">{g}</span>
            ))}
          </div>
        </div>
      )}

      {facility.disclaimer && (
        <div className="hosp-disclaimer">
          <small>{facility.disclaimer}</small>
        </div>
      )}

      <div className="hosp-card-footer">
        <a href={`tel:${facility.contactPhone}`} className="btn btn-call-hosp">
          <Phone size={14} />
          <span>Call {facility.contactPhone}</span>
        </a>

        {onSelectOnMap && (
          <button onClick={() => onSelectOnMap(facility)} className="btn btn-view-map">
            <MapPin size={14} />
            <span>Locate</span>
          </button>
        )}
      </div>
    </div>
  );
};
