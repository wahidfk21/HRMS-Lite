/**
 * Attendance List Component
 * Displays attendance records in a table with filtering
 */
import React, { useState } from 'react';
import Table from '../common/Table';
import Select from '../common/Select';
import Spinner from '../common/Spinner';
import './AttendanceList.css';

const AttendanceList = ({ attendance, employees, loading = false, onFilter }) => {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterEmployeeId(value);
    onFilter(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employee_id',
    },
    {
      header: 'Employee Name',
      accessor: 'employee_name',
    },
    {
      header: 'Department',
      accessor: 'department',
    },
    {
      header: 'Date',
      render: (row) => formatDate(row.date),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
  ];

  // Prepare employee options for filter: use id if present, else employee_id
  const employeeOptions = (employees || [])
    .filter((emp) => emp && (emp.employee_id != null || emp.id != null))
    .map((emp) => ({
      value: emp.id != null ? String(emp.id) : String(emp.employee_id),
      label: `${emp.full_name || 'Unknown'} (${emp.employee_id || '-'})`,
    }));

  if (loading) {
    return (
      <div className="attendance-list-loading">
        <Spinner size="large" />
        <p>Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="attendance-list">
      <div className="attendance-filter">
        <Select
          label="Filter by Employee"
          name="filter_employee"
          value={filterEmployeeId}
          onChange={handleFilterChange}
          options={employeeOptions}
          placeholder="All Employees"
        />
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-value">{(attendance || []).length}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-card stat-present">
          <div className="stat-value">
            {(attendance || []).filter((a) => a && a.status === 'Present').length}
          </div>
          <div className="stat-label">Present</div>
        </div>
        <div className="stat-card stat-absent">
          <div className="stat-value">
            {(attendance || []).filter((a) => a && a.status === 'Absent').length}
          </div>
          <div className="stat-label">Absent</div>
        </div>
      </div>

      <Table
        columns={columns}
        data={attendance || []}
        emptyMessage={
          filterEmployeeId
            ? 'No attendance records found for this employee.'
            : 'No attendance records found. Mark attendance above.'
        }
      />
    </div>
  );
};

export default AttendanceList;
