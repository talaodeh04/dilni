import {
    getDocs,
    updateDoc,
    setDoc,
    doc,
    collection
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  
  import {
    createUserWithEmailAndPassword
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  
  import { db, auth } from './firebase-config.js';
  
  const container = document.querySelector(".cards");
  const roleSelect = document.getElementById("roleFilter");
  const statusSelect = document.getElementById("statusFilter");
  
  async function loadUsers(roleFilter = "all", statusFilter = "all") {
    container.innerHTML = "";
  
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
  
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const userId = docSnap.id;
  
        if (
          (roleFilter === "all" || data.role === roleFilter) &&
          (statusFilter === "all" || data.status === statusFilter)
        ) {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <h3>${data.name}</h3>
            <p>
              <strong>Email:</strong> ${data.email}<br>
              <strong>Role:</strong> ${data.role}<br>
              <strong>Status:</strong> ${data.status}
            </p>
            <div class="action-buttons">
              ${data.status === "Active"
                ? `<button class="btn reject">Deactivate</button>`
                : `<button class="btn approve">Activate</button>`}
              <button class="btn approve edit-btn">Edit</button>
            </div>
            <form class="edit-form" style="display: none; margin-top: 10px;">
              <input type="text" name="name" value="${data.name}" placeholder="Name" required />
              <select name="role">
                <option ${data.role === "Admin" ? "selected" : ""}>Admin</option>
                <option ${data.role === "Tourist Guide" ? "selected" : ""}>Tourist Guide</option>
                <option ${data.role === "General User" ? "selected" : ""}>General User</option>
              </select>
              <select name="status">
                <option ${data.status === "Active" ? "selected" : ""}>Active</option>
                <option ${data.status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
              <button type="submit" class="btn approve">Save</button>
            </form>
          `;
  
          container.appendChild(card);
  
          const activateBtn = card.querySelector(".btn.approve:not(.edit-btn)");
          const deactivateBtn = card.querySelector(".btn.reject");
          const editBtn = card.querySelector(".edit-btn");
          const editForm = card.querySelector(".edit-form");
  
          if (activateBtn) {
            activateBtn.addEventListener("click", async () => {
              await updateDoc(doc(db, "users", userId), { status: "Active" });
              loadUsers(roleSelect.value, statusSelect.value);
            });
          }
  
          if (deactivateBtn) {
            deactivateBtn.addEventListener("click", async () => {
              await updateDoc(doc(db, "users", userId), { status: "Inactive" });
              loadUsers(roleSelect.value, statusSelect.value);
            });
          }
  
          editBtn.addEventListener("click", () => {
            editForm.style.display = editForm.style.display === "none" ? "block" : "none";
          });
  
          editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newName = editForm.name.value.trim();
            const newRole = editForm.role.value;
            const newStatus = editForm.status.value;
  
            await updateDoc(doc(db, "users", userId), {
              name: newName,
              role: newRole,
              status: newStatus
            });
  
            loadUsers(roleSelect.value, statusSelect.value);
          });
        }
      });
  
    } catch (error) {
      console.error("❌ Failed to load users:", error);
      container.innerHTML = "<p>⚠️ Failed to load users. Please try again later.</p>";
    }
  }
  
  document.querySelector(".add-user").addEventListener("click", () => {
    const form = document.getElementById("addUserForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
  });
  
  document.getElementById("addUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("newName").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newRole").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        status: "Active"
      });
  
      alert("✅ User created successfully.");
      document.getElementById("addUserForm").reset();
      document.getElementById("addUserForm").style.display = "none";
      loadUsers(roleSelect.value, statusSelect.value);
  
    } catch (error) {
      console.error("❌ Failed to create user:", error);
      alert("Error: " + error.message);
    }
  });
  
  loadUsers(roleSelect.value, statusSelect.value);
  
  roleSelect.addEventListener("change", () => {
    loadUsers(roleSelect.value, statusSelect.value);
  });
  
  statusSelect.addEventListener("change", () => {
    loadUsers(roleSelect.value, statusSelect.value);
  });
  