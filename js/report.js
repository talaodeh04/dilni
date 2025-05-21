import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value.trim();

  try {
    await addDoc(collection(db, "reports"), {
      title,
      description,
      category,
      location,
      status: "pending",
      timestamp: serverTimestamp()
    });

    alert("Report submitted successfully!");
    document.getElementById("reportForm").reset();
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Error submitting report: " + error.message);
  }
});
