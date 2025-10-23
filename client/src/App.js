import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './uslublar/home-updated.css';
import './uslublar/responsive.css';
import './uslublar/text-responsive.css'; // Added text responsive styles
import { AuthProvider } from './komponentlar/context/AuthContext';
import ProtectedRoute from './komponentlar/utility/ProtectedRoute';
import Header from './komponentlar/layout/Header';
import Footer from './komponentlar/layout/Footer';
import Home from './sahifalar/Home';
import Doctors from './sahifalar/Doctors';
import Contact from './sahifalar/Contact';
import AppointmentQueuePage from './sahifalar/AppointmentQueuePage';
import DoctorDetails from './sahifalar/DoctorDetails';
import AdminLoginPage from './sahifalar/admin/AdminLoginPage';
import EnhancedAdminLogin from './sahifalar/admin/EnhancedAdminLogin';
import AdminDashboard from './sahifalar/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App d-flex flex-column min-vh-100">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<EnhancedAdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Header />
                <main className="flex-shrink-0">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/doctors" element={
              <>
                <Header />
                <main className="flex-shrink-0">
                  <Doctors />
                </main>
                <Footer />
              </>
            } />
            <Route path="/doctor/:doctorId" element={
              <>
                <Header />
                <main className="flex-shrink-0">
                  <DoctorDetails />
                </main>
                <Footer />
              </>
            } />
            <Route path="/appointment-queue" element={
              <>
                <Header />
                <main className="flex-shrink-0">
                  <AppointmentQueuePage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <main className="flex-shrink-0">
                  <Contact />
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;