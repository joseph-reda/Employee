import React from "react";
import "./FilterBar.css";

const departments = [
  "All Departments",
  "Qc",
  "Survey",
  "Electrical",
  "Mechanical",
  "DC",
  "HR",
  "Accountants",
  "Safety",
  "Shop Drawing",
  "Executive Engineer",
  "QS",
  "Planning",
];

const FilterBar = ({ selectedDepartment, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <h3>تصفية حسب القسم:</h3>
      <div className="department-filters">
        {departments.map((dept, index) => (
          <button
            key={index}
            className={`filter-btn ${selectedDepartment === dept ? "active" : ""}`}
            onClick={() => onFilterChange(dept)}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
