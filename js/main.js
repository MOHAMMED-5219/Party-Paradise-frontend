// ================= CONTACT FORM =================
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    const messageDiv = document.getElementById("formMessage");

    console.log("FORM SUBMITTED"); // ✅ debug

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, phone, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        messageDiv.style.display = "block";
        messageDiv.style.color = "green";
        messageDiv.textContent =
          "Thank you! We will contact you soon.";

        contactForm.reset();
      } else {
        messageDiv.style.display = "block";
        messageDiv.style.color = "red";
        messageDiv.textContent =
          "Something went wrong. Please try again.";
      }
    } catch (error) {
      console.error(error);
      messageDiv.style.display = "block";
      messageDiv.style.color = "red";
      messageDiv.textContent =
        "Server error. Please try again later.";
    }
  });
}
