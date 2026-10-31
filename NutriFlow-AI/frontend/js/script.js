const API_BASE = ""; // Same-origin API when served by the Express backend.

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "☰";
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

// BMI is an educational screening estimate, not a medical diagnosis.
document.querySelector("#bmiForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const weight = Number(document.querySelector("#weight").value);
  const heightCm = Number(document.querySelector("#height").value);
  const result = document.querySelector("#bmiResult");

  if (!Number.isFinite(weight) || !Number.isFinite(heightCm) ||
      weight <= 0 || heightCm <= 0) {
    result.textContent = "Please enter a valid weight and height.";
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category = "outside the standard adult range";
  if (bmi < 18.5) category = "below the standard adult range";
  else if (bmi < 25) category = "within the standard adult range";
  else if (bmi < 30) category = "above the standard adult range";
  else category = "in the higher adult BMI range";

  result.innerHTML = `<strong>Your BMI: ${bmi.toFixed(1)}</strong><br>${category}. BMI interpretation varies by age, pregnancy, muscle mass, and other factors.`;
});

const consultForm = document.querySelector("#consultForm");
const formStatus = document.querySelector("#formStatus");

consultForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.classList.remove("error");
  formStatus.textContent = "Sending your request…";

  const formData = new FormData(consultForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${API_BASE}/api/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Unable to send your request.");
    formStatus.textContent = "Thank you! Your consultation request has been received.";
    consultForm.reset();
  } catch (error) {
    formStatus.classList.add("error");
    formStatus.textContent = error.message.includes("Failed to fetch")
      ? "Could not connect to the server. Please start the backend and try again."
      : error.message;
  }
});
