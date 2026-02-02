/**
 * Form validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate required field (non-empty)
 * @param {string} value - Value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

/**
 * Validate employee form data
 * @param {Object} formData - Employee form data
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateEmployeeForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.employee_id)) {
    errors.employee_id = 'Employee ID is required';
  }

  if (!isRequired(formData.full_name)) {
    errors.full_name = 'Full name is required';
  }

  if (!isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!isRequired(formData.department)) {
    errors.department = 'Department is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate attendance form data
 * @param {Object} formData - Attendance form data
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateAttendanceForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.employee_id)) {
    errors.employee_id = 'Please select an employee';
  }

  if (!isRequired(formData.date)) {
    errors.date = 'Date is required';
  }

  if (!isRequired(formData.status)) {
    errors.status = 'Please select attendance status';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} - Today's date
 */
export const getTodayDate = () => {
  return formatDate(new Date());
};
