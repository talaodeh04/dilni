import { db, auth } from './firebase-config.js';
import {
  collection, getDocs, updateDoc, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const statsContainer = document.getElementById("statsContainer");
const filterSelect = document.getElementById("filterSelect");
const container = document.getElementById("reportsContainer");

async function loadReports() {
  const reportsSnap = await getDocs(collection(db, "reports"));
  const usersSnap = await getDocs(collection(db, "users"));

  let counts = { approved: 0, rejected: 0, pending: 0 };

  reportsSnap.forEach(docSnap => {
    const status = (docSnap.data().status || "pending").toLowerCase();
    counts[status]++;
  });

  statsContainer.innerHTML = "";

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const d = userSnap.data();
        const profileCard = document.createElement("div");
        profileCard.className = "stat-card profile";
        profileCard.innerHTML = `
          <h3>Admin Profile</h3>
          <p>Name: ${d.name}</p>
          <p>Email: ${user.email}</p>
          <p>Role: ${d.role}</p>
          <p>Status: ${d.status}</p>
          <a href="profile.html">View Profile</a>
        `;
        statsContainer.appendChild(profileCard);
      }
    }
  });

  const approved = createStatCard("✅ Approved Reports", counts.approved);
  const pending = createStatCard("🕒 Pending Reports", counts.pending);
  const rejected = createStatCard("❌ Rejected Reports", counts.rejected);
  const users = createStatCard("👥 Total Users", usersSnap.size);

  statsContainer.appendChild(approved);
  statsContainer.appendChild(pending);
  statsContainer.appendChild(rejected);
  statsContainer.appendChild(users);

  const selected = filterSelect.value;
  container.innerHTML = "";

  reportsSnap.forEach(docSnap => {
    const data = docSnap.data();
    const status = (data.status || "pending").toLowerCase();

    if (selected === "all" || status === selected) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${data.title}</h3>
        <p><strong>Category:</strong> ${data.category}<br>
           <strong>Status:</strong> ${status}<br>
           <strong>Submitted:</strong> ${new Date(data.timestamp?.seconds * 1000).toLocaleString()}</p>
        <div class="action-buttons">
          <button class="btn approve">Approve</button>
          <button class="btn reject">Reject</button>
        </div>
      `;

      const approveBtn = card.querySelector(".approve");
      const rejectBtn = card.querySelector(".reject");

      approveBtn.addEventListener("click", async () => {
        await updateDoc(doc(db, "reports", docSnap.id), { status: "approved" });
        loadReports();
      });

      rejectBtn.addEventListener("click", async () => {
        await updateDoc(doc(db, "reports", docSnap.id), { status: "rejected" });
        loadReports();
      });

      container.appendChild(card);
    }
  });
}

function createStatCard(title, value) {
  const card = document.createElement("div");
  card.className = "stat-card";
  card.innerHTML = `<h3>${title}</h3><p>${value}</p>`;
  return card;
}

filterSelect.addEventListener("change", loadReports);
loadReports();
