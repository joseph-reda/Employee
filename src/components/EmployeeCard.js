import React, { useState } from "react";
import "./EmployeeCard.css";

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // دالة لإنشاء أفاتار افتراضي - معدلة لمعالجة الحالات الفارغة
  const getDefaultAvatar = (name) => {
    if (!name || name.trim() === "") {
      name = "Unknown";
    }
    
    const colors = [
      '#4299e1', '#38a169', '#ed8936', '#9f7aea',
      '#f56565', '#4fd1c7', '#ed64a6', '#667eea'
    ];

    const charIndex = name.charCodeAt(0) % colors.length;
    const color = colors[charIndex];

    // الحرف الأول من الاسم
    const firstLetter = name.charAt(0).toUpperCase();

    // إنشاء صورة SVG كبديل مع معالجة الأحرف العربية بشكل صحيح
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <rect width="150" height="150" fill="${color}" rx="8" ry="8"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="60" fill="white" 
            text-anchor="middle" dy="0.35em" dominant-baseline="central">${firstLetter}</text>
    </svg>`;
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  // دالة لتنزيل ملف PDF من Base64
  const downloadPDF = () => {
    if (employee.cvBase64) {
      setIsLoading(true);
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

        const byteString = atob(employee.cvBase64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `سيرة-ذاتية-${employee.name.replace(/\s+/g, '-')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('خطأ في تنزيل الملف:', error);
        alert('حدث خطأ أثناء تنزيل الملف');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // دالة لعرض PDF في نافذة جديدة
  const viewPDF = () => {
    if (employee.cvBase64) {
      const pdfWindow = window.open('', '_blank');
      pdfWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>السيرة الذاتية - ${employee.name}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f5f7fa;
              direction: rtl;
            }
            .container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              padding: 30px;
            }
            .header {
              background: linear-gradient(135deg, #2c3e50 0%, #4a6491 100%);
              color: white;
              padding: 25px;
              border-radius: 8px;
              margin-bottom: 25px;
              text-align: right;
            }
            .header h2 {
              margin: 0 0 10px 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              opacity: 0.9;
            }
            .pdf-viewer {
              width: 100%;
              height: 80vh;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            }
            .buttons {
              margin-top: 20px;
              text-align: center;
            }
            .btn {
              background: #4299e1;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              margin: 0 10px;
              transition: background 0.3s;
            }
            .btn:hover {
              background: #3182ce;
            }
            .btn-download {
              background: #38a169;
            }
            .btn-download:hover {
              background: #2f855a;
            }
            .note {
              text-align: center;
              color: #718096;
              margin-top: 15px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📄 السيرة الذاتية</h2>
              <p><strong>الاسم:</strong> ${employee.name}</p>
              <p><strong>القسم:</strong> ${employee.department}</p>
              <p><strong>السن:</strong> ${employee.age}</p>
              <p><strong>سنوات الخبرة:</strong> ${employee.experience}</p>
            </div>
            
            <iframe 
              class="pdf-viewer" 
              src="${employee.cvBase64}"
              title="السيرة الذاتية"
            ></iframe>
            
            <div class="buttons">
              <button class="btn" onclick="window.print()">🖨️ طباعة</button>
              <button class="btn btn-download" onclick="downloadFile()">⬇️ تنزيل</button>
              <button class="btn" onclick="window.close()">✕ إغلاق</button>
            </div>
            
            <div class="note">
              إذا لم يظهر الملف، اضغط على زر التنزيل
            </div>
          </div>
          
          <script>
            function downloadFile() {
              const link = document.createElement('a');
              link.href = '${employee.cvBase64}';
              link.download = 'سيرة-ذاتية-${employee.name.replace(/\\s+/g, '-')}.pdf';
              link.click();
            }
          </script>
        </body>
        </html>
      `);
      pdfWindow.document.close();
    } else if (employee.cvURL) {
      window.open(employee.cvURL, '_blank');
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(employee.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="employee-card">
      {/* مؤشر التحميل */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>جاري التنزيل...</span>
        </div>
      )}

      {/* أزرار التعديل والحذف */}
      <div className="employee-actions-overlay">
        <div className="actions-menu">
          <button
            className="action-btn edit-btn"
            onClick={handleEdit}
            title="تعديل بيانات الموظف"
            disabled={isLoading}
          >
            ✏️ تعديل
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            title="حذف الموظف"
            disabled={isLoading}
          >
            🗑️ حذف
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="confirm-box">
            <p>هل أنت متأكد من حذف الموظف <strong>{employee.name}</strong>؟</p>
            <p style={{ fontSize: '14px', color: '#718096', marginTop: '10px' }}>
              هذا الإجراء لا يمكن التراجع عنه
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-btn delete-confirm-btn"
                onClick={handleDelete}
              >
                نعم، احذف
              </button>
              <button
                className="confirm-btn cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="employee-image">
        <img
          src={employee.photoBase64 || employee.photoURL || getDefaultAvatar(employee.name)}
          alt={employee.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getDefaultAvatar(employee.name || "Unknown");
          }}
          loading="lazy"
        />
        <div className="employee-overlay">
          <span className="department-tag">{employee.department}</span>
        </div>
      </div>

      <div className="employee-info">
        <h3 className="employee-name">{employee.name || "اسم غير معروف"}</h3>

        <div className="employee-details">
          <div className="detail-item">
            <span className="detail-label">السن:</span>
            <span className="detail-value">{employee.age || "غير محدد"} سنة</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">الخبرة:</span>
            <span className="detail-value">{employee.experience || "0"} سنوات</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">القسم:</span>
            <span className={`department-badge department-${(employee.department || "غير محدد").replace(/\s+/g, '-').toLowerCase()}`}>
              {employee.department || "غير محدد"}
            </span>
          </div>
        </div>

        {(employee.cvBase64 || employee.cvURL) && (
          <div className="cv-actions">
            <button
              onClick={viewPDF}
              className="cv-button view-btn"
              disabled={isLoading}
            >
              👁️ عرض السيرة الذاتية
            </button>

            {employee.cvBase64 && (
              <button
                onClick={downloadPDF}
                className="cv-button download-btn"
                disabled={isLoading}
              >
                {isLoading ? '⬇️ جاري التنزيل...' : '⬇️ تنزيل السيرة الذاتية'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;