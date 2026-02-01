import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "./AddEmployee.css";

const AddEmployee = ({ onEmployeeAdded, employeeToEdit, onCancelEdit }) => {
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

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // تحديث النموذج عند التعديل
  useEffect(() => {
    if (employeeToEdit) {
      setIsEditing(true);
      setFormData({
        name: employeeToEdit.name || "",
        age: employeeToEdit.age || "",
        experience: employeeToEdit.experience || "",
        department: employeeToEdit.department || "مدني",
        photo: null,
        cv: null,
      });
      
      if (employeeToEdit.photoBase64 || employeeToEdit.photoURL) {
        setPhotoPreview(employeeToEdit.photoBase64 || employeeToEdit.photoURL);
      }
    } else {
      setIsEditing(false);
    }
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    setFormData({
      ...formData,
      [name]: file,
    });

    // معاينة الصورة
    if (name === 'photo' && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let photoBase64 = "";
      let cvBase64 = "";

      if (formData.photo) {
        photoBase64 = await convertToBase64(formData.photo);
      } else if (employeeToEdit && employeeToEdit.photoBase64) {
        // استخدام الصورة الحالية إذا لم يتم اختيار جديدة
        photoBase64 = employeeToEdit.photoBase64;
      }

      if (formData.cv) {
        cvBase64 = await convertToBase64(formData.cv);
      } else if (employeeToEdit && employeeToEdit.cvBase64) {
        // استخدام السيرة الذاتية الحالية إذا لم يتم اختيار جديدة
        cvBase64 = employeeToEdit.cvBase64;
      }

      const employeeData = {
        name: formData.name,
        age: parseInt(formData.age),
        experience: parseInt(formData.experience),
        department: formData.department,
        photoBase64: photoBase64,
        cvBase64: cvBase64,
        updatedAt: new Date(),
      };

      if (isEditing && employeeToEdit) {
        // تحديث الموظف الموجود
        const employeeRef = doc(db, "employees", employeeToEdit.id);
        await updateDoc(employeeRef, employeeData);
        alert("✅ تم تحديث بيانات الموظف بنجاح!");
      } else {
        // إضافة موظف جديد
        employeeData.createdAt = new Date();
        await addDoc(collection(db, "employees"), employeeData);
        alert("✅ تم إضافة الموظف بنجاح!");
      }
      
      // إعادة تعيين النموذج
      resetForm();
      
      // إعلام المكون الأب بالتحديث
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }

    } catch (error) {
      console.error("Error saving employee:", error);
      alert("❌ حدث خطأ أثناء حفظ البيانات");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      experience: "",
      department: "مدني",
      photo: null,
      cv: null,
    });
    setPhotoPreview(null);
    setIsEditing(false);
    document.getElementById("photo-input").value = "";
    document.getElementById("cv-input").value = "";
    
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="add-employee-container">
      <h2>{isEditing ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}</h2>
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
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="معاينة الصورة" />
              <small>معاينة الصورة</small>
            </div>
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
          {employeeToEdit?.cvBase64 && !formData.cv && (
            <small>السيرة الذاتية الحالية محفوظة</small>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditing ? "💾 حفظ التعديلات" : "➕ إضافة الموظف"}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
            >
              ✕ إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;