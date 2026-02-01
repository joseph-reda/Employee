import React from "react";
import "./FilterBar.css";

const departments = [
  "جميع الأقسام",
  "مدني",
  "معماري",
  "مساحة",
  "كهرباء",
  "ميكانيكة",
  "DC",
  "HR",
  "محاسبين",
  "سيفتي",
  "مكتب فني",
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
