document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
  
    cards.forEach(card => {
      const approveBtn = card.querySelector(".btn.approve");
      const rejectBtn = card.querySelector(".btn.reject");
      const editBtn = card.querySelector(".btn.edit");
      const deleteBtn = card.querySelector(".btn.delete");
  
      // Approve
      approveBtn?.addEventListener("click", () => {
        card.style.borderLeft = "6px solid #2ecc71";
        updateStatus(card, "Approved ✅");
        alert("Report approved ✅");
      });
  
      // Reject
      rejectBtn?.addEventListener("click", () => {
        card.style.borderLeft = "6px solid #e74c3c";
        updateStatus(card, "Rejected ❌");
        alert("Report rejected ❌");
      });
  
      // Edit
      editBtn?.addEventListener("click", () => {
        alert("Edit functionality coming soon ✏️");
      });
  
      // Delete
      deleteBtn?.addEventListener("click", () => {
        card.remove();
        alert("Card deleted 🗑️");
      });
  
      function updateStatus(card, newStatus) {
        const p = card.querySelector("p");
        if (p) {
          p.innerHTML = p.innerHTML.replace(
            /<strong>Status:<\/strong>.*?<br>/,
            `<strong>Status:</strong> ${newStatus}<br>`
          );
        }
      }
    });
  });
  