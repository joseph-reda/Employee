import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import EmployeeCard from "./EmployeeCard";
import FilterBar from "./FilterBar";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("جميع الأقسام");
  const [loading, setLoading] = useState(true);

  // استخدام useCallback لـ fetchEmployees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeesList = [];
      querySnapshot.forEach((doc) => {
        employeesList.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(employeesList);
      
      // تطبيق التصفية بعد جلب البيانات
      if (selectedDepartment === "جميع الأقسام") {
        setFilteredEmployees(employeesList);
      } else {
        const filtered = employeesList.filter(
          (employee) => employee.department === selectedDepartment
        );
        setFilteredEmployees(filtered);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment]);

  // استخدام useCallback لـ filterEmployees
  const filterEmployees = useCallback(() => {
    if (selectedDepartment === "جميع الأقسام") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) => employee.department === selectedDepartment
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, selectedDepartment]);

  // useEffect لجلب البيانات عند التحميل الأولي
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); // تمت إضافة fetchEmployees إلى dependencies

  // useEffect للتصفية عند تغيير القسم أو البيانات
  useEffect(() => {
    filterEmployees();
  }, [selectedDepartment, employees, filterEmployees]);

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
            <EmployeeCard key={employee.id} employee={employee} />
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