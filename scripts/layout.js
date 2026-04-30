
import "./webComponents/header.js";
import "./webComponents/footer.js";
import "./webComponents/badge.js";

// ── Toast & Confirm helpers ──
window.showToast = (message, type = "success") => {
  Swal.fire({
    toast: true,
    position: "top-right",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: "swal-toast-custom" }
  });
};

window.showConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#111",
    cancelButtonColor: "#eee",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    customClass: { cancelButton: "swal-cancel-custom" }
  });
};

// ── Preview badges (homepage only) ──
const strip = document.getElementById("badge-strip");

if (strip) {
  const PREVIEW_BADGES = [
    {
      id: "preview-1",
      name: "Diogo",
      surname: "Silva",
      jobTitle: "Software Engineer",
      company: "Freelance",
      email: "diogosilva@gmail.com",
      phone: "+351 932 231 533",
      location: "Lisboa, PT",
      color: "#111111",
    },
    {
      id: "preview-2",
      name: "Maria",
      surname: "Rodrigues",
      jobTitle: "Product Designer",
      company: "Studio IO",
      email: "maria@studio.io",
      phone: "+351 911 000 222",
      location: "Porto, PT",
      color: "#6366f1",
    },
    {
      id: "preview-4",
      name: "Ana",
      surname: "Costa",
      jobTitle: "Marketing Lead",
      company: "Brand PT",
      email: "ana@brand.pt",
      phone: "+351 924 888 001",
      location: "Faro, PT",
      color: "#f59e0b",
    },
  ];

  PREVIEW_BADGES.forEach((badge) => {
    const el = document.createElement("badge-item");
    el.data = badge;
    strip.appendChild(el);
  });
}

// ── Protected pages ──
const _base = window.location.pathname.includes('/pages/') ? '..' : '.';
if (window.location.pathname.includes('generate-badges.html')) {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (!user) window.location.href = `${_base}/pages/login.html`;
}