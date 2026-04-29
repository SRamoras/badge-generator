document.addEventListener("DOMContentLoaded", () => {
  const form     = document.querySelector("#create-badge");
  const steps    = document.querySelectorAll(".form-step");
  const titleEl  = document.getElementById("step-title");
  const descEl   = document.getElementById("step-description");
  const countEl  = document.getElementById("step-count");
  const progress = document.querySelector(".progress");
  const toast    = document.getElementById("toast");

  let currentStep = 0;

  /* ── Validation rules per field ── */

  const validators = {
    name:    v => v.length >= 2              || "First name must be at least 2 characters.",
    surname: v => v.length >= 2              || "Last name must be at least 2 characters.",
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    phone:   v => v === "" || /^[\d\s\+\-\(\)]{6,20}$/.test(v) || "Enter a valid phone number (or leave blank).",
    job:     v => v.length >= 2              || "Job title must be at least 2 characters.",
    company: v => v.length >= 2              || "Company must be at least 2 characters.",
    location:v => v === "" || v.length >= 2  || "Location must be at least 2 characters.",
  };

  /* Which fields belong to each step (0-indexed) */
  const stepFields = [
    ["name", "surname"],
    ["email", "phone"],
    ["job", "company", "location"],
    [],            // step 4 — color, handled separately
  ];

  /* ── Helpers ── */

  function setError(input, msg) {
    input.classList.add("invalid");
    input.classList.remove("valid");

    let err = input.parentElement.querySelector(".field-error");
    if (!err) {
      err = document.createElement("span");
      err.className = "field-error";
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function setValid(input) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    const err = input.parentElement.querySelector(".field-error");
    if (err) err.remove();
  }

  function clearState(input) {
    input.classList.remove("invalid", "valid");
    const err = input.parentElement.querySelector(".field-error");
    if (err) err.remove();
  }

  function validateField(id) {
    const input = document.getElementById(id);
    if (!input) return true;
    const rule   = validators[id];
    const result = rule(input.value.trim());
    if (result === true) {
      setValid(input);
      return true;
    } else {
      setError(input, result);
      return false;
    }
  }

  function validateStep(stepIndex) {
    const fields = stepFields[stepIndex];
    return fields.map(validateField).every(Boolean);
  }

  /* Live validation — show errors only after first blur */
  Object.keys(validators).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", () => {
      if (input.value.trim() !== "") validateField(id);
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(id);
    });
  });

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
    if (!validateStep(currentStep)) {
      shakeCurrentStep();
      return;
    }
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

  function shakeCurrentStep() {
    const step = steps[currentStep];
    step.classList.remove("shake");
    void step.offsetWidth; // reflow to restart animation
    step.classList.add("shake");
    step.addEventListener("animationend", () => step.classList.remove("shake"), { once: true });
  }

  document.querySelectorAll(".next").forEach(btn => btn.addEventListener("click", goNext));
  document.querySelectorAll(".prev").forEach(btn => btn.addEventListener("click", goPrev));

  /* ── Color picker ── */

  const colorSwatches = document.querySelectorAll(".color");
  const colorInput    = document.getElementById("color");
  const colorError    = document.getElementById("color-error");

  colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      colorSwatches.forEach(el => el.classList.remove("selected"));
      swatch.classList.add("selected");
      colorInput.value = swatch.dataset.color;
      if (colorError) colorError.style.display = "none";
    });
  });

  /* ── Toast ── */

  function showToast(msg = "Badge created!", type = "success") {
    toast.textContent = msg;
    toast.className   = "toast show " + type;
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  /* ── Submit ── */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!colorInput.value) {
      if (colorError) {
        colorError.style.display = "block";
      } else {
        showToast("Pick a colour first.", "error");
      }
      shakeCurrentStep();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled   = true;
    submitBtn.textContent = "Creating…";

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
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Created:", data);

      /* reset */
      form.reset();
      colorInput.value = "";
      colorSwatches.forEach(s => s.classList.remove("selected"));
      document.querySelectorAll(".input").forEach(clearState);
      currentStep = 0;
      updateUI();

      showToast("Badge created successfully! 🎉", "success");

    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Try again.", "error");
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Create badge";
    }
  });

  updateUI();
});