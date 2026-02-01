import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import EmployeeCard from "./EmployeeCard";
import FilterBar from "./FilterBar";
import "./EmployeeList.css";

const EmployeeList = ({ onEditEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("جميع الأقسام");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDepartment === "جميع الأقسام") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) => employee.department === selectedDepartment
      );
      setFilteredEmployees(filtered);
    }
  }, [selectedDepartment, employees]);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeesList = [];
      querySnapshot.forEach((doc) => {
        employeesList.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(employeesList);
      setFilteredEmployees(employeesList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="loading">جاري تحميل بيانات الموظفين...</div>;
  }

  return (
    <div className="employee-list-container">
      <FilterBar 
        selectedDepartment={selectedDepartment}
        onFilterChange={setSelectedDepartment}
      />
      
      <div className="employees-count">
        عدد الموظفين المعروضين: {filteredEmployees.length}
      </div>
      
      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no-employees">
            لا يوجد موظفين في هذا القسم
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;