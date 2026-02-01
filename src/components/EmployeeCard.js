import React from "react";
import "./EmployeeCard.css";

const EmployeeCard = ({ employee }) => {
  // دالة لتنزيل ملف PDF من Base64
  const downloadPDF = () => {
    if (employee.cvBase64) {
      try {
        // استخراج نوع الملف من Base64
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
        
        // تحويل Base64 إلى blob
        const byteString = atob(employee.cvBase64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        // إنشاء رابط للتنزيل
        const link = document.createElement('a');
        link.href = url;
        link.download = `سيرة-ذاتية-${employee.name.replace(/\s+/g, '-')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // تحرير الذاكرة
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('خطأ في تنزيل الملف:', error);
        alert('حدث خطأ أثناء تنزيل الملف');
      }
    }
  };

  // دالة لعرض PDF في نافذة جديدة
  const viewPDF = () => {
    if (employee.cvBase64) {
      // إنشاء صفحة HTML لعرض PDF
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
      // إذا كان رابط خارجي
      window.open(employee.cvURL, '_blank');
    }
  };

  return (
    <div className="employee-card">
      <div className="employee-image">
        <img
          src={employee.photoBase64 || employee.photoURL || 'https://via.placeholder.com/150'}
          alt={employee.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </div>

      <div className="employee-info">
        <h3 className="employee-name">{employee.name}</h3>

        <div className="employee-details">
          <div className="detail-item">
            <span className="detail-label">السن:</span>
            <span className="detail-value">{employee.age}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">الخبرة:</span>
            <span className="detail-value">{employee.experience} سنوات</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">القسم:</span>
            <span className={`department-badge ${employee.department}`}>
              {employee.department}
            </span>
          </div>
        </div>

        {(employee.cvBase64 || employee.cvURL) && (
          <div className="cv-actions">
            <button
              onClick={viewPDF}
              className="cv-button view-btn"
            >
              👁️ عرض السيرة الذاتية
            </button>
            
            {employee.cvBase64 && (
              <button
                onClick={downloadPDF}
                className="cv-button download-btn"
              >
                ⬇️ تنزيل السيرة الذاتية
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;