import {
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth } from "./firebase-config.js";

const nameEl = document.getElementById("userName");
const emailEl = document.getElementById("userEmail");
const roleEl = document.getElementById("userRole");
const statusEl = document.getElementById("userStatus");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (nameEl) nameEl.textContent = "Not logged in";
    return;
  }

  const uid = user.uid;
  if (emailEl) emailEl.textContent = `📧 ${user.email}`;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    if (nameEl) nameEl.textContent = `👤 ${data.name}`;
    if (roleEl) roleEl.textContent = `🏷️ Role: ${data.role}`;
    if (statusEl) statusEl.textContent = `📄 Status: ${data.status}`;
  } else {
    if (nameEl) nameEl.textContent = "👤 Profile not found";
  }
});
