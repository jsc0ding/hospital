import React, { useState, useEffect } from 'react';
import '../uslublar/contact-section-updated.css';
import { createComplaint } from '../yordamchi_funksiyalar/api';
import { fetchDoctors } from '../yordamchi_funksiyalar/api';
import CustomAlert from '../komponentlar/ui/CustomAlert';

const Contact = () => {
  const [doctorName, setDoctorName] = useState('');
  const [complaintPhone, setComplaintPhone] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Fetch doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsList = await fetchDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        // Error handling is already in the API utility
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  const handleCloseAlert = () => {
    setAlert({
      show: false,
      type: 'info',
      title: '',
      message: ''
    });
  };

  const clinicInfo = {
    name: 'MedQueue Tibbiyot Markazi',
    address: 'G‘ijduvon tez tibbiy',
    phone: '+998 91 895 9373',
    email: 'nasriddinnovnizomjon5@gmail.com',
    telegram: '@Nizomjon_dev11',
    website: 'medqueue.uz',
    facebook: 'MedQueue Markaz',
    instagram: '@Nizomjon_dev11', // Updated to your personal Instagram
    workingHours: 'Dushanba-Yakshanba: 8:00-20:00',
    emergency: '+998 91 895 9373',
    coordinates: {
      lat: 40.1024,
      lng: 64.6817
    }
  };

  const handleContactAction = (type, value) => {
    switch (type) {
      case 'phone':
        window.location.href = `tel:${value}`;
        break;
      case 'telegram':
        // Remove @ if it exists to avoid double @ in URL
        const username = value.startsWith('@') ? value.substring(1) : value;
        window.open(`https://t.me/${username}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      case 'website':
        window.open(`http://${value}`, '_blank');
        break;
      case 'facebook':
        window.open('https://www.facebook.com/MedQueueMarkaz', '_blank');
        break;
      case 'instagram':
        window.open('https://instagram.com/Nizomjon_dev11', '_blank'); // Updated to your personal Instagram
        break;
      case 'emergency':
        window.location.href = `tel:${value}`;
        break;
      case 'map':
        window.open(`https://www.google.com/maps/search/?api=1&query=${clinicInfo.coordinates.lat},${clinicInfo.coordinates.lng}`, '_blank');
        break;
      default:
        break;
    }
  };

  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // If it starts with 998, remove it to get just the 9 digits
    if (digits.startsWith('998')) {
      return digits.slice(3);
    }

    // Otherwise, take only the last 9 digits
    return digits.slice(-9);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setComplaintPhone(formatted);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (!doctorName.trim() || !complaintPhone.trim() || !complaintText.trim()) {
      setAlert({
        show: true,
        type: 'warning',
        title: 'Eslatma',
        message: "Iltimos, barcha maydonlarni to'ldiring!"
      });
      return;
    }

    // Validate phone number (must be exactly 9 digits)
    if (complaintPhone.length !== 9) {
      setAlert({
        show: true,
        type: 'warning',
        title: 'Eslatma',
        message: "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak!"
      });
      return;
    }

    setIsSubmittingComplaint(true);

    try {
      const complaintData = {
        name: doctorName.trim(),
        phone: `+998${complaintPhone.trim()}`,
        message: complaintText.trim()
      };

      const result = await createComplaint(complaintData);

      if (result.success) {
        setAlert({
          show: true,
          type: 'success',
          title: 'Muvaffaqiyat',
          message: "Shikoyatingiz muvaffaqiyatli yuborildi!"
        });
        // Reset form
        setDoctorName('');
        setComplaintPhone('');
        setComplaintText('');
      } else {
        setAlert({
          show: true,
          type: 'error',
          title: 'Xatolik',
          message: "Shikoyatni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Xatolik',
        message: "Shikoyatni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      });
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  return (
    <div className="contact-page">
      <CustomAlert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={handleCloseAlert}
        confirmText="OK"
      />
      <div className="container">
        <div className="contact-wrapper">
          {/* Page Header */}
          <div className="section-header">
            <h1 className="section-title">📞 Aloqa ma’lumotlari</h1>
            <p className="section-subtitle">Shifoxonamiz bilan quyidagi usullar orqali bog'lanishingiz mumkin</p>
          </div>

          <div className="row g-4">
            {/* Complaint Section - Moved to appear first */}
            <div className="col-lg-6">
              <div className="complaint-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Shikoyat yuborish
                  </h2>
                  <p className="card-description">
                    Doktorga nisbatan shikoyatingiz bo'lsa, quyidagi formani to'ldiring:
                  </p>
                </div>
                
                <form onSubmit={handleComplaintSubmit} className="complaint-form">
                  <div className="form-group">
                    <label htmlFor="doctorName" className="form-label">
                      <i className="fas fa-user-md me-2"></i>
                      Doktor tanlang *
                    </label>
                    <select
                      id="doctorName"
                      className="form-control"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      required
                    >
                      <option value="">Doktor tanlang...</option>
                      {loadingDoctors ? (
                        <option disabled>Yuklanmoqda...</option>
                      ) : (
                        doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor.name}>
                            {doctor.name} - {doctor.specialty}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="complaintPhone" className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Telefon raqamingiz *
                    </label>
                    <div className="phone-input-group">
                      <div className="country-code">+998</div>
                      <input
                        type="tel"
                        id="complaintPhone"
                        className="form-control phone-input"
                        placeholder="XX XXX XX XX"
                        value={complaintPhone}
                        onChange={handlePhoneChange}
                        maxLength="9"
                        required
                      />
                    </div>
                    <div className="form-help">
                      Masalan: 91 895 93 73
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="complaintText" className="form-label">
                      <i className="fas fa-comment me-2"></i>
                      Shikoyatingiz *
                    </label>
                    <textarea
                      id="complaintText"
                      className="form-control textarea"
                      placeholder="Shikoyatingizni batafsil yozing..."
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmittingComplaint}
                  >
                    {isSubmittingComplaint ? (
                      <>
                        <div className="loading-spinner"></div>
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Shikoyat yuborish
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Section - Moved to appear second */}
            <div className="col-lg-6">
              <div className="contact-card">
                <div className="contact-info-grid contact-info-grid-mobile-2col">
                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('map', clinicInfo.address)}
                  >
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Manzil</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('phone', clinicInfo.phone)}
                  >
                    <div className="contact-icon">
                      <i className="fas fa-phone-alt icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Telefon</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('email', clinicInfo.email)}
                  >
                    <div className="contact-icon">
                      <i className="fas fa-envelope icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Email</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('website', clinicInfo.website)}
                  >
                    <div className="contact-icon">
                      <i className="fas fa-globe icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Veb-sayt</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('telegram', clinicInfo.telegram)}
                  >
                    <div className="contact-icon">
                      <i className="fab fa-telegram icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Telegram</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('facebook', clinicInfo.facebook)}
                  >
                    <div className="contact-icon">
                      <i className="fab fa-facebook-f icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Facebook</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('instagram', clinicInfo.instagram)}
                  >
                    <div className="contact-icon">
                      <i className="fab fa-instagram icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Instagram</h3>
                    </div>
                  </div>

                  <div 
                    className="contact-info-item"
                    onClick={() => handleContactAction('emergency', clinicInfo.emergency)}
                  >
                    <div className="contact-icon">
                      <i className="fas fa-ambulance icon-modern"></i>
                    </div>
                    <div className="contact-content">
                      <h3 className="contact-title">Jamoat xizmati</h3>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="additional-info">
                  <h3 className="additional-info-title">Qo'shimcha ma'lumotlar</h3>
                  <div className="info-item">
                    <strong>Ish vaqti:</strong> {clinicInfo.workingHours}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;