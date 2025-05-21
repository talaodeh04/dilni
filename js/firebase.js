// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrqpmE_oC9jV0pAyuoAW7THxhgpPregE0",
  authDomain: "dilni-9504f.firebaseapp.com",
  projectId: "dilni-9504f",
  storageBucket: "dilni-9504f.firebasestorage.app",
  messagingSenderId: "217132083935",
  appId: "1:217132083935:web:86ad4ddfb3d09d546cd76a",
  measurementId: "G-2V5N070VB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);