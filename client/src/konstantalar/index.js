// API Configuration
// Use environment-based base URL in production, same-origin in development
export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_API_URL || '')
    : '';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  DOCTORS: `${API_BASE_URL}/api/queue/doctors`,
  APPOINTMENTS: `${API_BASE_URL}/api/queue/appointments`,
  COMPLAINTS: `${API_BASE_URL}/api/queue/complaints`,
  AUTH: `${API_BASE_URL}/api/auth`,
  ADMIN: `${API_BASE_URL}/api/admin`,
};

// Department Names Mapping
export const DEPARTMENT_NAMES = {
  'kardiologiya': 'Kardiologiya',
  'stomatologiya': 'Stomatologiya',
  'terapevt': 'Terapevt',
  'bolalar': 'Bolalar shifokori',
  'dermatologiya': 'Dermatologiya',
  'ginekologiya': 'Ginekologiya',
  'nevrologiya': 'Nevrologiya',
  'oftalmologiya': 'Oftalmologiya',
  'lor': 'LOR',
  'ortopediya': 'Ortopediya',
  'urologiya': 'Urologiya',
  'endokrinologiya': 'Endokrinologiya',
  'gastroenterologiya': 'Gastroenterologiya',
  'onkologiya': 'Onkologiya',
  'fizioterapiya': 'Fizioterapiya',
  'massaj': 'Massaj'
};

// Phone Number Validation Pattern - more flexible to accept various formats
export const PHONE_REGEX = /^(\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}|\+998\d{9}|998\d{9}|\d{10}|\d{9})$/;

// Default Images
export const DEFAULT_IMAGES = {
  DOCTOR: '/doctors/doctor1.jpg',
  CLINIC: '/hospital.jpg',
  HERO: '/hospital.jpg',
  HOSPITAL: '/hospital.jpg',
  NAVBAR_LOGO: '/hospital.jpg'
};

// Array of professional doctor images from Unsplash
export const DOCTOR_IMAGES = [
  '/doctors/doctor1.jpg',
  '/doctors/doctor3.jpg',
  '/doctors/doctor4.jpg',
  '/doctors/doctor5.jpg',
  '/doctors/doctor6.jpg',
  '/doctors/doctor8.jpg',
  '/doctors/doctor9.jpg',
  '/doctors/doctor1.jpg',
  '/doctors/doctor3.jpg',
  '/doctors/doctor4.jpg',
  '/doctors/doctor5.jpg',
  '/doctors/doctor6.jpg',
  '/doctors/doctor8.jpg',
  '/doctors/doctor9.jpg',
];

// Time Options for Appointments
export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 9; hour <= 17; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 17) {
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return options;
};

// Utility function to get department display name
export const getDepartmentName = (departmentCode) => {
  return DEPARTMENT_NAMES[departmentCode] || departmentCode;
};

// Utility function to get doctor image by index or ID
export const getDoctorImage = (index = 0, doctorId = null) => {
  // Use doctor ID if available, otherwise use index
  const imageIndex = doctorId ? parseInt(doctorId.slice(-2), 16) % DOCTOR_IMAGES.length : index % DOCTOR_IMAGES.length;
  return DOCTOR_IMAGES[imageIndex];
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_NAME: 'Ismingizni kiriting',
  REQUIRED_PHONE: 'Telefon raqamingizni kiriting',
  INVALID_PHONE: 'To\'g\'ri telefon raqam kiriting (+998 XX XXX XX XX)',
  REQUIRED_TIME: 'Navbat vaqtini tanlang',
  REQUIRED_DATE: 'Sana tanlang',
  INVALID_DATE: 'Iltimos, bugungi yoki kelajakdagi sanani tanlang',
  SUBMIT_ERROR: 'Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.'
};