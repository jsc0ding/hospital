import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../komponentlar/ui/DoctorCard';
import SkeletonDoctorCard from '../komponentlar/ui/SkeletonDoctorCard';
import ErrorDisplay from '../komponentlar/utility/ErrorDisplay';
import { fetchDoctors } from '../yordamchi_funksiyalar/api';
import '../uslublar/new-design.css'; // Import main styles
import '../uslublar/components.css'; // Import component styles

// Preload images for better performance with error handling
const preloadImages = (doctors) => {
  doctors.forEach(doctor => {
    if (doctor.image) {
      const img = new Image();
      img.src = doctor.image;
    }
  });
};

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const departmentFilter = searchParams.get('department');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const doctorsData = await fetchDoctors();
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      preloadImages(doctorsData);
    } catch (err) {
      setError(`Shifokorlar ro'yxatini yuklashda xatolik yuz berdi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...doctors];
    
    // Filter out specific doctor by ID or other criteria
    // Example: result = result.filter(doctor => doctor._id !== 'specific-doctor-id');
    // Example: result = result.filter(doctor => doctor.name !== 'Doctor Name to Remove');
    
    if (departmentFilter && departmentFilter !== 'all') {
      result = result.filter(doctor => doctor.department === departmentFilter);
    }
    
    result.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    
    setFilteredDoctors(result);
  }, [doctors, departmentFilter]);

  const departments = [
    { id: 'all', name: 'Barcha bo\'limlar' },
    { id: 'bolalar', name: 'Bolalar shifokori' },
    { id: 'dermatologiya', name: 'Dermatologiya' },
    { id: 'endokrinologiya', name: 'Endokrinologiya' },
    { id: 'fizioterapiya', name: 'Fizioterapiya' },
    { id: 'gastroenterologiya', name: 'Gastroenterologiya' },
    { id: 'ginekologiya', name: 'Ginekologiya' },
    { id: 'kardiologiya', name: 'Kardiologiya' },
    { id: 'lor', name: 'LOR' },
    { id: 'massaj', name: 'Massaj' },
    { id: 'nevrologiya', name: 'Nevrologiya' },
    { id: 'onkologiya', name: 'Onkologiya' },
    { id: 'oftalmologiya', name: 'Oftalmologiya' },
    { id: 'ortopediya', name: 'Ortopediya' },
    { id: 'rentgenologiya', name: 'Rentgenologiya' },
    { id: 'stomatologiya', name: 'Stomatologiya' },
    { id: 'terapevt', name: 'Terapevt' },
    { id: 'urologiya', name: 'Urologiya' }
  ];

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    loadDoctors();
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor._id === selectedDoctor ? null : doctor._id);
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    if (selectedDept === 'all') {
      searchParams.delete('department');
    } else {
      searchParams.set('department', selectedDept);
    }
    setSearchParams(searchParams);
  };

  // Show loading state with skeleton cards
  if (loading) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="section-head">
            <h2>Bizning Mutaxassislarimiz</h2>
            <p>Klinikamizdagi barcha shifokorlar bilan tanishing</p>
          </div>
          
          <div className="filters-section mb-4">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-4">
                <div className="filter-card">
                  <div className="filter-header">
                    <h5 className="mb-0">
                      <i className="fas fa-filter me-2"></i>
                      Bo'lim bo'yicha filtrlash
                    </h5>
                  </div>
                  <div className="filter-body">
                    <select 
                      className="form-select"
                      value={departmentFilter || 'all'} 
                      onChange={handleDepartmentChange}
                      disabled={true}
                    >
                      {departments.map(dept => (
                        <option 
                          key={dept.id} 
                          value={dept.id}
                        >
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Responsive grid for skeleton cards */}
          <div className="row">
            {[...Array(26)].map((_, index) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                <div className="doctor-grid-item">
                  <SkeletonDoctorCard />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-5">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

  // Show doctors
  return (
    <div className="page-content">
      <div className="container">
        <div className="section-head">
          <h2>Bizning Mutaxassislarimiz</h2>
          <p>Klinikamizdagi barcha shifokorlar bilan tanishing</p>
        </div>
        
        <div className="filters-section mb-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="filter-card">
                <div className="filter-header">
                  <h5 className="mb-0">
                    <i className="fas fa-filter me-2"></i>
                    Bo'lim bo'yicha filtrlash
                  </h5>
                </div>
                <div className="filter-body">
                  <select 
                    className="form-select"
                    value={departmentFilter || 'all'} 
                    onChange={handleDepartmentChange}
                    disabled={loading}
                  >
                    {departments.map(dept => (
                      <option 
                        key={dept.id} 
                        value={dept.id}
                      >
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {filteredDoctors.length > 0 ? (
          // Responsive grid for doctor cards - 1 column on mobile
          <div className="row">
            {filteredDoctors.slice(0, 26).map((doctor) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={doctor._id || doctor.id}>
                <DoctorCard 
                  doctor={doctor} 
                  onClick={handleDoctorClick}
                  isSelected={doctor._id === selectedDoctor}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="col-12">
            <div className="text-center my-5">
              <div className="alert alert-info">
                <div className="alert-icon mb-3">
                  <i className="fas fa-user-md fa-3x"></i>
                </div>
                <h4 className="alert-heading">Shifokor topilmadi!</h4>
                <p className="mb-4">Iltimos, boshqa qidiruv so'rovini kiriting yoki barcha bo'limlarni ko'rish uchun filtrlarni tozalang.</p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button className="btn btn-primary btn-lg" onClick={loadDoctors}>
                    <i className="fas fa-sync me-2"></i>
                    Qayta urinish
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => {
                    searchParams.delete('department');
                    setSearchParams(searchParams);
                  }}>
                    <i className="fas fa-times-circle me-2"></i>
                    Filtrlarni tozalash
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;