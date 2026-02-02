/**
 * Employee API service
 * Handles all employee-related API calls
 */
import api from './api';

const EMPLOYEE_ENDPOINT = '/employees/';

/**
 * Get all employees
 * @returns {Promise} - Axios promise with employee list
 */
export const getAllEmployees = async () => {
  try {
    const response = await api.get(EMPLOYEE_ENDPOINT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise} - Axios promise with employee data
 */
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`${EMPLOYEE_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new employee
 * @param {Object} employeeData - Employee data object
 * @param {string} employeeData.employee_id - Unique employee ID
 * @param {string} employeeData.full_name - Full name
 * @param {string} employeeData.email - Email address
 * @param {string} employeeData.department - Department name
 * @returns {Promise} - Axios promise with created employee data
 */
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post(EMPLOYEE_ENDPOINT, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete employee by ID
 * @param {number} id - Employee ID to delete
 * @returns {Promise} - Axios promise
 */
export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`${EMPLOYEE_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
