import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="scholarfind-footer">
      <div className="footer-inner-grid">
        {/* Col 1 */}
        <div className="footer-col brand-col">
          <div className="footer-logo-plain">
            <span className="brand-plain-title">HemoConnect</span>
          </div>
          <p className="footer-desc">
            A dedicated Blood Donor Matching and Emergency Assistance network connecting voluntary blood donors with verified patients, critical hospitals, and regional blood banks across India.
          </p>
          <div className="emergency-callout-pill">
            <Phone size={14} />
            <span>National Emergency Helpline: <strong>112</strong> / <strong>104</strong></span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="footer-col">
          <h4>Priority Coverage</h4>
          <ul className="footer-links">
            <li>Andhra Pradesh (Visakhapatnam, Vijayawada, Guntur)</li>
            <li>Telangana (Hyderabad, Warangal, Nizamabad)</li>
            <li>Maharashtra (Mumbai, Pune, Nagpur, Nashik)</li>
            <li>Karnataka (Bengaluru, Mysuru, Hubli-Dharwad)</li>
            <li>Tamil Nadu, Kerala, Gujarat, Delhi NCR &amp; more</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="footer-col">
          <h4>Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/search">Find Blood Donors</Link></li>
            <li><Link to="/emergency-sos">Broadcast Emergency SOS</Link></li>
            <li><Link to="/hospitals">Hospital &amp; Blood Bank Directory</Link></li>
            <li><Link to="/register">Register as Voluntary Donor</Link></li>
            <li><Link to="/login">Sign In to Portal</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="footer-col">
          <h4>Medical &amp; Ethical Notice</h4>
          <div className="footer-notice-box">
            <AlertTriangle size={16} className="text-red-accent" />
            <p>
              Blood donation in India is strictly non-remunerated and voluntary under the National Blood Policy. Selling or buying blood is illegal under the Drugs and Cosmetics Act.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-copyright-row">
        <p>&copy; {new Date().getFullYear()} HemoConnect. All Rights Reserved. Built for humanitarian emergency assistance.</p>
        <div className="footer-shield-tags">
          <span className="badge-shield"><ShieldCheck size={14} /> 8 Blood Groups Supported</span>
          <span className="badge-shield"><ShieldCheck size={14} /> 15 Indian States Covered</span>
        </div>
      </div>
    </footer>
  );
};
