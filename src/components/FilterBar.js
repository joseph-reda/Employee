import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import "./FilterBar.css";

const FilterBar = ({ selectedDepartment, onFilterChange, onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "departments"));
      const deptList = [];
      
      // إضافة خيار "جميع الأقسام"
      deptList.push({
        id: 'all',
        en: 'All Departments',
        ar: 'جميع الأقسام'
      });
      
      querySnapshot.forEach((doc) => {
        deptList.push({ id: doc.id, ...doc.data() });
      });
      
      setDepartments(deptList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      // استخدام الأقسام الافتراضية في حالة الخطأ
      setDepartments([
        { id: 'all', en: 'All Departments', ar: 'جميع الأقسام' }
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="filter-bar">
        <h3>تصفية وإدارة الموظفين</h3>
        <div className="loading-departments">
          <span>جاري تحميل الأقسام...</span>
        </div>
      </div>
    );
  }

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
        {departments.map((dept) => (
          <button
            key={dept.id}
            className={`filter-btn ${selectedDepartment === dept.en ? "active" : ""}`}
            onClick={() => handleDepartmentClick(dept.en)}
            title={dept.ar}
          >
            {dept.en === 'All Departments' ? dept.ar : dept.en}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;