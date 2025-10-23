import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENT_NAMES } from '../konstantalar';
import { fetchDoctors, createAppointment, fetchAppointments } from '../yordamchi_funksiyalar/api';
import CustomAlert from '../komponentlar/ui/CustomAlert';
import SkeletonLoader from '../komponentlar/ui/SkeletonLoader';
import '../uslublar/components.css';
import '../uslublar/appointment-queue.css';
// Convert DEPARTMENT_NAMES to departments array with "all" option
const departments = [
  { id: 'all', name: 'Barcha bo\'limlar' },
  ...Object.keys(DEPARTMENT_NAMES).map(key => ({
    id: key,
    name: DEPARTMENT_NAMES[key]
  }))
];

const AppointmentQueuePage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    department: 'all',
    doctor: '',
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    type: '',
    title: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      // Error handling is already in the API utility
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      // Error handling is already in the API utility
    }
  };

  useEffect(() => {
    loadDoctors();
    loadAppointments();
  }, []);

  // Check if a time slot is available for the selected date and doctor
  const isTimeSlotAvailable = (timeSlot) => {
    if (!formData.date || !formData.doctor) return true;

    return !appointments.some(appointment =>
      appointment.date === formData.date &&
      appointment.time === timeSlot &&
      appointment.doctorId === formData.doctor
    );
  };

  // Get time slot status (available/unavailable)
  const getTimeSlotStatus = (timeSlot) => {
    return isTimeSlotAvailable(timeSlot) ? 'available' : 'unavailable';
  };

  const showAlert = (type, title, message) => {
    setAlert({
      show: true,
      type,
      title,
      message
    });
  };

  const hideAlert = () => {
    setAlert({
      show: false,
      type: '',
      title: '',
      message: ''
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone input
    if (name === 'phone') {
      handlePhoneChange(e);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset doctor selection when department changes
    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        doctor: '',
        department: value
      }));

      // Filter doctors based on selected department
      if (value === 'all' || value === '') {
        setFilteredDoctors(doctors);
      } else {
        const filtered = doctors.filter(d => d.department === value);
        setFilteredDoctors(filtered);
      }
    }
  };

  // Handle phone input change with formatting for +998 XX XXX XX XX format
  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters except +
    value = value.replace(/[^\d+]/g, '');

    // Ensure it starts with +998
    if (!value.startsWith('+998')) {
      value = '+998' + value.replace(/\D/g, '');
    }

    // Limit to 9 digits after +998 (total 12 digits: +998 XX XXX XX XX)
    if (value.length > 13) {
      value = value.substring(0, 13);
    }

    // Format the phone number as +998 XX XXX XX XX
    let formattedValue = value;
    if (value.length > 4) {
      const numbers = value.substring(4);
      let formattedNumbers = '';

      for (let i = 0; i < numbers.length; i++) {
        if (i === 2 || i === 5 || i === 7) {
          formattedNumbers += ' ';
        }
        formattedNumbers += numbers[i];
      }

      formattedValue = '+998 ' + formattedNumbers;
    }

    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));

    // Clear error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ismingizni kiriting';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefon raqamingizni kiriting';
    } else {
      // Extract numbers only from the phone input (remove spaces, +, etc.)
      const phoneNumbers = formData.phone.replace(/[^\d]/g, '');
      
      // Check if it starts with 998 and has 12 digits total (9 digits after +998)
      if (!phoneNumbers.startsWith('998') || phoneNumbers.length !== 12) {
        newErrors.phone = 'To\'g\'ri telefon raqam kiriting (+998 XX XXX XX XX)';
      }
    }
    
    if (!formData.department) {
      newErrors.department = 'Bo\'limni tanlang';
    }
    if (formData.department !== 'all' && !formData.doctor) {
      newErrors.doctor = 'Shifokorni tanlang';
    }
    if (!formData.date) {
      newErrors.date = 'Sanani tanlang';
    } else {
      // Check if the date is in the past
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for comparison
      
      if (selectedDate < today) {
        newErrors.date = 'Iltimos, bugungi yoki kelajakdagi sanani tanlang';
      }
    }
    if (!formData.time) {
      newErrors.time = 'Vaqtni tanlang';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      try {
        // Find the selected doctor
        const selectedDoctor = doctors.find(d => d._id === formData.doctor);
        
        // Prepare appointment data with cleaned phone number
        const phoneNumbersOnly = formData.phone.replace(/[^\d]/g, '');
        console.log('Phone numbers only:', phoneNumbersOnly); // Debug log
        
        // Extract just the 9 digits after 998
        const phoneNumberDigits = phoneNumbersOnly.startsWith('998') ? phoneNumbersOnly.substring(3) : phoneNumbersOnly;
        console.log('Phone number digits:', phoneNumberDigits); // Debug log
        
        const appointmentData = {
          fullName: formData.fullName,
          phone: '+998' + phoneNumberDigits, // Send clean phone number with +998 prefix
          date: formData.date,
          time: formData.time,
          doctorId: selectedDoctor._id,
          doctorName: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          department: selectedDoctor.department
        };
        
        console.log('Sending appointment data to backend:', appointmentData); // Debug log
        
        // Submit appointment
        const result = await createAppointment(appointmentData);
        console.log('Appointment creation result:', result); // Debug log
        
        if (result.success) {
          // Reset form
          setFormData({
            fullName: '',
            phone: '',
            department: 'all',
            doctor: '',
            date: '',
            time: ''
          });

          // Reload appointments to update time slot availability
          loadAppointments();

          // Show success message
          showAlert('success', 'Muvaffaqiyat!', 'Navbatingiz muvaffaqiyatli bron qilindi!', () => {
            // Don't reload the page immediately, give user time to see the message
            // Optionally, you can navigate to a different page or clear the form
            setTimeout(() => {
              window.location.reload();
            }, 3000); // Reload after 3 seconds
          });
        } else {
          // Show detailed error message
          let errorMessage = 'Xatolik yuz berdi. ';
          if (result.status === 400) {
            errorMessage += 'Iltimos, kiritilgan ma\'lumotlarni tekshiring.';
          } else if (result.status === 500) {
            errorMessage += 'Server xatosi yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.';
          } else {
            errorMessage += 'Iltimos, keyinroq qayta urinib ko\'ring.';
          }
          
          if (result.error) {
            errorMessage += '\n\nBatafsil: ' + result.error;
          }
          
          showAlert('error', 'Xatolik', errorMessage);
        }
      } catch (err) {
        showAlert('error', 'Tarmoq xatosi', 'Tarmoq xatosi yuz berdi. Iltimos, internet aloqangizni tekshiring va qayta urinib ko\'ring.');
      }
    }
  };

  return (
    <section className="appointment-queue-page py-5 page-content">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-5 fw-bold" style={{ color: 'var(--blue-primary)' }}>Navbatga yozilish</h1>
            <p className="lead" style={{ color: 'var(--blue-text)' }}>Shifokor tanlang va navbatingizni bron qiling</p>
          </div>
        </div>
        
        {/* Booking form section - always visible */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="card border-0 shadow rounded-3" style={{ 
              background: 'var(--white)', 
              border: '2px solid var(--blue-border)',
              boxShadow: 'var(--shadow)'
            }}>
              <div className="card-body p-4">
                {loading ? (
                  <div className="text-center">
                    <SkeletonLoader type="text" width="60%" height="1.2rem" className="mb-3" />
                    <SkeletonLoader type="text" width="40%" height="1rem" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="fullName" className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Ism va familiya *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="fullName" 
                            name="fullName"
                            placeholder="Ismingizni kiriting" 
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            style={{ 
                              backgroundColor: 'var(--white)', 
                              borderColor: 'var(--blue-border)', 
                              color: 'var(--blue-text)',
                              borderRadius: 'var(--border-radius)'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="phone" className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Telefon raqam *</label>
                          <input 
                            type="tel" 
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`} 
                            id="phone" 
                            name="phone"
                            placeholder="+998 XX XXX XX XX" 
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                            style={{ 
                              backgroundColor: 'var(--white)', 
                              borderColor: errors.phone ? '#dc3545' : 'var(--blue-border)', 
                              color: 'var(--blue-text)',
                              borderRadius: 'var(--border-radius)'
                            }}
                          />
                          {errors.phone && (
                            <div className="invalid-feedback d-block" style={{ color: 'var(--danger-color)' }}>
                              {errors.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="department" className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Bo'limni tanlang *</label>
                          <select 
                            className="form-select" 
                            id="department" 
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                            style={{ 
                              backgroundColor: 'var(--white)', 
                              borderColor: 'var(--blue-border)', 
                              color: 'var(--blue-text)',
                              borderRadius: 'var(--border-radius)'
                            }}
                          >
                            {departments.map(dept => (
                              <option key={dept.id} value={dept.id} style={{ backgroundColor: 'var(--white)', color: 'var(--blue-text)' }}>{dept.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="doctor" className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Shifokorni tanlang *</label>
                          <select 
                            className={`form-select ${errors.doctor ? 'is-invalid' : ''}`} 
                            id="doctor" 
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.department || formData.department === 'all'}
                            style={{ 
                              backgroundColor: 'var(--white)', 
                              borderColor: errors.doctor ? '#dc3545' : 'var(--blue-border)', 
                              color: 'var(--blue-text)',
                              borderRadius: 'var(--border-radius)'
                            }}
                          >
                            <option value="" style={{ backgroundColor: 'var(--white)', color: 'var(--blue-text)' }}>Shifokorni tanlang</option>
                            {filteredDoctors.map(doc => (
                              <option key={doc._id} value={doc._id} style={{ backgroundColor: 'var(--white)', color: 'var(--blue-text)' }}>{doc.name} ({doc.specialty})</option>
                            ))}
                          </select>
                          {errors.doctor && (
                            <div className="invalid-feedback d-block" style={{ color: 'var(--danger-color)' }}>
                              {errors.doctor}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="date" className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Kunni tanlang *</label>
                          <input
                            type="date"
                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            style={{
                              backgroundColor: 'var(--white)',
                              borderColor: errors.date ? '#dc3545' : 'var(--blue-border)',
                              color: 'var(--blue-text)',
                              borderRadius: 'var(--border-radius)'
                            }}
                          />
                          {errors.date && (
                            <div className="invalid-feedback d-block" style={{ color: 'var(--danger-color)' }}>
                              {errors.date}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Vaqtni tanlang *</label>
                          {formData.date && formData.doctor ? (
                            <div className="time-slots-container">
                              <div className="time-slots-grid">
                                {availableTimeSlots.map(timeSlot => {
                                  const status = getTimeSlotStatus(timeSlot);
                                  const isSelected = formData.time === timeSlot;

                                  return (
                                    <button
                                      key={timeSlot}
                                      type="button"
                                      className={`time-slot-btn ${status} ${isSelected ? 'selected' : ''}`}
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, time: timeSlot }));
                                        if (errors.time) {
                                          setErrors(prev => ({ ...prev, time: '' }));
                                        }
                                      }}
                                      disabled={status === 'unavailable'}
                                    >
                                      {timeSlot}
                                    </button>
                                  );
                                })}
                              </div>
                              {errors.time && (
                                <div className="invalid-feedback d-block" style={{ color: 'var(--danger-color)' }}>
                                  {errors.time}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="time-slots-placeholder">
                              <p style={{ color: 'var(--blue-text)', opacity: 0.7, margin: 0 }}>
                                Avval sana va shifokorni tanlang
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-success btn-lg">
                          <i className="fas fa-calendar-check me-2"></i>Navbatga yozilish
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Alert Component */}
      <CustomAlert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
        onConfirm={alert.onConfirm || hideAlert}
        confirmText="OK"
      />
    </section>
  );
};

export default AppointmentQueuePage;