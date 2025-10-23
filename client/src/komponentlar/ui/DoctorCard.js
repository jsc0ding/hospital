import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDepartmentName, getDoctorImage } from '../../konstantalar';

/**
 * Component to display doctor information in a card format
 * @param {Object} doctor - Doctor object containing all doctor information
 * @param {Function} onClick - Function to call when card is clicked
 * @param {Boolean} isSelected - Whether the card is currently selected
 */
const DoctorCard = ({ doctor, onClick, isSelected }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    // Removed the selection logic to prevent layout changes
    // Just navigate to doctor details page
    // if (onClick) {
    //   onClick(doctor);
    // }
  };

  // Ensure we have a valid doctor ID (handle both _id and id properties)
  const doctorId = doctor._id || doctor.id;

  return (
    <div className={`doctor-card ${isSelected ? 'border-primary' : ''}`} onClick={handleClick}>
      <div className="doctor-image-container">
        <img
          src={imageError || !doctor.image ? getDoctorImage(0, doctorId) : doctor.image}
          alt={doctor.name}
          onError={handleImageError}
          className="doctor-image"
          loading="lazy"
        />
        <div className="doctor-overlay">
          <span className="specialist-badge">Mutaxassis</span>
        </div>
      </div>
      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty || 'Shifokor'}</p>
        <p className="doctor-department">
          <i className="fas fa-stethoscope me-2"></i>
          {getDepartmentName(doctor.department)}
        </p>
        <div className="doctor-stats">
          <div className="rating-container">
            <span className="rating-badge">
              <i className="fas fa-star me-1"></i> {doctor.rating}
            </span>
            <span className="experience-badge">
              <i className="fas fa-briefcase me-1"></i> {doctor.experience}
            </span>
          </div>
        </div>
      </div>

      <div className="doctor-actions">
        <div className="doctor-card-buttons">
          <Link
            to={`/doctor/${doctorId}`}
            className="btn btn-details"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-info-circle me-2"></i> Batafsil
          </Link>
          <Link
            to="/appointment-queue"
            className="btn btn-appointment"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-calendar-check me-2"></i> Navbat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;