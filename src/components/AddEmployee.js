import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
<<<<<<< HEAD
import { DEPARTMENTS } from "../constants/departments";
import "./AddEmployee.css";

const AddEmployee = ({ onEmployeeAdded, employeeToEdit, onCancelEdit }) => {
=======
import "./AddEmployee.css";

const AddEmployee = ({ onEmployeeAdded, employeeToEdit, onCancelEdit }) => {
  // دالة لتحويل الملف إلى Base64
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
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
<<<<<<< HEAD
    department: DEPARTMENTS[0].en, // استخدام الإنجليزية
=======
    department: "مدني",
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
    photo: null,
    cv: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب جميع الأقسام بالإنجليزية فقط
  const departmentsEnglish = DEPARTMENTS.map(dept => dept.en);

=======

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
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
  useEffect(() => {
    if (employeeToEdit) {
      setIsEditing(true);
      setFormData({
        name: employeeToEdit.name || "",
        age: employeeToEdit.age || "",
        experience: employeeToEdit.experience || "",
<<<<<<< HEAD
        department: employeeToEdit.department || DEPARTMENTS[0].en,
=======
        department: employeeToEdit.department || "مدني",
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        photo: null,
        cv: null,
      });
      
      if (employeeToEdit.photoBase64 || employeeToEdit.photoURL) {
        setPhotoPreview(employeeToEdit.photoBase64 || employeeToEdit.photoURL);
      }
    } else {
      setIsEditing(false);
<<<<<<< HEAD
      // إعادة التعيين عند عدم التعديل
      setFormData({
        name: "",
        age: "",
        experience: "",
        department: DEPARTMENTS[0].en,
        photo: null,
        cv: null,
      });
      setPhotoPreview(null);
=======
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
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

<<<<<<< HEAD
=======
    // معاينة الصورة
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
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
<<<<<<< HEAD
    
    // التحقق من صحة الاسم فقط (الاسم فقط إجباري)
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم الموظف");
      return;
    }

    setIsSubmitting(true);
=======
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a

    try {
      let photoBase64 = "";
      let cvBase64 = "";

      if (formData.photo) {
        photoBase64 = await convertToBase64(formData.photo);
      } else if (employeeToEdit && employeeToEdit.photoBase64) {
<<<<<<< HEAD
=======
        // استخدام الصورة الحالية إذا لم يتم اختيار جديدة
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        photoBase64 = employeeToEdit.photoBase64;
      }

      if (formData.cv) {
        cvBase64 = await convertToBase64(formData.cv);
      } else if (employeeToEdit && employeeToEdit.cvBase64) {
<<<<<<< HEAD
=======
        // استخدام السيرة الذاتية الحالية إذا لم يتم اختيار جديدة
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        cvBase64 = employeeToEdit.cvBase64;
      }

      const employeeData = {
<<<<<<< HEAD
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        experience: formData.experience ? parseInt(formData.experience) : null,
        department: formData.department, // تخزين بالإنجليزية
=======
        name: formData.name,
        age: parseInt(formData.age),
        experience: parseInt(formData.experience),
        department: formData.department,
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        photoBase64: photoBase64,
        cvBase64: cvBase64,
        updatedAt: new Date(),
      };

      if (isEditing && employeeToEdit) {
<<<<<<< HEAD
=======
        // تحديث الموظف الموجود
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        const employeeRef = doc(db, "employees", employeeToEdit.id);
        await updateDoc(employeeRef, employeeData);
        alert("✅ تم تحديث بيانات الموظف بنجاح!");
      } else {
<<<<<<< HEAD
=======
        // إضافة موظف جديد
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        employeeData.createdAt = new Date();
        await addDoc(collection(db, "employees"), employeeData);
        alert("✅ تم إضافة الموظف بنجاح!");
      }
      
<<<<<<< HEAD
      resetForm();
      
=======
      // إعادة تعيين النموذج
      resetForm();
      
      // إعلام المكون الأب بالتحديث
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }

    } catch (error) {
      console.error("Error saving employee:", error);
      alert("❌ حدث خطأ أثناء حفظ البيانات");
<<<<<<< HEAD
    } finally {
      setIsSubmitting(false);
=======
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      experience: "",
<<<<<<< HEAD
      department: DEPARTMENTS[0].en,
=======
      department: "مدني",
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
      photo: null,
      cv: null,
    });
    setPhotoPreview(null);
    setIsEditing(false);
<<<<<<< HEAD
    
    // إعادة تعيين حقول الملفات
    const photoInput = document.getElementById("photo-input");
    const cvInput = document.getElementById("cv-input");
    if (photoInput) photoInput.value = "";
    if (cvInput) cvInput.value = "";
=======
    document.getElementById("photo-input").value = "";
    document.getElementById("cv-input").value = "";
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
    
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleCancel = () => {
<<<<<<< HEAD
    if (isEditing && (formData.name || formData.age || formData.experience || formData.photo || formData.cv)) {
      if (window.confirm("هل تريد إلغاء التعديلات؟ سيتم فقدان التغييرات غير المحفوظة.")) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  return (
    <div className={`add-employee-container ${isEditing ? 'editing' : 'adding'}`}>
      <h2>{isEditing ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="name">اسم الموظف: *</label>
=======
    resetForm();
  };

  return (
    <div className="add-employee-container">
      <h2>{isEditing ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="name">اسم الموظف:</label>
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
<<<<<<< HEAD
            placeholder="أدخل اسم الموظف"
            disabled={isSubmitting}
          />
          <small className="form-hint">هذا الحقل إجباري</small>
=======
          />
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
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
<<<<<<< HEAD
            placeholder="اختياري"
            disabled={isSubmitting}
          />
          <small className="form-hint">اختياري - بين 18 و 70 سنة</small>
=======
            required
          />
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
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
<<<<<<< HEAD
            placeholder="اختياري"
            disabled={isSubmitting}
          />
          <small className="form-hint">اختياري - عدد سنوات الخبرة</small>
=======
            required
          />
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        </div>

        <div className="form-group">
          <label htmlFor="department">القسم:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
<<<<<<< HEAD
            disabled={isSubmitting}
          >
            {departmentsEnglish.map((dept, index) => (
=======
            required
          >
            {departments.map((dept, index) => (
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
<<<<<<< HEAD
          <small className="form-hint">اختياري - سيتم اختيار أول قسم افتراضيًا</small>
=======
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
        </div>

        <div className="form-group">
          <label htmlFor="photo">صورة الموظف:</label>
          <input
            type="file"
            id="photo-input"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
<<<<<<< HEAD
            disabled={isSubmitting}
=======
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
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
<<<<<<< HEAD
          {!formData.photo && !photoPreview && isEditing && employeeToEdit?.photoBase64 && (
            <small className="file-info">الصورة الحالية محفوظة</small>
          )}
          <small className="form-hint">اختياري - يُفضل صورة شخصية</small>
        </div>

        <div className="form-group">
          <label htmlFor="cv">السيرة الذاتية:</label>
=======
        </div>

        <div className="form-group">
          <label htmlFor="cv">السيرة الذاتية (PDF):</label>
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
          <input
            type="file"
            id="cv-input"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
<<<<<<< HEAD
            disabled={isSubmitting}
=======
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
          />
          {formData.cv && (
            <small>تم اختيار: {formData.cv.name}</small>
          )}
<<<<<<< HEAD
          {!formData.cv && isEditing && employeeToEdit?.cvBase64 && (
            <small className="file-info">السيرة الذاتية الحالية محفوظة</small>
          )}
          <small className="form-hint">اختياري - PDF, DOC, DOCX</small>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>⏳ جاري الحفظ...</>
            ) : isEditing ? (
              <>💾 حفظ التعديلات</>
            ) : (
              <>➕ إضافة الموظف</>
            )}
          </button>
          
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {isEditing ? "✕ إلغاء التعديل" : "🗑️ مسح النموذج"}
          </button>
        </div>

      
=======
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
>>>>>>> 479494612b23f6b93d78889813b1d13234e4663a
      </form>
    </div>
  );
};

export default AddEmployee;