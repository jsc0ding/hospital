import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../komponentlar/context/AuthContext';
import '../../uslublar/admin.css';

export default function EnhancedAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const result = await login(code);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Kod xato!');
        setCode('');
      }
    } catch (err) {
      setError('Kirishda xatolik yuz berdi');
      setCode('');
    }

    setIsLoading(false);
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Admin Panelga Kirish</h2>
            <p>Xavfsizlik uchun maxfiy kodni kiriting</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="code" className="form-label">
                <i className="fas fa-lock"></i>Maxfiy kod
              </label>
              <input
                type="password"
                className="form-control"
                id="code"
                name="code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Tekshirilmoqda...
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
              onClick={handleHomeRedirect}
              type="button"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}