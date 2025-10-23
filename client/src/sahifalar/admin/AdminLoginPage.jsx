import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../komponentlar/context/AuthContext';
import '../../uslublar/admin.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Validate input
    if (!code) {
      setError('Kodni kiriting');
      setLoading(false);
      return;
    }

    const result = await login(code);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
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
                <i className="fas fa-lock me-2"></i>Kirish kodi
              </label>
              <input
                type="password"
                className="form-control"
                id="code"
                name="code"
                value={code}
                onChange={handleChange}
                placeholder="•••"
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
              onClick={() => navigate('/')}
              disabled={loading}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;