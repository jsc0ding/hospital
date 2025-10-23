import { PHONE_REGEX, VALIDATION_MESSAGES } from '../konstantalar';

/**
 * Validate appointment form data
 * @param {Object} formData - Form data to validate
 * @param {boolean} includeDate - Whether to include date validation
 * @param {boolean} includeTime - Whether to include time validation
 * @returns {Object} Validation errors object
 */
export const validateAppointmentForm = (formData, includeDate = true, includeTime = true) => {
  const errors = {};
  
  // Fixed: Check for fullName properly
  if (!formData.fullName || !formData.fullName.trim()) {
    errors.fullName = VALIDATION_MESSAGES.REQUIRED_NAME;
  }
  
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = VALIDATION_MESSAGES.REQUIRED_PHONE;
  } else {
    // More flexible phone number validation
    // Accept various formats:
    // 1. +998 XX XXX XX XX
    // 2. 998XXXXXXXXX
    // 3. XXXXXXXXXX
    // 4. XXXXXXXXX
    const phoneRegex = /^(\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}|\+998\d{9}|998\d{9}|\d{10}|\d{9})$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;
    }
  }
  
  if (includeDate && (!formData.date || !formData.date.trim())) {
    errors.date = VALIDATION_MESSAGES.REQUIRED_DATE;
  } else if (includeDate && formData.date) {
    // Check if the date is in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for comparison
    
    if (selectedDate < today) {
      errors.date = VALIDATION_MESSAGES.INVALID_DATE;
    }
  }
  
  // Fixed: Simplified and corrected time validation logic
  if (includeTime) {
    if (!formData.time || !formData.time.trim()) {
      errors.time = VALIDATION_MESSAGES.REQUIRED_TIME;
    }
  }
  
  return errors;
};

/**
 * Check if form has validation errors
 * @param {Object} errors - Errors object from validation
 * @returns {boolean} True if form is valid (no errors)
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};