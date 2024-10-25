// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9flLsGFvXtrYRVfMB9Cme_cwPnL3VGRE",
  authDomain: "contact-dec3d.firebaseapp.com",
  projectId: "contact-dec3d",
  storageBucket: "contact-dec3d.appspot.com",
  messagingSenderId: "481721807169",
  appId: "1:481721807169:web:8f83fa535761204c85b1c0",
  measurementId: "G-4J82064CGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

const storage = getStorage(app);

export const auth  = getAuth(app);

export { db, storage };