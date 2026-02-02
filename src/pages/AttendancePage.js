/**
 * Attendance Management Page
 * Integrates AttendanceForm and AttendanceList with API calls
 */
import React, { useState, useEffect } from 'react';
import AttendanceForm from '../components/attendance/AttendanceForm';
import AttendanceList from '../components/attendance/AttendanceList';
import { getAllEmployees } from '../services/employeeService';
import { getAllAttendance, markAttendance } from '../services/attendanceService';
import './AttendancePage.css';

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filterEmployeeId, setFilterEmployeeId] = useState(null);

  // Fetch employees and attendance on component mount
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      setEmployees(list);
    } catch (error) {
      showNotification('error', 'Failed to fetch employees.');
    }
  };

  const fetchAttendance = async (employeeId = null) => {
    try {
      setLoading(true);
      const response = await getAllAttendance(employeeId);
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      setAttendance(list);
    } catch (error) {
      showNotification('error', 'Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData, resetForm) => {
    try {
      setSubmitLoading(true);
      const response = await markAttendance(formData);
      const ok = response && (response.success === true);
      if (ok) {
        showNotification('success', response.message || 'Attendance marked successfully!');
        fetchAttendance(filterEmployeeId);
        if (resetForm) resetForm(); // Clear form after success
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.error || 'Failed to mark attendance. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFilter = (employeeId) => {
    // Keep as string for MongoDB ObjectId
    const empId = employeeId && employeeId !== '' ? employeeId : null;
    setFilterEmployeeId(empId);
    fetchAttendance(empId);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Auto-hide after 5 seconds
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-description">
          Mark daily attendance and view attendance records
        </p>
      </div>

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button className="notification-close" onClick={closeNotification}>
            ×
          </button>
        </div>
      )}

      {(employees || []).length === 0 && !loading ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">👥</div>
          <h3>No Employees Found</h3>
          <p>Please add employees first before marking attendance.</p>
          <a href="/employees" className="empty-state-link">
            Go to Employee Management
          </a>
        </div>
      ) : (
        <>
          <div className="section">
            <h2 className="section-title">
              <span>✓</span> Mark Attendance
            </h2>
            <AttendanceForm
              employees={employees}
              onSubmit={handleSubmit}
              loading={submitLoading}
            />
          </div>

          <div className="section">
            <h2 className="section-title">
              <span>📋</span> Attendance Records ({(attendance || []).length})
            </h2>
            <AttendanceList
              attendance={attendance}
              employees={employees}
              loading={loading}
              onFilter={handleFilter}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
