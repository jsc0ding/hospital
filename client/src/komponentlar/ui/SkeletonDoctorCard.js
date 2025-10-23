import React from 'react';

const SkeletonDoctorCard = () => {
  return (
    <div className="doctor-card skeleton-card">
      <div className="doctor-image-container">
        <div className="skeleton-image"></div>
        <div className="doctor-overlay">
          <div className="skeleton-badge"></div>
        </div>
      </div>
      <div className="doctor-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-text specialty"></div>
        <div className="skeleton-text department"></div>
        <div className="doctor-stats">
          <div className="rating-container">
            <div className="skeleton-badge rating"></div>
            <div className="skeleton-badge experience"></div>
          </div>
        </div>
      </div>
      <div className="doctor-actions">
        <div className="doctor-card-buttons">
          <div className="skeleton-button details"></div>
          <div className="skeleton-button appointment"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDoctorCard;