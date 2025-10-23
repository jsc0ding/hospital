import { API_ENDPOINTS } from '../konstantalar';

/**
 * Fetch doctors from API
 * @returns {Promise<Array>} Array of doctor objects
 */
export const fetchDoctors = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.DOCTORS, {
      headers: {
        'Content-Type': 'application/json'
      },
      // Include credentials for CORS
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Handle both array response and object with doctors property
      if (Array.isArray(data)) {
        return data;
      } else if (data.doctors && Array.isArray(data.doctors)) {
        return data.doctors;
      } else if (data.data && Array.isArray(data.data)) {
        // Handle case where data is wrapped in a data property
        return data.data;
      } else {
        // If we can't determine the format, return empty array
        return [];
      }
    } else {
      // If API call fails, throw error to be caught below
      const errorText = await response.text();
      throw new Error(`Failed to fetch doctors from API. Status: ${response.status}. Error: ${errorText}`);
    }
  } catch (err) {
    // Show a more descriptive error to the user
    throw new Error(`Shifokorlar ro'yxatini olishda xatolik yuz berdi: ${err.message}`);
  }
};

/**
 * Fetch appointments from API
 * @returns {Promise<Array>} Array of appointment objects
 */
export const fetchAppointments = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.APPOINTMENTS, {
      headers: {
        'Content-Type': 'application/json'
      },
      // Include credentials for CORS
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment data to submit
 * @returns {Promise<Object>} Response object with success status
 */
export const fetchTimeSlots = async (date, doctorId) => {
  try {
    if (!date || !doctorId) {
      throw new Error('Date and doctorId are required');
    }
    
    const response = await fetch(`${API_ENDPOINTS.APPOINTMENTS}/time-slots?date=${date}&doctorId=${doctorId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      // Include credentials for CORS
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(API_ENDPOINTS.APPOINTMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData),
      // Include credentials for CORS
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText, status: response.status };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const createComplaint = async (complaintData) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.COMPLAINTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(complaintData),
      // Include credentials for CORS
      credentials: 'include'
    });
    
    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      throw new Error('Failed to submit complaint');
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Create a new doctor
 * @param {Object} doctorData - Doctor data to submit
 * @returns {Promise<Object>} Response object with success status
 */
export const createDoctor = async (doctorData) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('Admin token not found. Please log in.');
    }
    
    const response = await fetch(API_ENDPOINTS.DOCTORS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(doctorData),
      // Include credentials for CORS
      credentials: 'include'
    });
    
    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      throw new Error('Failed to create doctor');
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Delete a doctor
 * @param {String} doctorId - ID of the doctor to delete
 * @returns {Promise<Object>} Response object with success status
 */
export const deleteDoctor = async (doctorId) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('Admin token not found. Please log in.');
    }
    
    const response = await fetch(`${API_ENDPOINTS.DOCTORS}/${doctorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      // Include credentials for CORS
      credentials: 'include'
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      throw new Error('Failed to delete doctor');
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Update a doctor
 * @param {String} doctorId - ID of the doctor to update
 * @param {Object} doctorData - Updated doctor data
 * @returns {Promise<Object>} Response object with success status
 */
export const updateDoctor = async (doctorId, doctorData) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('Admin token not found. Please log in.');
    }
    
    const response = await fetch(`${API_ENDPOINTS.DOCTORS}/${doctorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(doctorData),
      // Include credentials for CORS
      credentials: 'include'
    });
    
    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      throw new Error('Failed to update doctor');
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};