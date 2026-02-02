import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import DepartmentManager from './components/DepartmentManager';
import CVViewer from './components/CVViewer';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [activeSection, setActiveSection] = useState('employees');

  const handleEmployeeAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setEmployeeToEdit(null);
  };

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setActiveSection('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEmployeeToEdit(null);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'departments':
        return <DepartmentManager />;
      case 'add':
        return (
          <AddEmployee 
            onEmployeeAdded={handleEmployeeAdded}
            employeeToEdit={employeeToEdit}
            onCancelEdit={handleCancelEdit}
          />
        );
      default:
        return (
          <EmployeeList 
            key={refreshKey}
            onEditEmployee={handleEditEmployee}
          />
        );
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        
        {/* شريط التنقل الداخلي */}
        <div className="internal-navbar">
          <div className="nav-buttons">
            <button 
              className={`nav-btn ${activeSection === 'employees' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('employees');
                setEmployeeToEdit(null);
              }}
            >
              👥 قائمة الموظفين
            </button>
            <button 
              className={`nav-btn ${activeSection === 'add' ? 'active' : ''}`}
              onClick={() => setActiveSection('add')}
            >
              {employeeToEdit ? '✏️ تعديل موظف' : '➕ إضافة موظف'}
            </button>
            <button 
              className={`nav-btn ${activeSection === 'departments' ? 'active' : ''}`}
              onClick={() => setActiveSection('departments')}
            >
              🏢 إدارة الأقسام
            </button>
          </div>
        </div>
        
        <div className="app-container">
          <div className="main-content">
            {renderContent()}
          </div>
        </div>

        {/* تعريف الروات */}
        <Routes>
          <Route path="/cv/:id" element={<CVViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;