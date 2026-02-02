import React, { useState } from "react";
import { DEPARTMENTS, ALL_DEPARTMENTS, getArabicDepartment } from "../constants/departments";
import "./FilterBar.css";

const FilterBar = ({ selectedDepartment, onFilterChange, onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const departmentOptions = [ALL_DEPARTMENTS.en, ...DEPARTMENTS.map(dept => dept.en)];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (onSort) {
      onSort(value);
    }
  };

  const handleDepartmentClick = (dept) => {
    onFilterChange(dept);
  };

  return (
    <div className="filter-bar">
      <h3>تصفية وإدارة الموظفين</h3>
      
      {/* شريط البحث */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 ابحث عن موظف بالاسم..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* خيارات الترتيب */}
      <div className="sort-container">
        <label htmlFor="sort-select">ترتيب حسب:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="name">الاسم (أ-ي)</option>
          <option value="age">السن (تصاعدي)</option>
          <option value="experience">الخبرة (تنازلي)</option>
          <option value="department">القسم</option>
        </select>
      </div>

      {/* أزرار التصفية حسب القسم */}
      <h4 style={{ margin: "15px 0 10px 0", color: "#4a5568" }}>الأقسام:</h4>
      <div className="department-filters">
        {departmentOptions.map((dept, index) => (
          <button
            key={index}
            className={`filter-btn ${selectedDepartment === dept ? "active" : ""}`}
            onClick={() => handleDepartmentClick(dept)}
            title={dept === ALL_DEPARTMENTS.en ? "عرض جميع الموظفين" : getArabicDepartment(dept)}
          >
            {dept === ALL_DEPARTMENTS.en ? "جميع الأقسام" : dept}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;