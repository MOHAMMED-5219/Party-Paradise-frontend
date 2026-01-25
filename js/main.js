// ================= CONFIG =================
const API_URL = "https://party-paradise-backend-mr44.onrender.com/api";

// ================= CONTACT FORM =================
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const messageDiv = document.getElementById("formMessage");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    messageDiv.style.display = "block";
    messageDiv.style.color = "#555";
    messageDiv.textContent = "Sending message...";

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        messageDiv.style.color = "green";
        messageDiv.textContent =
          "✅ Thank you! We have received your message and will contact you soon.";

        contactForm.reset();
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent =
          "❌ Something went wrong. Please try again.";
      }
    } catch (err) {
      console.error("FRONTEND ERROR:", err);
      messageDiv.style.color = "red";
      messageDiv.textContent =
        "❌ Server error. Please try again later.";
    }
  });
});
