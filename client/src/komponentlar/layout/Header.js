import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Triple-click detection for admin panel
  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();

      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      // Clear existing timer
      if (clickTimer) {
        clearTimeout(clickTimer);
      }

      // If 3 clicks detected, navigate to admin
      if (newClickCount === 3) {
        navigate('/admin/login');
        setClickCount(0);
        setClickTimer(null);
        closeMenu();
        return;
      }

      // Reset counter after 1 second
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 1000);
      setClickTimer(timer);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when resizing window to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) { // Bootstrap lg breakpoint
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  // Function to determine if a nav item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header>
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center" onClick={closeMenu}
            style={{ outline: 'none', boxShadow: 'none' }}
            tabIndex={-1}
          >
            <span className="navbar-brand-text fw-bold" style={{ fontSize: '22px', color: '#2D89EF', cursor: 'pointer', outline: 'none', boxShadow: 'none' }}>
              🩺 MdQueen
            </span>
          </Link>

          <button
            className={`navbar-toggler ${isMenuOpen ? '' : 'collapsed'}`}
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={handleHomeClick}
                  style={{ fontSize: '16px', color: '#333333', gap: '30px' }}
                >
                  Bosh sahifa
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/doctors"
                  className={`nav-link ${isActive('/doctors') || isActive('/doctor') ? 'active' : ''}`}
                  onClick={closeMenu}
                  style={{ fontSize: '16px', color: '#333333', gap: '30px' }}
                >
                  Shifokorlar
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/appointment-queue"
                  className={`nav-link ${isActive('/appointment-queue') ? 'active' : ''}`}
                  onClick={closeMenu}
                  style={{ fontSize: '16px', color: '#333333', gap: '30px' }}
                >
                  Navbat olish
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                  onClick={closeMenu}
                  style={{ fontSize: '16px', color: '#333333', gap: '30px' }}
                >
                  Aloqa
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;