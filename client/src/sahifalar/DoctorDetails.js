import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDoctors } from '../yordamchi_funksiyalar/api';
import SkeletonLoader from '../komponentlar/ui/SkeletonLoader';
import { getDepartmentName, DEFAULT_IMAGES } from '../konstantalar';
import '../uslublar/new-design.css';
// import '../uslublar/doctors-section.css'; // This file is deprecated

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDoctors();
      
      // Find the specific doctor
      const foundDoctor = data.find(doc => String(doc._id) === String(doctorId));
      setDoctor(foundDoctor || null);
    } catch (err) {
      // Error handling is already in the API utility
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [doctorId]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <section className="doctor-details-page py-5 page-content">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <SkeletonLoader type="text" width="60%" height="1.5rem" className="mb-3" />
              <SkeletonLoader type="text" width="40%" height="1rem" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!doctor) {
    return (
      <section className="doctor-details-page py-5 page-content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning text-center">
                <h4 className="alert-heading">Shifokor topilmadi!</h4>
                <p>So'ralgan shifokor ma'lumotlari mavjud emas.</p>
                <Link to="/doctors" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>Shifokorlar ro'yxatiga qaytish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="doctor-details-page py-5 page-content">
      <div className="container">
        <div className="row">
          <div className="col-12 mb-4">
            <Link to="/doctors" className="btn btn-outline">
              <i className="fas fa-arrow-left me-2"></i>Shifokorlar ro'yxatiga qaytish
            </Link>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title mb-4">{doctor.name}</h1>
                
                <div className="mb-4 p-3" style={{ backgroundColor: 'rgba(30, 144, 255, 0.1)', borderRadius: 'var(--border-radius)' }}>
                  <h5 className="mb-3">
                    <i className="fas fa-building me-2"></i> Bo'lim
                  </h5>
                  <p className="fs-5 mb-0">{getDepartmentName(doctor.department)}</p>
                </div>
                
                <div className="mb-4 p-3" style={{ backgroundColor: 'rgba(30, 144, 255, 0.1)', borderRadius: 'var(--border-radius)' }}>
                  <h5 className="mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i> Manzil
                  </h5>
                  <p className="fs-5 mb-0">{doctor.address}</p>
                </div>
                
                <div className="mb-4 p-3" style={{ backgroundColor: 'rgba(30, 144, 255, 0.1)', borderRadius: 'var(--border-radius)' }}>
                  <h5 className="mb-3">
                    <i className="fas fa-clock me-2"></i> Qabul vaqtlari
                  </h5>
                  <p className="fs-5 mb-0">{doctor.workingHours}</p>
                </div>
                
                <div className="mb-4 p-3" style={{ backgroundColor: 'rgba(30, 144, 255, 0.1)', borderRadius: 'var(--border-radius)' }}>
                  <h5 className="mb-3">
                    <i className="fas fa-info-circle me-2"></i> Qisqacha ma'lumot
                  </h5>
                  <p className="fs-5 mb-0">{doctor.description}</p>
                </div>
                
                <div className="mt-5">
                  <Link 
                    to="/appointment-queue" 
                    className="btn"
                  >
                    <i className="fas fa-calendar-check me-2"></i> Navbatga yozilish
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="card">
              <div className="card-body text-center p-4">
                <div className="doctor-image-container mb-4">
                  <img 
                    src={imageError || !doctor.image ? DEFAULT_IMAGES.DOCTOR : doctor.image} 
                    className="img-fluid rounded-circle" 
                    alt={doctor.name}
                    onError={handleImageError}
                    style={{ width: '250px', height: '250px', objectFit: 'cover', border: '5px solid var(--border-color)' }}
                  />
                </div>
                <h2 className="card-title mb-2">{doctor.name}</h2>
                <p className="mb-3 fs-5">{doctor.specialty}</p>
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <span className="badge badge-primary fs-6 py-2 px-3">
                    <i className="fas fa-star me-2"></i>
                    {doctor.rating}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="mb-1">
                    <i className="fas fa-briefcase me-2"></i>
                    Tajriba: {doctor.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;