import {
    doc,
    getDoc,
    setDoc,
    updateDoc
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  
  import { db } from "./firebase-config.js";
  
  const settingsRef = doc(db, "settings", "system");
  
  async function loadSettings() {
    const snapshot = await getDoc(settingsRef);
  
    if (!snapshot.exists()) {
      await setDoc(settingsRef, {
        notifications: false,
        language: "en",
        roles: {
          admin: true,
          verified: false,
          public: false
        },
        maintenance: false
      });
      return loadSettings();
    }
  
    const data = snapshot.data();
  
    document.getElementById("enableNotifications").disabled = data.notifications;
    document.getElementById("disableNotifications").disabled = !data.notifications;
  
    document.getElementById("languageSelect").value = data.language || "en";
  
    document.getElementById("adminOnly").checked = data.roles?.admin ?? true;
    document.getElementById("verifiedUsers").checked = data.roles?.verified ?? false;
    document.getElementById("publicUsers").checked = data.roles?.public ?? false;
  }
  
  document.getElementById("enableNotifications").addEventListener("click", async () => {
    await updateDoc(settingsRef, { notifications: true });
    document.getElementById("enableNotifications").disabled = true;
    document.getElementById("disableNotifications").disabled = false;
    alert("✅ Notifications have been enabled.");
  });
  
  document.getElementById("disableNotifications").addEventListener("click", async () => {
    await updateDoc(settingsRef, { notifications: false });
    document.getElementById("enableNotifications").disabled = false;
    document.getElementById("disableNotifications").disabled = true;
    alert("🔕 Notifications have been disabled.");
  });
  
  document.getElementById("languageSelect").addEventListener("change", async (e) => {
    const lang = e.target.value;
    await updateDoc(settingsRef, { language: lang });
    alert(`🌐 Language set to ${lang === "ar" ? "Arabic" : "English"}`);
  });
  
  async function updateRoles() {
    const roles = {
      admin: document.getElementById("adminOnly").checked,
      verified: document.getElementById("verifiedUsers").checked,
      public: document.getElementById("publicUsers").checked,
    };
    await updateDoc(settingsRef, { roles });
    alert("🔐 Access control updated successfully.");
  }
  
  document.getElementById("adminOnly").addEventListener("change", updateRoles);
  document.getElementById("verifiedUsers").addEventListener("change", updateRoles);
  document.getElementById("publicUsers").addEventListener("change", updateRoles);
  
  document.getElementById("activateMaintenance").addEventListener("click", async () => {
    const confirmAction = confirm("⚠️ Are you sure you want to activate maintenance mode?");
    if (confirmAction) {
      await updateDoc(settingsRef, { maintenance: true });
      alert("🛠️ System is now in maintenance mode.");
    }
  });
  
  loadSettings();
  