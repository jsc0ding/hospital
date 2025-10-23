import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../komponentlar/context/AuthContext';
import DoctorModal from './DoctorModal';
import axios from 'axios';
import io from 'socket.io-client';
import { DEPARTMENT_NAMES } from '../../konstantalar';
import CustomAlert from '../../komponentlar/ui/CustomAlert';
import '../../uslublar/admin.css';

// Set baseURL for axios - use relative URLs for production
// axios.defaults.baseURL will be automatically handled by the proxy in development
// and relative URLs in production

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Add missing error state
  const [newAppointments, setNewAppointments] = useState([]); // Add missing newAppointments state
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null); // Add missing editingDoctor state
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle

  // Initialize socket connection
  useEffect(() => {
    const socket = io();
    
    socket.on('connect', () => {
      // Remove development-only logging
    });
    
    socket.on('newAppointment', (data) => {
      // Remove development-only logging
      setNewAppointments(prev => [...prev, data]);
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  // Load data on mount and tab change
  useEffect(() => {
    loadStats();
    if (activeTab === 'appointments') {
      loadAppointments();
    } else if (activeTab === 'complaints') {
      loadComplaints();
    } else if (activeTab === 'doctors') {
      loadDoctors();
    }
  }, [activeTab]);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Add missing load functions
  const loadStats = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard/stats', axiosConfig);
      setStats(res.data);
    } catch (error) {
      // Remove development-only logging
      setError('Statistikani yuklashda xatolik yuz berdi');
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await axios.get('/api/admin/appointments', axiosConfig);
      setAppointments(res.data);
    } catch (error) {
      // Remove development-only logging
      setError('Navbatlar ro\'yxatini yuklashda xatolik yuz berdi');
    }
  };

  const loadComplaints = async () => {
    try {
      const res = await axios.get('/api/admin/complaints', axiosConfig);
      setComplaints(res.data);
    } catch (error) {
      // Remove development-only logging
      setError('Shikoyatlar ro\'yxatini yuklashda xatolik yuz berdi');
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await axios.get('/api/admin/doctors', axiosConfig);
      setDoctors(res.data);
    } catch (error) {
      // Remove development-only logging
      setError('Shifokorlar ro\'yxatini yuklashda xatolik yuz berdi');
    }
  };

  const getDepartmentName = (departmentCode) => {
    return DEPARTMENT_NAMES[departmentCode] || departmentCode;
  };

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

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setEditingDoctor(null); // Reset editing doctor
    setShowDoctorModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setEditingDoctor(doctor); // Set editing doctor
    setShowDoctorModal(true);
  };

  const handleSaveDoctor = async (doctorData) => {
    try {
      if (editingDoctor) {
        // Update existing doctor
        await axios.put(`/api/admin/doctors/${editingDoctor._id}`, doctorData, axiosConfig);
      } else {
        // Create new doctor
        await axios.post('/api/admin/doctors', doctorData, axiosConfig);
      }
      loadDoctors(); // Use loadDoctors instead of fetchDoctors
      setShowDoctorModal(false);
      setEditingDoctor(null);
    } catch (error) {
      // Remove development-only logging
      setError('Shifokor ma\'lumotlarini saqlashda xatolik yuz berdi');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Ushbu shifokorni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await axios.delete(`/api/admin/doctors/${id}`, axiosConfig);
        loadDoctors(); // Use loadDoctors instead of fetchDoctors
      } catch (error) {
        // Remove development-only logging
        setError('Shifokorni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleUpdateAppointment = async (id, status) => {
    try {
      await axios.put(`/api/admin/appointments/${id}`, { status }, axiosConfig);
      loadAppointments(); // Use loadAppointments instead of fetchAppointments
    } catch (error) {
      // Remove development-only logging
      setError('Navbat holatini yangilashda xatolik yuz berdi');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Ushbu navbatni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await axios.delete(`/api/admin/appointments/${id}`, axiosConfig);
        loadAppointments(); // Use loadAppointments instead of fetchAppointments
      } catch (error) {
        // Remove development-only logging
        setError('Navbatni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Ushbu shikoyatni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await axios.delete(`/api/admin/complaints/${id}`, axiosConfig);
        loadComplaints(); // Use loadComplaints instead of fetchComplaints
      } catch (error) {
        // Remove development-only logging
        setError('Shikoyatni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const exportAppointments = () => {
    window.open('/api/admin/appointments/export', '_blank');
  };

  const exportComplaints = () => {
    window.open('/api/admin/complaints/export', '_blank');
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/appointments/${id}/status`, { status }, axiosConfig);
      loadAppointments();
      loadStats();
      showAlert('success', 'Muvaffaqiyat!', 'Navbat statusi yangilandi.');
    } catch (error) {
      console.error('Error updating appointment:', error);
      showAlert('error', 'Xatolik', 'Navbat statusini yangilashda xatolik yuz berdi.');
    }
  };

  const deleteAppointment = async (id) => {
    // First show confirmation dialog
    showAlert('warning', 'Tasdiqlash', 'Navbatni o\'chirmoqchimisiz?', async () => {
      try {
        await axios.delete(`/api/admin/appointments/${id}`, axiosConfig);
        loadAppointments();
        loadStats();
        showAlert('success', 'Muvaffaqiyat!', 'Navbat o\'chirildi.');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        showAlert('error', 'Xatolik', 'Navbatni o\'chirishda xatolik yuz berdi.');
      }
    });
  };

  const deleteComplaint = async (id) => {
    // First show confirmation dialog
    showAlert('warning', 'Tasdiqlash', 'Shikoyatni o\'chirmoqchimisiz?', async () => {
      try {
        await axios.delete(`/api/admin/complaints/${id}`, axiosConfig);
        loadComplaints();
        loadStats();
        showAlert('success', 'Muvaffaqiyat!', 'Shikoyat o\'chirildi.');
      } catch (error) {
        console.error('Error deleting complaint:', error);
        showAlert('error', 'Xatolik', 'Shikoyatni o\'chirishda xatolik yuz berdi.');
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('uz-UZ');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'warning', text: 'Kutilmoqda' },
      confirmed: { class: 'info', text: 'Tasdiqlangan' },
      completed: { class: 'success', text: 'Yakunlangan' },
      cancelled: { class: 'danger', text: 'Bekor qilingan' },
      expired: { class: 'secondary', text: 'Muddati o\'tgan' }
    };
    const statusInfo = statusMap[status] || { class: 'secondary', text: status };
    return <span className={`badge bg-${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.admin-sidebar');
        const toggleButton = document.querySelector('.admin-sidebar-toggle');
        
        if (sidebar && !sidebar.contains(event.target) && 
            toggleButton && !toggleButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="admin-dashboard">
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
      
      {/* Mobile sidebar toggle button */}
      <button className="admin-sidebar-toggle d-md-none" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h3>
            <i className="fas fa-user-shield me-2"></i>
            Admin Panel
          </h3>
          <p className="mb-0">{user?.name}</p>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <i className="fas fa-chart-line me-2"></i>
            Dashboard
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('appointments');
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <i className="fas fa-calendar-check me-2"></i>
            Navbatlar
            {stats && stats.pendingAppointments > 0 && (
              <span className="badge bg-warning ms-2">{stats.pendingAppointments}</span>
            )}
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('complaints');
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <i className="fas fa-comment-medical me-2"></i>
            Shikoyatlar
            {stats && stats.totalComplaints > 0 && (
              <span className="badge bg-danger ms-2">{stats.totalComplaints}</span>
            )}
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('doctors');
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <i className="fas fa-user-md me-2"></i>
            Shifokorlar
          </button>
          <button className="admin-nav-item" onClick={() => {
            navigate('/');
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}>
            <i className="fas fa-home me-2"></i>
            Bosh sahifa
          </button>
          <button className="admin-nav-item admin-logout" onClick={() => {
            handleLogout();
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Chiqish
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-content-header">
          <h2>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'appointments' && 'Navbatlar'}
            {activeTab === 'complaints' && 'Shikoyatlar'}
            {activeTab === 'doctors' && 'Shifokorlar'}
          </h2>
        </div>

        <div className="admin-content-body">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && stats && (
            <div>
              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon bg-primary">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="admin-stat-info">
                      <h3>{stats.totalAppointments}</h3>
                      <p>Jami Navbatlar</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon bg-warning">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="admin-stat-info">
                      <h3>{stats.pendingAppointments}</h3>
                      <p>Kutilmoqda</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon bg-success">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="admin-stat-info">
                      <h3>{stats.completedAppointments}</h3>
                      <p>Yakunlangan</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon bg-info">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="admin-stat-info">
                      <h3>{stats.todayAppointments}</h3>
                      <p>Bugungi Navbatlar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon bg-danger">
                      <i className="fas fa-comment-medical"></i>
                    </div>
                    <div className="admin-stat-info">
                      <h3>{stats.totalComplaints}</h3>
                      <p>Shikoyatlar</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon bg-secondary">
                      <i className="fas fa-user-md"></i>
                    </div>
                    <div className="admin-stat-info">
                      <h3>{stats.totalDoctors}</h3>
                      <p>Shifokorlar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="admin-recent-card">
                    <h4>
                      <i className="fas fa-calendar-check me-2"></i>
                      So'nggi Navbatlar
                    </h4>
                    <div className="admin-recent-list">
                      {stats.recentAppointments && stats.recentAppointments.length > 0 ? (
                        stats.recentAppointments.map((apt) => (
                          <div key={apt._id} className="admin-recent-item">
                            <div>
                              <strong>{apt.fullName}</strong>
                              <br />
                              <small className="text-muted">
                                {apt.doctorName} - {formatDate(apt.date)} {apt.time}
                              </small>
                            </div>
                            <div>{getStatusBadge(apt.status)}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Navbatlar yo'q</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-recent-card">
                    <h4>
                      <i className="fas fa-comment-medical me-2"></i>
                      So'nggi Shikoyatlar
                    </h4>
                    <div className="admin-recent-list">
                      {stats.recentComplaints && stats.recentComplaints.length > 0 ? (
                        stats.recentComplaints.map((complaint) => (
                          <div key={complaint._id} className="admin-recent-item">
                            <div>
                              <strong>{complaint.name}</strong>
                              <br />
                              <small className="text-muted">
                                {complaint.message.length > 50 
                                  ? complaint.message.substring(0, 50) + '...' 
                                  : complaint.message}
                              </small>
                            </div>
                            <div>
                              <small className="text-muted">
                                {formatDateTime(complaint.createdAt)}
                              </small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Shikoyatlar yo'q</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="admin-table-container">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row">
                <h4 className="mb-3 mb-md-0">
                  <i className="fas fa-calendar-check me-2"></i>
                  Navbatlar ro'yxati
                </h4>
                <button className="btn btn-success" onClick={exportAppointments}>
                  <i className="fas fa-file-export me-2"></i>
                  Export (CSV)
                </button>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yuklanmoqda...</span>
                  </div>
                </div>
              ) : appointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table admin-table">
                    <thead>
                      <tr>
                        <th>Bemor</th>
                        <th>Telefon</th>
                        <th>Shifokor</th>
                        <th>Sana</th>
                        <th>Vaqt</th>
                        <th>Status</th>
                        <th>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt) => (
                        <tr key={apt._id}>
                          <td>{apt.fullName}</td>
                          <td>{apt.phone}</td>
                          <td>
                            {apt.doctorName}
                            <br />
                            <small className="text-muted">{getDepartmentName(apt.department)}</small>
                          </td>
                          <td>{formatDate(apt.date)}</td>
                          <td>{apt.time}</td>
                          <td>{getStatusBadge(apt.status)}</td>
                          <td>
                            <div className="btn-group btn-group-sm flex-wrap">
                              {apt.status === 'pending' && (
                                <button
                                  className="btn btn-success mb-1"
                                  onClick={() => updateAppointmentStatus(apt._id, 'confirmed')}
                                  title="Tasdiqlash"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              {apt.status === 'confirmed' && (
                                <button
                                  className="btn btn-primary mb-1"
                                  onClick={() => updateAppointmentStatus(apt._id, 'completed')}
                                  title="Yakunlash"
                                >
                                  <i className="fas fa-check-double"></i>
                                </button>
                              )}
                              {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                <button
                                  className="btn btn-warning mb-1"
                                  onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}
                                  title="Bekor qilish"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-danger mb-1"
                                onClick={() => deleteAppointment(apt._id)}
                                title="O'chirish"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Navbatlar yo'q</p>
                </div>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="admin-table-container">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row">
                <h4 className="mb-3 mb-md-0">
                  <i className="fas fa-comment-medical me-2"></i>
                  Shikoyatlar ro'yxati
                </h4>
                <button className="btn btn-success" onClick={exportComplaints}>
                  <i className="fas fa-file-export me-2"></i>
                  Export (CSV)
                </button>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yuklanmoqda...</span>
                  </div>
                </div>
              ) : complaints.length > 0 ? (
                <div className="table-responsive">
                  <table className="table admin-table">
                    <thead>
                      <tr>
                        <th>Ism</th>
                        <th>Telefon</th>
                        <th>Xabar</th>
                        <th>Sana</th>
                        <th>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td>{complaint.name}</td>
                          <td>{complaint.phone || 'Ko\'rsatilmagan'}</td>
                          <td>
                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {complaint.message}
                            </div>
                          </td>
                          <td>{formatDateTime(complaint.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteComplaint(complaint._id)}
                              title="O'chirish"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Shikoyatlar yo'q</p>
                </div>
              )}
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="admin-table-container">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row">
                <h4 className="mb-3 mb-md-0">
                  <i className="fas fa-user-md me-2" style={{color: '#17a2b8'}}></i>
                  Shifokorlar ro'yxati
                </h4>
                <button className="btn btn-primary" onClick={handleAddDoctor} style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderColor: '#667eea'}}>
                  <i className="fas fa-plus me-2"></i>
                  Yangi Shifokor
                </button>
              </div>
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Shifokorlar ro'yxatini boshqarish: Yangi shifokor qo'shing, mavjud shifokorlarni tahrirlang yoki o'chiring.
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yuklanmoqda...</span>
                  </div>
                </div>
              ) : doctors.length > 0 ? (
                <div className="row">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                      <div className="card doctor-card">
                        <div className="card-body">
                          <h5 className="card-title">{doctor.name}</h5>
                          <p className="card-text">
                            <span className="department-badge mb-2">{getDepartmentName(doctor.department)}</span>
                            <br />
                            {doctor.specialty && (
                              <>
                                <strong>Mutaxassisligi:</strong> {doctor.specialty}
                                <br />
                              </>
                            )}
                            <strong>Tajriba:</strong> {doctor.experience}
                            <br />
                            <strong>Telefon:</strong> {doctor.phone || 'Ko\'rsatilmagan'}
                          </p>
                          <div className="doctor-rating">
                            <i className="fas fa-star"></i>
                            <span>{doctor.rating}/5.0</span>
                          </div>
                          <div className="btn-group w-100 flex-wrap">
                            <button
                              className="btn btn-sm btn-primary mb-1"
                              onClick={() => handleEditDoctor(doctor)}
                            >
                              <i className="fas fa-edit"></i> Tahrirlash
                            </button>
                            <button
                              className="btn btn-sm btn-danger mb-1"
                              onClick={() => handleDeleteDoctor(doctor._id)}
                            >
                              <i className="fas fa-trash"></i> O'chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-user-md-slash fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Shifokorlar yo'q</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Doctor Modal */}
      <DoctorModal
        show={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        onSave={handleSaveDoctor}
        doctor={selectedDoctor}
        axiosConfig={axiosConfig}
      />
    </div>
  );
};

export default AdminDashboard;