/**
 * Main App Component
 * Sets up routing and layout
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="app-content">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/employees" replace />} />
              <Route path="/employees" element={<EmployeePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="*" element={<Navigate to="/employees" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
