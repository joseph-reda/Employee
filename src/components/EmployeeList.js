import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import EmployeeCard from "./EmployeeCard";
import FilterBar from "./FilterBar";
import "./EmployeeList.css";

const EmployeeList = ({ onEditEmployee, onViewCV }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageAge: 0,
    averageExperience: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterAndSortEmployees();
    calculateStats();
  }, [employees, selectedDepartment, searchTerm, sortBy]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeesList = [];
      
      querySnapshot.forEach((doc) => {
        employeesList.push({ 
          id: doc.id, 
          ...doc.data()
        });
      });
      
      setEmployees(employeesList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("❌ حدث خطأ في جلب بيانات الموظفين");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEmployees = () => {
    let filtered = [...employees];

    // التصفية حسب القسم
    if (selectedDepartment !== "All Departments") {
      filtered = filtered.filter(
        (employee) => employee.department === selectedDepartment
      );
    }

    // البحث حسب الاسم
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((employee) =>
        employee.name?.toLowerCase().includes(term)
      );
    }

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "age":
          return (a.age || 0) - (b.age || 0);
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        case "department":
          return (a.department || "").localeCompare(b.department || "");
        default:
          return 0;
      }
    });

    setFilteredEmployees(filtered);
  };

  const calculateStats = () => {
    if (employees.length === 0) {
      setStats({
        total: 0,
        averageAge: 0,
        averageExperience: 0
      });
      return;
    }

    const total = employees.length;
    const averageAge = employees.reduce((sum, emp) => sum + (emp.age || 0), 0) / total;
    const averageExperience = employees.reduce((sum, emp) => sum + (emp.experience || 0), 0) / total;

    setStats({
      total,
      averageAge: averageAge.toFixed(1),
      averageExperience: averageExperience.toFixed(1)
    });
  };

  const handleFilterChange = (department) => {
    setSelectedDepartment(department);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (sortField) => {
    setSortBy(sortField);
  };

  const handleEdit = (employee) => {
    if (onEditEmployee) {
      onEditEmployee(employee);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      try {
        await deleteDoc(doc(db, "employees", employeeId));
        alert("✅ تم حذف الموظف بنجاح!");
        fetchEmployees(); // تحديث القائمة
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("❌ حدث خطأ أثناء حذف الموظف");
      }
    }
  };

  const handleExportData = () => {
    if (filteredEmployees.length === 0) return;
    
    const dataToExport = filteredEmployees.map(emp => ({
      "الاسم": emp.name || "",
      "السن": emp.age || "",
      "الخبرة": emp.experience || "",
      "القسم": emp.department || ""
    }));

    const csvContent = "data:text/csv;charset=utf-8," 
      + ["الاسم,السن,الخبرة,القسم", ...dataToExport.map(e => 
          `"${e.الاسم}",${e.السن},${e.الخبرة},"${e.القسم}"`
        )].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "الموظفين.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    fetchEmployees();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري تحميل بيانات الموظفين...</p>
      </div>
    );
  }

  return (
    <div className="employee-list-container">
      {/* شريط الإحصائيات والإجراءات */}
      <div className="stats-actions-bar">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">إجمالي الموظفين:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">متوسط السن:</span>
            <span className="stat-value">{stats.averageAge}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">متوسط الخبرة:</span>
            <span className="stat-value">{stats.averageExperience} سنة</span>
          </div>
        </div>
        
        <div className="actions-container">
          <button 
            className="export-btn"
            onClick={handleExportData}
            disabled={filteredEmployees.length === 0}
          >
            📊 تصدير البيانات
          </button>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
          >
            🔄 تحديث القائمة
          </button>
        </div>
      </div>

      {/* شريط التصفية */}
      <FilterBar 
        selectedDepartment={selectedDepartment}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onSort={handleSort}
      />
      
      {/* عدد الموظفين المعروضين */}
      <div className="employees-count">
        <span>عدد الموظفين المعروضين: </span>
        <strong>{filteredEmployees.length}</strong>
        {searchTerm && (
          <span className="search-info">
            {" "}| نتيجة البحث عن: "{searchTerm}"
          </span>
        )}
      </div>
      
      {/* قائمة الموظفين */}
      <div className="employee-grid fade-in">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewCV={onViewCV}
            />
          ))
        ) : (
          <div className="no-employees">
            <div className="no-data-icon">📋</div>
            <h3>لا يوجد موظفين</h3>
            <p>
              {searchTerm 
                ? `لم يتم العثور على موظفين مطابقين لبحثك عن "${searchTerm}"`
                : selectedDepartment !== "All Departments"
                ? `لا يوجد موظفين في قسم ${selectedDepartment}`
                : "لم يتم إضافة أي موظفين بعد"
              }
            </p>
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
              >
                مسح البحث
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;