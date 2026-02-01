import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "./AddEmployee.css";

const AddEmployee = ({ onEmployeeAdded }) => {
  // دالة لتحويل الملف إلى Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    experience: "",
    department: "مدني",
    photo: null,
    cv: null,
  });

  const departments = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  // دالة handleSubmit المكتملة
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let photoBase64 = "";
      let cvBase64 = "";

      // تحويل الصورة إلى Base64
      if (formData.photo) {
        photoBase64 = await convertToBase64(formData.photo);
      }

      // تحويل ملف PDF إلى Base64
      if (formData.cv) {
        cvBase64 = await convertToBase64(formData.cv);
      }

      // حفظ في Firestore
      const employeeData = {
        name: formData.name,
        age: parseInt(formData.age),
        experience: parseInt(formData.experience),
        department: formData.department,
        photoBase64: photoBase64,
        cvBase64: cvBase64,
        createdAt: new Date(),
      };

      // تمت إزالة تحذير no-unused-vars
      await addDoc(collection(db, "employees"), employeeData);
      
      // إظهار رسالة نجاح
      alert('✅ تم إضافة الموظف بنجاح!');
      
      // إعادة تعيين النموذج
      setFormData({
        name: "",
        age: "",
        experience: "",
        department: "مدني",
        photo: null,
        cv: null,
      });

      // إعادة تعيين حقول الملفات
      document.getElementById("photo-input").value = "";
      document.getElementById("cv-input").value = "";

      // إعلام المكون الأب بالتحديث
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }

    } catch (error) {
      console.error("Error adding employee:", error);
      alert('❌ حدث خطأ أثناء إضافة الموظف');
    }
  };

  return (
    <div className="add-employee-container">
      <h2>إضافة موظف جديد</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="name">اسم الموظف:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">السن:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="70"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">سنوات الخبرة:</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            max="50"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">القسم:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="photo">صورة الموظف:</label>
          <input
            type="file"
            id="photo-input"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.photo && (
            <small>تم اختيار: {formData.photo.name}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cv">السيرة الذاتية (PDF):</label>
          <input
            type="file"
            id="cv-input"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {formData.cv && (
            <small>تم اختيار: {formData.cv.name}</small>
          )}
        </div>

        <button type="submit" className="submit-btn">
          إضافة الموظف
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;