import {
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    doc
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { db } from './firebase-config.js';
  
  const container = document.getElementById("locationsContainer");
  const form = document.getElementById("addLocationForm");
  const map = L.map("map").setView([32.2, 35.3], 8);
  const statusFilter = document.getElementById("statusFilter");
  const cityFilter = document.getElementById("cityFilter");
  const countDisplay = document.getElementById("locationCount");
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  
  document.querySelector(".add-user").addEventListener("click", () => {
    form.style.display = form.style.display === "none" ? "block" : "none";
  });
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("locName").value.trim();
    const city = document.getElementById("locCity").value.trim();
    const category = document.getElementById("locCategory").value.trim();
    const lat = parseFloat(document.getElementById("locLat").value);
    const lng = parseFloat(document.getElementById("locLng").value);
  
    try {
      await addDoc(collection(db, "locations"), {
        name, city, category, lat, lng, status: "Pending"
      });
      alert("✅ Location added.");
      form.reset();
      form.style.display = "none";
      loadLocations();
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
  
  async function loadLocations() {
    container.innerHTML = "";
    map.eachLayer(layer => { if (layer._latlng) map.removeLayer(layer); });
  
    const querySnapshot = await getDocs(collection(db, "locations"));
    let citiesSet = new Set();
    let totalCount = 0;
  
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
  
      const statusVal = statusFilter.value;
      const cityVal = cityFilter.value;
      if ((statusVal !== "all" && data.status !== statusVal) || 
          (cityVal !== "all" && data.city !== cityVal)) return;
  
      totalCount++;
      citiesSet.add(data.city);
  
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>City:</strong> ${data.city}<br>
           <strong>Category:</strong> ${data.category}<br>
           <strong>Status:</strong> ${data.status}</p>
        <div class="action-buttons">
          ${data.status !== "Approved"
            ? `<button class="btn approve">Approve</button>`
            : ""}
          <button class="btn approve edit-btn">Edit</button>
          <button class="btn reject">Delete</button>
        </div>
        <form class="edit-form" style="display:none; margin-top:10px;">
          <input type="text" name="name" value="${data.name}" required />
          <input type="text" name="city" value="${data.city}" required />
          <input type="text" name="category" value="${data.category}" required />
          <input type="number" name="lat" value="${data.lat}" step="any" required />
          <input type="number" name="lng" value="${data.lng}" step="any" required />
          <button class="btn approve" type="submit">Save</button>
        </form>
      `;
      container.appendChild(card);
  
      // Marker 
      L.marker([data.lat, data.lng]).addTo(map).bindPopup(data.name);
  
      card.querySelector(".btn.approve:not(.edit-btn)")?.addEventListener("click", async () => {
        await updateDoc(doc(db, "locations", id), { status: "Approved" });
        loadLocations();
      });
  
      // Delete
      card.querySelector(".btn.reject").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this location?")) {
          await deleteDoc(doc(db, "locations", id));
          loadLocations();
        }
      });
  
      // Edit
      const editBtn = card.querySelector(".edit-btn");
      const editForm = card.querySelector(".edit-form");
  
      editBtn.addEventListener("click", () => {
        editForm.style.display = editForm.style.display === "none" ? "block" : "none";
      });
  
      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updated = {
          name: editForm.name.value,
          city: editForm.city.value,
          category: editForm.category.value,
          lat: parseFloat(editForm.lat.value),
          lng: parseFloat(editForm.lng.value)
        };
        await updateDoc(doc(db, "locations", id), updated);
        loadLocations();
      });
    });
  
    countDisplay.textContent = `Total: ${totalCount} locations`;
  
    cityFilter.innerHTML = '<option value="all">All Cities</option>';
    citiesSet.forEach(city => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      cityFilter.appendChild(opt);
    });
  }
  
  statusFilter.addEventListener("change", loadLocations);
  cityFilter.addEventListener("change", loadLocations);
  
  loadLocations();
  