import React, { useState } from 'react';
import axios from 'axios';

const AddDoctorForm = ({ onDoctorAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    availableDays: [],
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const daysOfWeek = [
    { id: 'monday', name: 'Dushanba' },
    { id: 'tuesday', name: 'Seshanba' },
    { id: 'wednesday', name: 'Chorshanba' },
    { id: 'thursday', name: 'Payshanba' },
    { id: 'friday', name: 'Juma' },
    { id: 'saturday', name: 'Shanba' },
    { id: 'sunday', name: 'Yakshanba' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (dayId) => {
    setFormData(prev => {
      const newDays = prev.availableDays.includes(dayId)
        ? prev.availableDays.filter(d => d !== dayId)
        : [...prev.availableDays, dayId];
      
      return {
        ...prev,
        availableDays: newDays
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.post('/api/admin/add-doctor', formData, config);
      
      if (onDoctorAdded) {
        onDoctorAdded(res.data);
      }
      
      // Reset form
      setFormData({
        name: '',
        specialization: '',
        phone: '',
        availableDays: [],
        image: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Yangi Shifokor Qo'shish</h3>
          <button className="modal-close" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label className="form-label">Ism *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Mutaxassislik *</label>
            <input
              type="text"
              className="form-control"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Telefon</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 XX XXX XX XX"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Mavjud Kunlar</label>
            <div className="d-flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  type="button"
                  className={`btn btn-sm ${formData.availableDays.includes(day.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDayToggle(day.id)}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Rasm URL</label>
            <input
              type="text"
              className="form-control"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Rasm URL manzilini kiriting"
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;