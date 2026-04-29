const API = "https://69de8fdad6de26e1192810df.mockapi.io/badges";

function getUser() {
  try {
    const raw = localStorage.getItem("loggedInUser");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function init() {
  const user = getUser();

  if (!user) {
    window.location.href = "/pages/login.html";
    return;
  }

  // Fill hero
  const avatar = document.getElementById("profile-avatar");
  const name   = document.getElementById("profile-name");
  const meta   = document.getElementById("profile-meta");

  avatar.textContent = user.username.charAt(0).toUpperCase();
  name.textContent   = user.username;
  meta.textContent   = `Member · ID ${user.id}`;

  // Load badges
  const grid = document.getElementById("badge-grid");

  try {
    const res    = await fetch(`${API}?owner=${user.id}`);
    const badges = await res.json();

    grid.innerHTML = "";

    if (!badges.length) {
      grid.innerHTML = `
        <div class="state-empty">
          <p>You haven't created any badges yet.</p>
          <a href="/pages/generate-badges.html">Create your first badge →</a>
        </div>`;
      return;
    }

    badges.forEach(badge => {
      const el = document.createElement("badge-item");
      el.data  = badge;
      grid.appendChild(el);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="state-msg">Could not load badges.</p>';
  }
}

init();