document.addEventListener("DOMContentLoaded", () => {
  const form     = document.querySelector("#create-badge");
  const steps    = document.querySelectorAll(".form-step");
  const titleEl  = document.getElementById("step-title");
  const descEl   = document.getElementById("step-description");
  const countEl  = document.getElementById("step-count");
  const progress = document.querySelector(".progress");
  const toast    = document.getElementById("toast");

  let currentStep = 0;

  /* ── UI state ── */

  function updateUI() {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === currentStep);
    });

    const step = steps[currentStep];
    titleEl.textContent = step.dataset.title;
    descEl.textContent  = step.dataset.desc;
    countEl.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  }

  function goNext() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateUI();
    }
  }

  function goPrev() {
    if (currentStep > 0) {
      currentStep--;
      updateUI();
    }
  }

  document.querySelectorAll(".next").forEach(btn => btn.addEventListener("click", goNext));
  document.querySelectorAll(".prev").forEach(btn => btn.addEventListener("click", goPrev));

  /* ── Color picker ── */

  const colorSwatches = document.querySelectorAll(".color");
  const colorInput    = document.getElementById("color");

  colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      colorSwatches.forEach(el => el.classList.remove("selected"));
      swatch.classList.add("selected");
      colorInput.value = swatch.dataset.color;
    });
  });

  /* ── Toast helper ── */

  function showToast(msg = "Badge created!") {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  /* ── Submit ── */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!colorInput.value) {
      showToast("Pick a colour first.");
      return;
    }

    const payload = {
      name:     document.getElementById("name").value.trim(),
      surname:  document.getElementById("surname").value.trim(),
      email:    document.getElementById("email").value.trim(),
      phone:    document.getElementById("phone").value.trim(),
      jobTitle: document.getElementById("job").value.trim(),
      company:  document.getElementById("company").value.trim(),
      location: document.getElementById("location").value.trim(),
      color:    colorInput.value,
    };

    try {
      const res = await fetch(
        "https://69de8fdad6de26e1192810df.mockapi.io/badges",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Created:", data);

      /* reset */
      form.reset();
      colorInput.value = "";
      colorSwatches.forEach(s => s.classList.remove("selected"));
      currentStep = 0;
      updateUI();

      showToast("Badge created successfully!");

    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Try again.");
    }
  });

  updateUI();
});