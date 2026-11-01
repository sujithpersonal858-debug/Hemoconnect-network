import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="unauthorized-page container">
      <div className="unauthorized-card">
        <div className="icon-shield-wrap">
          <ShieldAlert size={48} className="text-red" />
        </div>
        <h1>403 - Restricted Access</h1>
        <p>
          You do not have the required administrative permissions to access this control portal.
          This section is strictly restricted to certified platform administrators.
        </p>
        <div className="unauthorized-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Return to Home</span>
          </Link>
          <Link to="/login" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Sign In with Different Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
