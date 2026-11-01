import React, { useState } from 'react';
import { BloodGroupBadge } from './BloodGroupBadge';
import { MapPin, Phone, CheckCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const DonorCard = ({ donor }) => {
  const [showContact, setShowContact] = useState(false);

  const userName = donor.user?.name || donor.name || 'Anonymous Donor';
  const phone = donor.user?.phone || donor.phone || 'Available upon request';
  const isVerified = donor.user?.isVerified || donor.isVerified;
  const isDemo = donor.user?.isDemoRecord || donor.isDemoRecord;

  return (
    <div className={`donor-card ${donor.isAvailable ? 'available' : 'unavailable'}`}>
      <div className="donor-card-header">
        <div className="donor-identity">
          <BloodGroupBadge group={donor.bloodGroup} size="lg" />
          <div>
            <div className="name-row">
              <h4 className="donor-name">{userName}</h4>
              {isVerified && (
                <span className="verified-pill" title="Identity Verified Donor">
                  <CheckCircle size={13} /> Verified
                </span>
              )}
            </div>
            <div className="donor-loc">
              <MapPin size={13} />
              <span>{donor.district}, {donor.state}</span>
            </div>
          </div>
        </div>

        <div className="donor-status-col">
          <span className={`status-badge ${donor.isAvailable ? 'status-online' : 'status-offline'}`}>
            <span className="dot"></span>
            {donor.isAvailable ? 'Available Now' : 'Resting'}
          </span>
          {isDemo && (
            <span className="demo-tag" title="Demonstration Test Record">
              Demo Sample
            </span>
          )}
        </div>
      </div>

      <div className="donor-meta-grid">
        <div className="meta-item">
          <span className="meta-label">Age &amp; Gender</span>
          <span className="meta-val">{donor.age || 26} yrs &bull; {donor.gender || 'Not specified'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Total Donations</span>
          <span className="meta-val">{donor.donationsCount || 0} times</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Last Donated</span>
          <span className="meta-val">
            {donor.lastDonationDate
              ? new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
              : 'First time volunteer'}
          </span>
        </div>
      </div>

      <div className="donor-card-footer">
        {showContact ? (
          <div className="contact-revealed">
            <a href={`tel:${phone}`} className="btn btn-call">
              <Phone size={15} />
              <span>Call {phone}</span>
            </a>
            <small className="contact-notice">Please confirm patient requirement and hospital location before calling.</small>
          </div>
        ) : (
          <button
            onClick={() => setShowContact(true)}
            className="btn btn-contact-donor"
            disabled={!donor.isAvailable}
          >
            <Phone size={15} />
            <span>{donor.isAvailable ? 'Connect with Donor' : 'Currently Unavailable'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
