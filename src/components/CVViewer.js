import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "./CVViewer.css";

const CVViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("cv");

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "employees", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setEmployee({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("الموظف غير موجود");
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError("حدث خطأ في جلب بيانات الموظف");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (employee?.cvBase64) {
      try {
        const base64Parts = employee.cvBase64.split(';');
        const mimeType = base64Parts[0].split(':')[1];
        let extension = 'pdf';
        
        if (mimeType === 'application/pdf') {
          extension = 'pdf';
        } else if (mimeType === 'application/msword') {
          extension = 'doc';
        } else if (mimeType.includes('wordprocessingml')) {
          extension = 'docx';
        }
        
        const link = document.createElement('a');
        link.href = employee.cvBase64;
        link.download = `سيرة-ذاتية-${employee.name.replace(/\s+/g, '-')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('خطأ في تنزيل الملف:', error);
        alert('حدث خطأ أثناء تنزيل الملف');
      }
    }
  };

  const printPage = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="cv-viewer-container">
        <div className="loading-cv">
          <div className="spinner"></div>
          <p>جاري تحميل بيانات الموظف...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="cv-viewer-container">
        <div className="error-message">
          <h3>❌ {error || "الموظف غير موجود"}</h3>
          <button onClick={() => navigate(-1)} className="back-btn">
            ↩️ العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-viewer-container">
      {/* شريط الإجراءات */}
      <div className="cv-actions-bar">
        <button onClick={() => navigate(-1)} className="back-btn">
          ↩️ العودة للقائمة
        </button>
        
        <div className="action-buttons">
          <button onClick={printPage} className="print-btn">
            🖨️ طباعة
          </button>
          {employee.cvBase64 && (
            <button onClick={downloadPDF} className="download-btn">
              ⬇️ تنزيل السيرة الذاتية
            </button>
          )}
        </div>
      </div>

      {/* معلومات الموظف */}
      <div className="employee-header">
        <div className="employee-photo">
          {employee.photoBase64 ? (
            <img src={employee.photoBase64} alt={employee.name} />
          ) : (
            <div className="avatar-placeholder">
              {employee.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="employee-info">
          <h1>{employee.name}</h1>
          <div className="employee-details">
            <div className="detail-row">
              <span className="label">القسم:</span>
              <span className="value">{employee.department || "غير محدد"}</span>
            </div>
            <div className="detail-row">
              <span className="label">السن:</span>
              <span className="value">{employee.age || "غير محدد"} سنة</span>
            </div>
            <div className="detail-row">
              <span className="label">سنوات الخبرة:</span>
              <span className="value">{employee.experience || "0"} سنوات</span>
            </div>
            <div className="detail-row">
              <span className="label">تاريخ الإضافة:</span>
              <span className="value">
                {employee.createdAt ? new Date(employee.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : "غير محدد"}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">تاريخ التحديث:</span>
              <span className="value">
                {employee.updatedAt ? new Date(employee.updatedAt.seconds * 1000).toLocaleDateString('ar-SA') : "غير محدد"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* تبويب المحتوى */}
      <div className="content-tabs">
        <button 
          className={`tab-btn ${activeTab === "cv" ? "active" : ""}`}
          onClick={() => setActiveTab("cv")}
        >
          📄 السيرة الذاتية
        </button>
        <button 
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          👤 معلومات إضافية
        </button>
      </div>

      {/* محتوى التبويب */}
      <div className="tab-content">
        {activeTab === "cv" ? (
          <div className="cv-content">
            {employee.cvBase64 ? (
              <iframe 
                src={employee.cvBase64}
                title="السيرة الذاتية"
                className="cv-preview"
              />
            ) : (
              <div className="no-cv">
                <div className="no-cv-icon">📄</div>
                <h3>لا تتوفر سيرة ذاتية</h3>
                <p>لم يتم إضافة سيرة ذاتية لهذا الموظف</p>
              </div>
            )}
          </div>
        ) : (
          <div className="additional-info">
            <div className="info-section">
              <h3>المعلومات الأساسية</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">اسم الموظف:</span>
                  <span className="info-value">{employee.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">رقم التعريف:</span>
                  <span className="info-value">{employee.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الحالة:</span>
                  <span className="info-value active-badge">نشط</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>المعلومات الوظيفية</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">القسم:</span>
                  <span className="info-value department-badge">
                    {employee.department || "غير محدد"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">الخبرة:</span>
                  <span className="info-value experience-badge">
                    {employee.experience || "0"} سنوات
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">المستوى الوظيفي:</span>
                  <span className="info-value">
                    {employee.experience > 10 ? "خبير" : 
                     employee.experience > 5 ? "متوسط" : 
                     employee.experience > 2 ? "مبتدئ" : "جديد"}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>بيانات النظام</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">تاريخ الإنشاء:</span>
                  <span className="info-value">
                    {employee.createdAt ? 
                      new Date(employee.createdAt.seconds * 1000).toLocaleString('ar-SA') : 
                      "غير محدد"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">آخر تحديث:</span>
                  <span className="info-value">
                    {employee.updatedAt ? 
                      new Date(employee.updatedAt.seconds * 1000).toLocaleString('ar-SA') : 
                      "غير محدد"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* معلومات إضافية للطباعة */}
      <div className="print-footer">
        <p>تم إنشاء هذه الوثيقة بواسطة نظام إدارة الموظفين</p>
        <p>تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
    </div>
  );
};

export default CVViewer;