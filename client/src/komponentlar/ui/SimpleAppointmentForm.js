import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTimeOptions, VALIDATION_MESSAGES } from '../../konstantalar';
import { createAppointment } from '../../yordamchi_funksiyalar/api';
import { validateAppointmentForm, isFormValid } from '../../yordamchi_funksiyalar/validation';
import CustomAlert from './CustomAlert';

const SimpleAppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  const showAlert = (type, title, message, onConfirm = null) => {
    setAlert({
      show: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const hideAlert = () => {
    setAlert({
      show: false,
      type: 'info',
      title: '',
      message: '',
      onConfirm: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = validateAppointmentForm(formData, true, true);
    setErrors(newErrors);
    
    if (!isFormValid(newErrors)) {
      showAlert('warning', 'Eslatma', 'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data to match what the backend expects
      const appointmentData = {
        fullName: formData.fullName,
        phone: formData.phone,
        date: formData.date,
        time: formData.time
      };
      
      const result = await createAppointment(appointmentData);
      
      if (result.success) {
        showAlert('success', 'Muvaffaqiyat!', 'Navbatingiz muvaffaqiyatli ro\'yxatga olindi.');
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          date: '',
          time: ''
        });
      } else {
        throw new Error(result.error || 'Failed to book appointment');
      }
    } catch (err) {
      setErrors({ submit: VALIDATION_MESSAGES.SUBMIT_ERROR });
      showAlert('error', 'Xatolik', VALIDATION_MESSAGES.SUBMIT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card border-0 shadow-lg" style={{ background: 'var(--white)', border: '2px solid var(--blue-border)' }}>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Ism va familiya *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ismingizni kiriting"
                    style={{ 
                      backgroundColor: 'var(--white)', 
                      borderColor: errors.fullName ? '#dc3545' : 'var(--blue-border)', 
                      color: 'var(--blue-text)',
                      borderRadius: '0 var(--border-radius) var(--border-radius) 0'
                    }}
                  />
                </div>
                {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Telefon raqam *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-phone"></i>
                  </span>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+998 XX XXX XX XX"
                    style={{ 
                      backgroundColor: 'var(--white)', 
                      borderColor: errors.phone ? '#dc3545' : 'var(--blue-border)', 
                      color: 'var(--blue-text)',
                      borderRadius: '0 var(--border-radius) var(--border-radius) 0'
                    }}
                  />
                </div>
                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Sana *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-calendar"></i>
                  </span>
                  <input
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ 
                      backgroundColor: 'var(--white)', 
                      borderColor: errors.date ? '#dc3545' : 'var(--blue-border)', 
                      color: 'var(--blue-text)',
                      borderRadius: '0 var(--border-radius) var(--border-radius) 0'
                    }}
                  />
                </div>
                {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--blue-text)', fontWeight: '500' }}>Vaqt *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-clock"></i>
                  </span>
                  <select
                    className={`form-select ${errors.time ? 'is-invalid' : ''}`}
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    style={{ 
                      backgroundColor: 'var(--white)', 
                      borderColor: errors.time ? '#dc3545' : 'var(--blue-border)', 
                      color: 'var(--blue-text)',
                      borderRadius: '0 var(--border-radius) var(--border-radius) 0'
                    }}
                  >
                    <option value="">Vaqt tanlang</option>
                    {generateTimeOptions().map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                {errors.time && <div className="invalid-feedback d-block">{errors.time}</div>}
              </div>
            </div>
          </div>
          
          {errors.submit && (
            <div className="alert alert-danger mt-3 mb-0">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.submit}
            </div>
          )}
          
          <div className="d-grid mt-4">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Yuklanmoqda...'
              ) : (
                <>
                  <i className="fas fa-calendar-check me-2"></i>Navbatga yozilish
                </>
              )}
            </button>
          </div>
        </form>
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
    </div>
  );
};

export default SimpleAppointmentForm;