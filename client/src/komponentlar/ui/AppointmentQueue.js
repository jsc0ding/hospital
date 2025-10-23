import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../konstantalar';
import SkeletonLoader from '../ui/SkeletonLoader';

const AppointmentQueue = ({ refreshOnMount = false }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    
    // Check if a new appointment was booked and refresh the list
    const handleNewAppointment = () => {
      const newAppointmentBooked = localStorage.getItem('newAppointmentBooked');
      if (newAppointmentBooked === 'true') {
        fetchAppointments();
        localStorage.removeItem('newAppointmentBooked');
      }
    };
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleNewAppointment);
    
    // Also check on component mount if refreshOnMount is true
    if (refreshOnMount) {
      handleNewAppointment();
    }
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleNewAppointment);
    };
  }, [refreshOnMount]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.APPOINTMENTS);
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        // Fallback to mock data if API call fails
        const mockAppointments = [
          {
            id: '1',
            doctorName: 'Dr. Karimov Olim',
            specialty: 'Kardiolog',
            date: '2025-10-15',
            time: '09:30',
            status: 'confirmed',
            address: 'G‘ijduvon tez tibbiy'
          },
          {
            id: '2',
            doctorName: 'Dr. Rahmonova Zarnigor',
            specialty: 'Bolalar shifokori',
            date: '2025-10-18',
            time: '11:00',
            status: 'pending',
            address: 'G‘ijduvon tez tibbiy'
          },
          {
            id: '3',
            doctorName: 'Dr. Ismoilova Nigora',
            specialty: 'Stomatolog',
            date: '2025-10-20',
            time: '14:30',
            status: 'completed',
            address: 'G‘ijduvon tez tibbiy'
          }
        ];
        
        setAppointments(mockAppointments);
      }
    } catch (err) {
      // Remove development-only logging
      // Fallback to mock data if there's an error
      const mockAppointments = [
        {
          id: '1',
          doctorName: 'Dr. Karimov Olim',
          specialty: 'Kardiolog',
          date: '2025-10-15',
          time: '09:30',
          status: 'confirmed',
          address: 'G‘ijduvon tez tibbiy'
        },
        {
          id: '2',
          doctorName: 'Dr. Rahmonova Zarnigor',
          specialty: 'Bolalar shifokori',
          date: '2025-10-18',
          time: '11:00',
          status: 'pending',
          address: 'G‘ijduvon tez tibbiy'
        },
        {
          id: '3',
          doctorName: 'Dr. Ismoilova Nigora',
          specialty: 'Stomatolog',
          date: '2025-10-20',
          time: '14:30',
          status: 'completed',
          address: 'G‘ijduvon tez tibbiy'
        }
      ];
      
      setAppointments(mockAppointments);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'completed': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Tasdiqlangan';
      case 'pending': return 'Kutilmoqda';
      case 'completed': return 'Tugallangan';
      default: return status;
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm('Ushbu navbatni bekor qilmoqchimisiz?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setAppointments(prev => prev.filter(app => app.id !== id));
        } else {
          throw new Error('Failed to cancel appointment');
        }
      } catch (err) {
        alert("Navbatni bekor qilishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      }
    }
  };

  return (
    <div className="appointment-queue-section py-4">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="display-6">Navbat ro'yxati</h2>
            <p className="text-muted">Sizning barcha navbatlaringiz</p>
          </div>
        </div>
        
          <div className="row">
            <div className="col-12">
              {loading ? (
                <div className="text-center py-5">
                  <SkeletonLoader type="text" width="60%" height="1.2rem" className="mb-3" />
                  <SkeletonLoader type="text" width="40%" height="1rem" />
                </div>
              ) : appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map((appointment, index) => (
                    <div key={appointment._id || appointment.id} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title">{appointment.doctorName}</h5>
                            <p className="card-text mb-1">
                              <i className="fas fa-building me-2"></i>
                              {getDepartmentName(appointment.department)}
                            </p>
                            <p className="card-text mb-1">
                              <i className="fas fa-map-marker-alt me-2"></i>
                              {appointment.address || 'G‘ijduvon tez tibbiy'}
                            </p>
                            <p className="card-text mb-1">
                              <i className="far fa-calendar-alt me-2"></i>
                              {formatDate(appointment.date)} soat {appointment.time}
                            </p>
                          </div>
                          
                          <div className="d-flex flex-column align-items-end">
                            <span className={`badge ${getStatusClass(appointment.status)} mb-2`}>
                              {getStatusText(appointment.status)}
                            </span>
                            
                            {appointment.status !== 'completed' && (
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => cancelAppointment(appointment._id || appointment.id)}
                              >
                                <i className="fas fa-times me-1"></i> Bekor qilish
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {appointment.status === 'confirmed' && (
                          <div className="alert alert-info mt-3 mb-0">
                            <i className="fas fa-info-circle me-2"></i>
                            Eslatma: Iltimos, navbat vaqtidan 15 daqiqa oldin kelishni unutmang.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center my-5">
                  <div className="mb-4">
                    <i className="fas fa-calendar fa-3x mb-3"></i>
                    <h4>Hozircha navbat olinmagan</h4>
                    <p>
                      Hozirda sizda navbat mavjud emas.
                    </p>
                  </div>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/appointment-queue')}
                  >
                    <i className="fas fa-calendar-plus me-1"></i>Navbatga yozilish
                  </button>
                </div>
              )}
            </div>
          </div>
        
        {!loading && appointments.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Navbat statistikasi</h5>
                  <div className="d-flex justify-content-around text-center">
                    <div>
                      <h5>{appointments.filter(a => a.status === 'confirmed').length}</h5>
                      <p className="mb-0">Tasdiqlangan</p>
                    </div>
                    <div>
                      <h5>{appointments.filter(a => a.status === 'pending').length}</h5>
                      <p className="mb-0">Kutilmoqda</p>
                    </div>
                    <div>
                      <h5>{appointments.filter(a => a.status === 'completed').length}</h5>
                      <p className="mb-0">Tugallangan</p>
                    </div>
                    <div>
                      <h5>{appointments.length}</h5>
                      <p className="mb-0">Jami</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentQueue;