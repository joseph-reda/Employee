import React, { useState } from "react";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <div className="main-content">
          <EmployeeList key={refreshKey} />
        </div>
        <div className="sidebar">
          <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
        </div>
      </div>
    </div>
  );
}

export default App;
