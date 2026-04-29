const API = "https://69de8fdad6de26e1192810df.mockapi.io/badges";

/* ── Helpers ── */

function getIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function showToast(msg = "Link copied to clipboard") {
  const toast = document.getElementById("copyToast");
  const label = toast.querySelector ? toast : toast;
  // update text node (keep the svg icon)
  const textNode = [...toast.childNodes].find(n => n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== "svg"));
  if (textNode) textNode.textContent = " " + msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ── Load badge ── */

async function loadBadge() {
  const container = document.getElementById("badge-container");
  const actions   = document.getElementById("actions");
  const id        = getIdFromURL();

  if (!id) {
    container.innerHTML = '<p class="state-msg state-error">No badge ID found in URL.</p>';
    return;
  }

  try {
    const res = await fetch(`${API}/${id}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const badge = await res.json();

    // Render the badge component
    container.innerHTML = "";
    const el = document.createElement("badge-item");
    el.data = badge;
    container.appendChild(el);

    // Show action buttons
    actions.style.display = "flex";
    setupButtons(badge);

    // Update page title
    const name = [badge.name, badge.surname].filter(Boolean).join(" ");
    if (name) document.title = `${name} — Badge.Gen`;

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="state-msg state-error">Could not load badge. Please try again.</p>';
  }
}

/* ── Buttons ── */

function setupButtons(badge) {
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn    = document.getElementById("shareBtn");

  const shareLink = `${window.location.origin}/pages/badge.html?id=${badge.id}`;

  // Download — fetches a generated image if available, else falls back gracefully
  downloadBtn.addEventListener("click", async () => {
    const imgUrl = `/badges/${badge.id}.png`;

    try {
      const res = await fetch(imgUrl, { method: "HEAD" });

      if (res.ok) {
        const a = document.createElement("a");
        a.href     = imgUrl;
        a.download = `${badge.name || "badge"}_${badge.surname || ""}.png`.replace(/\s+/g, "_");
        a.click();
      } else {
        showToast("Download not available yet");
      }
    } catch {
      showToast("Download not available yet");
    }
  });

  shareBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast("Link copied to clipboard");
    } catch {
      // Fallback: prompt
      window.prompt("Copy this link:", shareLink);
    }
  });
}

loadBadge();