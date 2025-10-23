import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../komponentlar/context/AuthContext';
import '../../uslublar/admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCode(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Remove debug log for production
    try {
      const result = await login(code);
      // Remove debug log for production
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Tizimga kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeButtonClick = () => {
    const currentTime = new Date().getTime();
    
    // Reset count if more than 2 seconds have passed
    if (currentTime - lastClickTime.current > 2000) {
      clickCount.current = 0;
    }
    
    clickCount.current += 1;
    lastClickTime.current = currentTime;
    
    // If clicked 3 times within 2 seconds, auto-login as admin
    if (clickCount.current >= 3) {
      // Auto-login with default admin code
      autoLoginAsAdmin();
      clickCount.current = 0;
    } else {
      navigate('/');
    }
  };

  const autoLoginAsAdmin = async () => {
    setLoading(true);
    // Try to login with default admin code
    const result = await login('12345678');
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Admin Panel</h2>
            <p>Tizimga kirish</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="code" className="form-label">
                <i className="fas fa-lock me-2"></i>Admin kodi
              </label>
              <input
                type="password"
                className="form-control"
                id="code"
                name="code"
                value={code}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Kirish...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Kirish
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <button
              className="btn btn-link"
              onClick={handleHomeButtonClick}
              disabled={loading}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Bosh sahifaga qaytish
            </button>
            <p className="text-muted small mt-2">
              Bosh sahifaga 3 marta bosish orqali avtomatik kirish
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;