import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchDoctors } from '../yordamchi_funksiyalar/api';
import { getDepartmentName, getDoctorImage } from '../konstantalar';

const Home = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of hospital images for rotation
  const heroImages = [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80',
    'https://images.unsplash.com/photo-1512678080530-7760d81faba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ];

  useEffect(() => {
    loadDoctors();
    
    // Set up image rotation interval
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctors = await fetchDoctors();
      setTeam(doctors.slice(0, 4)); // Show only first 4 doctors on home page
    } catch (err) {
      // Error handling is already in the API utility
    } finally {
      setLoading(false);
    }
  };

  // Hospital statistics data with icons
  const stats = [
    { number: '15+', label: 'Yillik Tajriba', icon: 'fas fa-calendar-alt' },
    { number: '50+', label: 'Mutaxassislar', icon: 'fas fa-user-md' },
    { number: '10000+', label: 'Bemorlar', icon: 'fas fa-users' },
    { number: '24/7', label: 'Xizmat', icon: 'fas fa-clock' }
  ];

  // Testimonials data with size variations
  const testimonials = [
    {
      id: 1,
      name: "Ali Valiyev",
      role: "Kardiologiya bemori",
      text: "Juda a’lo xizmat! Shifokorlar juda e’tiborli va muhit yoqimli.",
      rating: 5,
      date: "2025-10-12",
      avatar: "/img.png"
    },
    {
      id: 2,
      name: "Zarina Azizova",
      role: "Bolalar shifokori bemori",
      text: "Tibbiy xizmat sifati yuqori. Kutish vaqti ham qisqa bo‘ldi.",
      rating: 4,
      date: "2025-09-25",
      avatar: "/img.png"
    },
    {
      id: 3,
      name: "Otabek Karimov",
      role: "Stomatologiya bemori",
      text: "Shifokorlar juda tajribali, men juda mamnunman.",
      rating: 5,
      date: "2025-08-30",
      avatar: "/img.png"
    },
    {
      id: 4,
      name: "Dilnoza Raximova",
      role: "Terapevtika bemori",
      text: "Bu klinikaga tashrif buyurganimdan juda xursandman. Diagnostika aniq va tez, davolash esa samarali o'tdi.",
      rating: 5,
      date: "2025-08-15",
      avatar: "/img.png"
    },
    {
      id: 5,
      name: "Sanjar Tursunov",
      role: "LOR bemori",
      text: "Klinikada qabul qilish juda tartibli va professional. Har bir xodim o'z ishiga mas'uliyat bilan yondashadi.",
      rating: 4,
      date: "2025-07-22",
      avatar: "/img.png"
    },
    {
      id: 6,
      name: "Nigina Saidova",
      role: "Ginekologiya bemori",
      text: "Shifokor juda e'tiborli va tushunarli tushuntirdi. Juda minnatdorman!",
      rating: 5,
      date: "2025-07-10",
      avatar: "/img.png"
    }
  ];

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Function to render star ratings
  const renderRating = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < rating ? 'filled' : 'text-muted'}`}
      ></i>
    ));
  };

  return (
    <div className="page-content">
      {/* Hero Section - Modern Hospital Banner */}
      <section 
        className="hospital-hero"
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-heading">Sog‘lig‘ingiz Biz Uchun Eng Muhim</h1>
            <p className="hero-subheading">
              Tajribali shifokorlar jamoasi va zamonaviy klinikamiz bilan sizga sifatli tibbiy xizmat ko‘rsatamiz
            </p>
            <div className="hero-buttons">
              <Link to="/appointment-queue" className="btn btn-primary hero-btn">
                Navbatga yozilish
              </Link>
              <Link to="/doctors" className="btn btn-outline-light hero-btn">
                Shifokorlar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Redesigned */}
      <section className="team-section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-title">Mutaxassislarmiz</h2>
            <p className="section-subtitle">Klinikamizning bosh shifokorlari bilan tanishing</p>
          </div>

          <div className="team-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Shifokorlar yuklanmoqda...</p>
              </div>
            ) : team.length > 0 ? (
              team.map(doctor => (
                <div className="team-card" key={doctor._id}>
                  <div className="team-image">
                    <img
                      src={doctor.image || getDoctorImage(0, doctor._id || doctor.id)}
                      alt={doctor.name}
                      onError={(e) => { 
                        e.target.src = getDoctorImage(0, doctor._id || doctor.id);
                      }}
                    />
                    <div className="team-overlay">
                      <p>{doctor.bio || "Tajribali mutaxassis"}</p>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{doctor.name}</h3>
                    <div className="specialty">{getDepartmentName(doctor.department)}</div>
                    <p>{doctor.experience || "Ko'plab yillik tajriba"}</p>
                    <div className="rating">
                      {renderRating(doctor.rating || 4.5)}
                    </div>
                    <div className="doctor-card-buttons d-flex gap-2 mt-3">
                      <Link
                        to={`/doctor/${doctor._id || doctor.id}`}
                        className="btn btn-outline-primary flex-fill"
                      >
                        <i className="fas fa-info-circle me-1"></i> Batafsil
                      </Link>
                      <Link
                        to="/appointment-queue"
                        className="btn btn-outline-primary flex-fill"
                      >
                        <i className="fas fa-calendar-check me-1"></i> Navbat
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Hozircha shifokorlar mavjud emas. Iltimos, keyinroq qayta urinib ko'ring.</p>
              </div>
            )}
          </div>
          
          <div className="row">
            <div className="col-12 text-center mt-4">
              <Link to="/doctors" className="btn-modern-hero primary">
                <i className="fas fa-user-md"></i>
                Barcha Shifokorlar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Patient Reviews */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-heading text-center">
            <h2 className="section-title">Bemorlar Fikri</h2>
            <p className="section-subtitle">Bizning klinikamizdan foydalanayotgan bemorlarning minnatdorchilik so‘zlari</p>
          </div>

          <div className="testimonials-carousel">
            <Slider {...carouselSettings}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-slide">
                  <div className={`testimonial-card`}>
                    <div className="testimonial-header">
                      <div className="author-avatar">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/007BFF/FFFFFF?text=Patient'; }}
                        />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">{testimonial.name}</h4>
                        <p className="author-role">{testimonial.role}</p>
                        <div className="rating">
                          {renderRating(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="testimonial-content">
                      <p>"{testimonial.text}"</p>
                    </div>
                    <div className="testimonial-date">
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Hozir Navbat Oling</h2>
              <p className="cta-text">Sog'lig'ingiz - eng qimmatli boyligingiz. Hoziroq navbat oling va professional yordam oling.</p>
              <Link to="/appointment-queue" className="btn-cta">
                <i className="fas fa-calendar-check"></i>
                Navbatga Yozilish
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;