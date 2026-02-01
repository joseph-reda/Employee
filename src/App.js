import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const handleEmployeeAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setEmployeeToEdit(null);
  };

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEmployeeToEdit(null);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <div className="main-content">
          <EmployeeList 
            key={refreshKey}
            onEditEmployee={handleEditEmployee}
          />
        </div>
        <div className="sidebar">
          <AddEmployee 
            onEmployeeAdded={handleEmployeeAdded}
            employeeToEdit={employeeToEdit}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default App;