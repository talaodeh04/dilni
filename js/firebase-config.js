// js/firebase-config.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrqpmE_oC9jV0pAyuoAW7THxhgpPregE0",
  authDomain: "dilni-9504f.firebaseapp.com",
  projectId: "dilni-9504f",
  storageBucket: "dilni-9504f.appspot.com",
  messagingSenderId: "217132083935",
  appId: "1:217132083935:web:86ad4ddfb3d09d546cd76a",
  measurementId: "G-2V5N070VB2"
};

// ❗ نمنع التكرار
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
