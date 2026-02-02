import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import "./DepartmentManager.css";

const DepartmentManager = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({ en: "", ar: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "departments"));
            const deptList = [];
            querySnapshot.forEach((doc) => {
                deptList.push({ id: doc.id, ...doc.data() });
            });
            setDepartments(deptList);
        } catch (error) {
            console.error("Error fetching departments:", error);
            setMessage("❌ حدث خطأ في جلب الأقسام");
        }
    };

    const handleAddDepartment = async () => {
        if (!newDepartment.en.trim() || !newDepartment.ar.trim()) {
            setMessage("⚠️ الرجاء إدخال اسم القسم باللغتين");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "departments"), {
                en: newDepartment.en.trim(),
                ar: newDepartment.ar.trim(),
                createdAt: new Date(),
                employeesCount: 0
            });

            setMessage("✅ تم إضافة القسم بنجاح");
            setNewDepartment({ en: "", ar: "" });
            fetchDepartments();
        } catch (error) {
            console.error("Error adding department:", error);
            setMessage("❌ حدث خطأ في إضافة القسم");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا القسم؟")) {
            try {
                await deleteDoc(doc(db, "departments", id));
                setMessage("✅ تم حذف القسم بنجاح");
                fetchDepartments();
            } catch (error) {
                console.error("Error deleting department:", error);
                setMessage("❌ حدث خطأ في حذف القسم");
            }
        }
    };

    return (
        <div className="department-manager">
            <h2>إدارة الأقسام</h2>

            {/* نموذج إضافة قسم جديد */}
            <div className="add-department-form">
                <h3>إضافة قسم جديد</h3>

                <div className="form-group">
                    <label>اسم القسم (إنجليزي):</label>
                    <input
                        type="text"
                        value={newDepartment.en}
                        onChange={(e) => setNewDepartment({ ...newDepartment, en: e.target.value })}
                        placeholder="مثال: Marketing"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>اسم القسم (عربي):</label>
                    <input
                        type="text"
                        value={newDepartment.ar}
                        onChange={(e) => setNewDepartment({ ...newDepartment, ar: e.target.value })}
                        placeholder="مثال: تسويق"
                        disabled={loading}
                    />
                </div>

                <button
                    className="add-btn"
                    onClick={handleAddDepartment}
                    disabled={loading}
                >
                    {loading ? "جاري الإضافة..." : "➕ إضافة القسم"}
                </button>
            </div>

            {/* رسائل النظام */}
            {message && (
                <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
                    {message}
                    <button onClick={() => setMessage("")} className="close-btn">✕</button>
                </div>
            )}

            {/* قائمة الأقسام */}
            <div className="departments-list">
                <h3>الأقسام الحالية ({departments.length})</h3>

                {departments.length === 0 ? (
                    <p className="no-data">لا توجد أقسام مضافة بعد</p>
                ) : (
                    <div className="departments-grid">
                        {departments.map((dept) => (
                            <div key={dept.id} className="department-card">
                                <div className="department-info">
                                    <h4>{dept.en}</h4>
                                    <p className="arabic-name">{dept.ar}</p>
                                    <div className="department-stats">
                                        <span>عدد الموظفين: {dept.employeesCount || 0}</span>
                                    </div>
                                </div>

                                <div className="department-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => alert("ميزة التعديل قيد التطوير")}
                                    >
                                        ✏️ تعديل
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteDepartment(dept.id)}
                                    >
                                        🗑️ حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentManager;