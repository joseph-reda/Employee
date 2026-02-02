import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCneoEIgGaWbzXdjLkFcU9AuTRyXv0cB_k",
  authDomain: "employee-22147.firebaseapp.com",
  projectId: "employee-22147",
  storageBucket: "employee-22147.firebasestorage.app",
  messagingSenderId: "319277238168",
  appId: "1:319277238168:web:581704178e85e062304ded",
  measurementId: "G-RRL1YJT5JT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };