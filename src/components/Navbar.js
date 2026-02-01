import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">دليل الموظفين</h1>
        <div className="navbar-subtitle">
          نظام إدارة معلومات الموظفين مع السير الذاتية
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
