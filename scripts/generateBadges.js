document.addEventListener("DOMContentLoaded", () => {
  const form     = document.querySelector("#create-badge");
  const steps    = document.querySelectorAll(".form-step");
  const titleEl  = document.getElementById("step-title");
  const descEl   = document.getElementById("step-description");
  const countEl  = document.getElementById("step-count");
  const progress = document.querySelector(".progress");
  const toast    = document.getElementById("toast");

  let currentStep = 0;

  const validators = {
    name:    v => v.length >= 2              || "First name must be at least 2 characters.",
    surname: v => v.length >= 2              || "Last name must be at least 2 characters.",
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    phone:   v => v === "" || /^[\d\s\+\-\(\)]{6,20}$/.test(v) || "Enter a valid phone number (or leave blank).",
    job:     v => v.length >= 2              || "Job title must be at least 2 characters.",
    company: v => v.length >= 2              || "Company must be at least 2 characters.",
    location:v => v === "" || v.length >= 2  || "Location must be at least 2 characters.",
  };

  const stepFields = [
    ["name", "surname"],
    ["email", "phone"],
    ["job", "company", "location"],
    [],
  ];

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
    void step.offsetWidth;
    step.classList.add("shake");
    step.addEventListener("animationend", () => step.classList.remove("shake"), { once: true });
  }

  document.querySelectorAll(".next").forEach(btn => btn.addEventListener("click", goNext));
  document.querySelectorAll(".prev").forEach(btn => btn.addEventListener("click", goPrev));

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

  function showToast(msg = "Badge created!", type = "success") {
    toast.textContent = msg;
    toast.className   = "toast show " + type;
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

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
    submitBtn.disabled    = true;
    submitBtn.textContent = "Creating…";

    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    const payload = {
      name:     document.getElementById("name").value.trim(),
      surname:  document.getElementById("surname").value.trim(),
      email:    document.getElementById("email").value.trim(),
      phone:    document.getElementById("phone").value.trim(),
      jobTitle: document.getElementById("job").value.trim(),
      company:  document.getElementById("company").value.trim(),
      location: document.getElementById("location").value.trim(),
      color:    colorInput.value,
      owner:    user?.username || null,
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
  console.log("ID:", data.id);

  showToast("Badge created successfully! 🎉", "success");

  setTimeout(() => {
    console.log("A redirecionar...");
    window.location.replace(`/pages/badge.html?id=${data.id}`);
  }, 1500);

} catch (err) {
  console.error(err);
  showToast("Something went wrong. Try again.", "error");
  submitBtn.disabled    = false;
  submitBtn.textContent = "Create badge";
}
  });

  updateUI();
});