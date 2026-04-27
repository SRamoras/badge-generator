const API = "https://69de8fdad6de26e1192810df.mockapi.io/badges";

let currentBadge = null;

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadBadge() {
  const container = document.getElementById("badge-container");

  const id = getIdFromURL();

  if (!id) {
    container.innerHTML = "<p>Badge não encontrado</p>";
    return;
  }

  try {
    const res = await fetch(`${API}/${id}`);
    const badge = await res.json();

    currentBadge = badge;

    const el = document.createElement("badge-item");
    el.data = badge;

    container.appendChild(el);

    setupButtons(badge);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar badge</p>";
  }
}

function setupButtons(badge) {
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");

  const name = `${badge.name || ""}_${badge.surname || ""}`;
  const shareLink = `${window.location.origin}/badge.html?id=${badge.id}`;

  // 📥 Download
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = `/badges/${badge.id}.png`;
    a.download = `${name}.png`;
    a.click();
  };

  // 🔗 Partilhar
  shareBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("Link copiado!");
    } catch {
      alert("Erro ao copiar link");
    }
  };
}

loadBadge();