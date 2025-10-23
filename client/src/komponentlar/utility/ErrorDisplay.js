import React from 'react';

// Component to display an error message with optional retry button
const ErrorDisplay = ({ message = "Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.", onRetry }) => {
  return (
    <div className="error-display d-flex flex-column align-items-center justify-content-center my-5">
      <div className="error-icon mb-4">
        <i className="fas fa-exclamation-triangle fa-4x text-danger"></i>
      </div>
      
      <h4 className="error-title text-danger mb-3">Xatolik yuz berdi</h4>
      
      <p className="error-message text-muted text-center mb-4 px-3">{message}</p>
      
      {onRetry && (
        <button className="btn btn-primary btn-lg" onClick={onRetry}>
          <i className="fas fa-sync me-2"></i>
          Qayta urinish
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;