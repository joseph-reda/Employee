// src/constants/departments.js
export const DEPARTMENTS = [
  { id: 1, en: "Civil", ar: "مدني" },
  { id: 2, en: "Architectural", ar: "معماري" },
  { id: 3, en: "Survey", ar: "مساحة" },
  { id: 4, en: "Electrical", ar: "كهرباء" },
  { id: 5, en: "Mechanical", ar: "ميكانيكة" },
  { id: 6, en: "DC", ar: "DC" },
  { id: 7, en: "HR", ar: "HR" },
  { id: 8, en: "Accountants", ar: "محاسبين" },
  { id: 9, en: "Safety", ar: "سيفتي" },
  { id: 10, en: "Technical Office", ar: "مكتب فني" },
  { id: 11, en: "QS", ar: "QS" },
  { id: 12, en: "Planning", ar: "Planning" },
  { id: 13, en: "QC", ar: "مراقبة جودة" },
  { id: 14, en: "Executive Engineer", ar: "مهندس تنفيذي" }
];

export const ALL_DEPARTMENTS = { id: 0, en: "All Departments", ar: "جميع الأقسام" };

// دالة للحصول على التسمية العربية
export const getArabicDepartment = (englishName) => {
  const dept = DEPARTMENTS.find(d => d.en === englishName);
  return dept ? dept.ar : englishName;
};

// دالة للحصول على التسمية الإنجليزية
export const getEnglishDepartment = (arabicName) => {
  const dept = DEPARTMENTS.find(d => d.ar === arabicName);
  return dept ? dept.en : arabicName;
};