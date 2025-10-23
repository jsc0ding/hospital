import React, { useState, useEffect } from 'react';
import { DEPARTMENT_NAMES, getDoctorImage } from '../../konstantalar';

const DoctorModal = ({ show, onClose, onSave, doctor }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    department: '',
    experience: '',
    address: '',
    description: '',
    workingHours: '',
    rating: 5.0,
    phone: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workingHours, setWorkingHours] = useState({
    days: [],
    startTime: '09:00',
    endTime: '17:00'
  });

  // Days of the week options
  const daysOfWeek = [
    { id: 'monday', name: 'Dushanba' },
    { id: 'tuesday', name: 'Seshanba' },
    { id: 'wednesday', name: 'Chorshanba' },
    { id: 'thursday', name: 'Payshanba' },
    { id: 'friday', name: 'Juma' },
    { id: 'saturday', name: 'Shanba' },
    { id: 'sunday', name: 'Yakshanba' }
  ];

  // Time options (every 30 minutes from 8:00 to 20:00)
  const timeOptions = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 20) {
      timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
      setImagePreview(doctor.image || getDoctorImage(0, doctor._id));
      
      // Parse working hours if in custom format
      if (doctor.workingHours) {
        // Try to parse existing working hours format
        // This is a simplified parser - you might want to enhance it
        const days = [];
        daysOfWeek.forEach(day => {
          if (doctor.workingHours.includes(day.name)) {
            days.push(day.id);
          }
        });
        
        // Try to extract time range
        const timeMatch = doctor.workingHours.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
        if (timeMatch) {
          setWorkingHours({
            days,
            startTime: timeMatch[1],
            endTime: timeMatch[2]
          });
        } else {
          setWorkingHours({
            days,
            startTime: '09:00',
            endTime: '17:00'
          });
        }
      }
    } else {
      setFormData({
        name: '',
        specialty: '',
        department: '',
        experience: '',
        address: '',
        description: '',
        workingHours: '',
        rating: 5.0,
        phone: '',
        image: ''
      });
      setImagePreview('');
      setWorkingHours({
        days: [],
        startTime: '09:00',
        endTime: '17:00'
      });
    }
    setErrors({});
  }, [doctor, show]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
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

    // Update image preview if image URL changes
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  // Handle phone number change with proper formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    
    // Limit to 9 digits
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    setFormData(prev => ({
      ...prev,
      phone: value
    }));

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  // Handle working hours day selection
  const handleDayToggle = (dayId) => {
    setWorkingHours(prev => {
      const newDays = prev.days.includes(dayId)
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId];
      
      return {
        ...prev,
        days: newDays
      };
    });
  };

  // Handle time change
  const handleTimeChange = (timeType, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [timeType]: value
    }));
  };

  // Format working hours string
  const formatWorkingHours = () => {
    if (workingHours.days.length === 0) return '';
    
    const dayNames = workingHours.days.map(dayId => {
      const day = daysOfWeek.find(d => d.id === dayId);
      return day ? day.name : '';
    }).filter(Boolean);
    
    if (dayNames.length === 0) return '';
    
    return `${dayNames.join(', ')} ${workingHours.startTime}-${workingHours.endTime}`;
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          image: 'Faqat rasm fayllari qo\'shilishi mumkin'
        }));
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Rasm hajmi 5MB dan oshmasligi kerak'
        }));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ism majburiy';
    }
    
    if (!formData.department) {
      newErrors.department = 'Bo\'limni tanlash majburiy';
    }
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Tajriba majburiy';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Manzil majburiy';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Tavsif majburiy';
    }
    
    if (workingHours.days.length === 0) {
      newErrors.workingHours = 'Kamida bitta kunni tanlang';
    }
    
    if (formData.phone && formData.phone.length !== 9) {
      newErrors.phone = 'Telefon raqami 9 ta raqamdan iborat bo\'lishi kerak';
    }
    
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Reyting 0-5 oraliqda bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation
      if (!validateForm()) {
        throw new Error('Barcha majburiy maydonlarni to\'ldiring');
      }

      // Format working hours
      const formattedWorkingHours = formatWorkingHours();
      
      // Format phone number for backend
      let formattedPhone = '';
      if (formData.phone) {
        // Format as +998 XX XXX XX XX
        formattedPhone = `+998 ${formData.phone.substring(0, 2)} ${formData.phone.substring(2, 5)} ${formData.phone.substring(5, 7)} ${formData.phone.substring(7, 9)}`;
      }
      
      const doctorData = {
        ...formData,
        phone: formattedPhone,
        workingHours: formattedWorkingHours,
        rating: parseFloat(formData.rating) || 5.0
      };

      if (onSave) {
        await onSave(doctorData);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Shifokor ma\'lumotlarini saqlashda xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-slide-up doctor-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header doctor-modal-header">
          <h3 className="heading-modern">
            <i className={`fas ${doctor ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
            {doctor ? 'Shifokorni Tahrirlash' : 'Yangi Shifokor Qo\'shish'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body doctor-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Image Preview Section */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <div className="image-preview-container">
                <img
                  src={imagePreview || getDoctorImage(0, formData._id)}
                  alt="Doctor preview"
                  className="doctor-preview-image"
                  onError={(e) => {
                    e.target.src = getDoctorImage(0, formData._id);
                  }}
                />
                <div className="image-overlay">
                  <label className="btn btn-modern btn-sm">
                    <i className="fas fa-camera me-1"></i>
                    Rasm tanlash
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
              {errors.image && <div className="invalid-feedback d-block mt-2">{errors.image}</div>}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section doctor-form-section">
            <h4 className="section-title doctor-section-title">
              <i className="fas fa-user-md me-2"></i>
              Asosiy Ma'lumotlar
            </h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-user me-2"></i>Ism *
                </label>
                <input
                  type="text"
                  className={`input-modern doctor-input ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Shifokor ismini kiriting"
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-stethoscope me-2"></i>Mutaxassislik
                </label>
                <input
                  type="text"
                  className={`input-modern doctor-input ${errors.specialty ? 'is-invalid' : ''}`}
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Mutaxassislikni kiriting"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-building me-2"></i>Bo'lim *
                </label>
                <select
                  className={`input-modern doctor-input ${errors.department ? 'is-invalid' : ''}`}
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Bo'limni tanlang...</option>
                  {Object.entries(DEPARTMENT_NAMES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-briefcase me-2"></i>Tajriba *
                </label>
                <input
                  type="text"
                  className={`input-modern doctor-input ${errors.experience ? 'is-invalid' : ''}`}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Masalan: 10 yil tajriba"
                  required
                />
                {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section doctor-form-section">
            <h4 className="section-title doctor-section-title">
              <i className="fas fa-address-book me-2"></i>
              Aloqa Ma'lumotlari
            </h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-map-marker-alt me-2"></i>Manzil *
                </label>
                <input
                  type="text"
                  className={`input-modern doctor-input ${errors.address ? 'is-invalid' : ''}`}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Klinika manzilini kiriting"
                  required
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-phone me-2"></i>Telefon
                </label>
                <div className="input-group">
                  <span className="input-group-text">+998</span>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="XX XXX XX XX"
                    maxLength="9"
                  />
                </div>
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            {/* Working Hours Selection */}
            <div className="mb-3">
              <label className="form-label doctor-form-label">
                <i className="fas fa-clock me-2"></i>Ish vaqti *
              </label>
              
              {/* Days Selection */}
              <div className="mb-3">
                <label className="form-label">Kunlarni tanlang:</label>
                <div className="d-flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      className={`btn btn-sm ${workingHours.days.includes(day.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleDayToggle(day.id)}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
                {errors.workingHours && <div className="invalid-feedback d-block">{errors.workingHours}</div>}
              </div>
              
              {/* Time Selection */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Boshlanish vaqti:</label>
                  <select
                    className="form-control"
                    value={workingHours.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tugash vaqti:</label>
                  <select
                    className="form-control"
                    value={workingHours.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Formatted working hours preview */}
              {workingHours.days.length > 0 && (
                <div className="alert alert-info mt-2">
                  <strong>Ish vaqti formati:</strong> {formatWorkingHours()}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section doctor-form-section">
            <h4 className="section-title doctor-section-title">
              <i className="fas fa-info-circle me-2"></i>
              Qo\'shimcha Ma\'lumotlar
            </h4>
            <div className="mb-3">
              <label className="form-label doctor-form-label">
                <i className="fas fa-file-alt me-2"></i>Tavsif *
              </label>
              <textarea
                className={`input-modern doctor-textarea ${errors.description ? 'is-invalid' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Shifokor haqida batafsil ma'lumot..."
                required
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-star me-2"></i>Reyting (0-5)
                </label>
                <input
                  type="number"
                  className={`input-modern doctor-input ${errors.rating ? 'is-invalid' : ''}`}
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                />
                {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label doctor-form-label">
                  <i className="fas fa-image me-2"></i>Rasm
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Rasm URL manzilini kiriting"
                  />
                  <button 
                    className="btn btn-outline-primary" 
                    type="button"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <i className="fas fa-upload"></i>
                  </button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
                <small className="form-text text-muted doctor-hint">
                  Rasmni kompyuteringizdan yuklang yoki URL manzilini kiriting
                </small>
              </div>
            </div>
          </div>

          {/* Submit Error Message */}
          {errors.submit && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.submit}
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-footer doctor-modal-footer">
            <button type="button" className="btn btn-modern btn-secondary" onClick={onClose} disabled={isSubmitting}>
              <i className="fas fa-times me-2"></i>Bekor qilish
            </button>
            <button type="submit" className="btn btn-modern btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading-modern me-2"></span>Saqlanmoqda...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>Saqlash
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;