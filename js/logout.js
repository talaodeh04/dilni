import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.logout = function () {
  signOut(auth).then(() => {
    alert("You have been logged out.");
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Logout failed: " + error.message);
  });
}
