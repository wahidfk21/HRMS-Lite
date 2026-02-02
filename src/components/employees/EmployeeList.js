/**
 * Employee List Component
 * Displays list of employees in a table with delete functionality
 */
import React, { useState } from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import './EmployeeList.css';

const EmployeeList = ({ employees, onDelete, loading = false }) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employee: null,
  });

  const handleDeleteClick = (employee) => {
    setDeleteModal({
      isOpen: true,
      employee,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.employee) {
      const idOrCode = deleteModal.employee.id ?? deleteModal.employee.employee_id;
      if (idOrCode != null) onDelete(idOrCode);
      setDeleteModal({ isOpen: false, employee: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, employee: null });
  };

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employee_id',
    },
    {
      header: 'Full Name',
      accessor: 'full_name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button
          variant="danger"
          size="small"
          onClick={() => handleDeleteClick(row)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="employee-list-loading">
        <Spinner size="large" />
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <Table
        columns={columns}
        data={employees || []}
        emptyMessage="No employees found. Add your first employee above."
      />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        title="Delete Employee"
        size="small"
        footer={
          <>
            <Button variant="secondary" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this employee?</p>
          {deleteModal.employee && (
            <div className="employee-details">
              <strong>{deleteModal.employee.full_name}</strong>
              <span className="employee-id">
                ({deleteModal.employee.employee_id})
              </span>
            </div>
          )}
          <p className="warning-text">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;
