/**
 * Employee Management Page
 * Integrates EmployeeForm and EmployeeList with API calls
 */
import React, { useState, useEffect } from 'react';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeList from '../components/employees/EmployeeList';
import { getAllEmployees, createEmployee, deleteEmployee } from '../services/employeeService';
import './EmployeePage.css';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      showNotification('error', 'Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData, resetForm) => {
    try {
      setSubmitLoading(true);
      const response = await createEmployee(formData);
      
      if (response.success) {
        showNotification('success', response.message || 'Employee added successfully!');
        fetchEmployees(); // Refresh list
        if (resetForm) resetForm(); // Clear form after success
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.error || 'Failed to add employee. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      showNotification('success', 'Employee deleted successfully!');
      fetchEmployees(); // Refresh list
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete employee. Please try again.';
      showNotification('error', errorMessage);
    }
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
        <h1 className="page-title">Employee Management</h1>
        <p className="page-description">
          Add new employees and manage existing employee records
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

      <div className="section">
        <h2 className="section-title">
          <span>➕</span> Add New Employee
        </h2>
        <EmployeeForm onSubmit={handleSubmit} loading={submitLoading} />
      </div>

      <div className="section">
        <h2 className="section-title">
          <span>👥</span> Employee List ({(employees || []).length})
        </h2>
        <EmployeeList
          employees={employees}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EmployeePage;
