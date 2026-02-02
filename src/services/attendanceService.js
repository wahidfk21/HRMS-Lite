/**
 * Attendance API service
 * Handles all attendance-related API calls
 */
import api from './api';

const ATTENDANCE_ENDPOINT = '/attendance/';

/**
 * Get all attendance records
 * @param {number|null} employeeId - Optional employee ID filter
 * @returns {Promise} - Axios promise with attendance list
 */
export const getAllAttendance = async (employeeId = null) => {
  try {
    const url = employeeId 
      ? `${ATTENDANCE_ENDPOINT}?employee_id=${employeeId}`
      : ATTENDANCE_ENDPOINT;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single attendance record by ID
 * @param {number} id - Attendance record ID
 * @returns {Promise} - Axios promise with attendance data
 */
export const getAttendanceById = async (id) => {
  try {
    const response = await api.get(`${ATTENDANCE_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark attendance (create new attendance record)
 * @param {Object} attendanceData - Attendance data object
 * @param {number} attendanceData.employee_id - Employee ID
 * @param {string} attendanceData.date - Date in YYYY-MM-DD format
 * @param {string} attendanceData.status - Status (Present/Absent)
 * @returns {Promise} - Axios promise with created attendance data
 */
export const markAttendance = async (attendanceData) => {
  try {
    const response = await api.post(ATTENDANCE_ENDPOINT, attendanceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete attendance record by ID
 * @param {number} id - Attendance record ID to delete
 * @returns {Promise} - Axios promise
 */
export const deleteAttendance = async (id) => {
  try {
    const response = await api.delete(`${ATTENDANCE_ENDPOINT}${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
