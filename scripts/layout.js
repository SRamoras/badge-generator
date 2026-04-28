import "./webComponents/header.js";
import "./webComponents/footer.js";

// No teu layout.js (ou num script separado, após importar o componente)
import "./webComponents/badge.js";

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
    id: "preview-3",
    name: "João",
    surname: "Ferreira",
    jobTitle: "Frontend Dev",
    company: "Ferreira Dev",
    email: "joao@ferreira.dev",
    phone: "+351 965 123 456",
    location: "Braga, PT",
    color: "#111111",
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

const strip = document.getElementById("badge-strip");

PREVIEW_BADGES.forEach((badge) => {
  const el = document.createElement("badge-item");
  el.data = badge;
  strip.appendChild(el);
});