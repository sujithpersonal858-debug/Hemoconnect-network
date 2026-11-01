import React from 'react';

export const BloodGroupBadge = ({ group, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
    xl: 'badge-xl'
  };

  return (
    <div className={`blood-badge ${sizeClasses[size] || 'badge-md'} ${className}`}>
      <span className="drop-icon">🩸</span>
      <span className="group-text">{group}</span>
    </div>
  );
};
