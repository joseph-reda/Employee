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

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeesList = [];
      querySnapshot.forEach((doc) => {
        employeesList.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(employeesList);
      filterEmployees(employeesList, selectedDepartment);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = useCallback((employeesList, department) => {
    if (department === "جميع الأقسام") {
      setFilteredEmployees(employeesList);
    } else {
      const filtered = employeesList.filter(
        (employee) => employee.department === department
      );
      setFilteredEmployees(filtered);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees(employees, selectedDepartment);
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