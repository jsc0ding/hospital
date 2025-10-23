import React from 'react';
import './CustomAlert.css';

/**
 * Custom Alert Component
 * Provides a better user experience than browser's default alert
 */
const CustomAlert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  show = false,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = false
}) => {
  if (!show) return null;

  const getTypeClass = () => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-container">
        <div className={`custom-alert ${getTypeClass()}`}>
          <div className="alert-header">
            <i className={`fas ${getTypeIcon()} alert-icon`}></i>
            {title && <h4 className="alert-title">{title}</h4>}
          </div>
          
          <div className="alert-body">
            {message && <p className="alert-message">{message}</p>}
          </div>
          
          <div className="alert-footer">
            {showCancel && (
              <button 
                className="btn btn-secondary alert-btn"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
            )}
            <button 
              className={`btn ${type === 'error' ? 'btn-danger' : 'btn-primary'} alert-btn`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;