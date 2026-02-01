import React, { useState, useEffect } from "react";
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

  useEffect(() => {
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