import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-light">
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="footer-info">
              <p className="mb-0 text-muted">
                © {currentYear} MedQueue. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="footer-links">
              <span className="text-muted">
                Tibbiy xizmatlar platformasi
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;