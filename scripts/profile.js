const API = "https://69de8fdad6de26e1192810df.mockapi.io/badges";
const USERS_API = "https://69de8fdad6de26e1192810df.mockapi.io/users";
const ITEMS_PER_PAGE = 6;

let allBadges  = [];
let currentPage = 1;
let currentUser = null;

function getUser() {
  try {
    const raw = localStorage.getItem("loggedInUser");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function init() {
  const user = getUser();
  if (!user) { window.location.href = "/pages/login.html"; return; }
  currentUser = user;

  // Fetch full user data to get location
  try {
    const res   = await fetch(`${USERS_API}?username=${user.username}`);
    const users = await res.json();
    const full  = users.find(u => u.username === user.username);

    document.getElementById("profile-avatar").textContent = user.username.charAt(0).toUpperCase();
    document.getElementById("profile-name").textContent   = user.username;
    document.getElementById("profile-meta").textContent   = full?.timezone
      ? `@${user.username} · ${full.timezone}`
      : `@${user.username}`;
  } catch {
    document.getElementById("profile-avatar").textContent = user.username.charAt(0).toUpperCase();
    document.getElementById("profile-name").textContent   = user.username;
    document.getElementById("profile-meta").textContent   = `@${user.username}`;
  }

  loadBadges(user);
}

async function loadBadges(user) {
  const grid = document.getElementById("badge-grid");

  try {
    const res = await fetch(`${API}?owner=${user.username}`);
    allBadges = await res.json();
    grid.innerHTML = "";

    if (!allBadges.length) {
      grid.innerHTML = `
        <div class="state-empty">
          <p>You haven't created any badges yet.</p>
          <a href="/pages/generate-badges.html">Create your first badge →</a>
        </div>`;
      return;
    }

    renderPage();
  } catch {
    grid.innerHTML = '<p class="state-msg">Could not load badges.</p>';
  }
}

function renderPage() {
  const grid = document.getElementById("badge-grid");
  grid.innerHTML = "";

  const start     = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = allBadges.slice(start, start + ITEMS_PER_PAGE);

  paginated.forEach(badge => renderBadgeCard(badge, grid));
  renderPagination();
}

function renderPagination() {
  let pag = document.getElementById("profile-pagination");
  if (!pag) {
    pag = document.createElement("div");
    pag.id = "profile-pagination";
    pag.className = "pagination";
    document.querySelector(".profile-section").appendChild(pag);
  }

  pag.innerHTML = "";

  const total = Math.ceil(allBadges.length / ITEMS_PER_PAGE);
  if (total <= 1) return;

  const prev = document.createElement("button");
  prev.className   = "page-btn";
  prev.textContent = "← Prev";
  prev.disabled    = currentPage === 1;
  prev.onclick     = () => { currentPage--; renderPage(); };
  pag.appendChild(prev);

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.className   = "page-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.onclick     = () => { currentPage = i; renderPage(); };
    pag.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className   = "page-btn";
  next.textContent = "Next →";
  next.disabled    = currentPage === total;
  next.onclick     = () => { currentPage++; renderPage(); };
  pag.appendChild(next);
}

function renderBadgeCard(badge, grid) {
  const wrapper = document.createElement("div");
  wrapper.className  = "badge-wrapper";
  wrapper.dataset.id = badge.id;

  const el = document.createElement("badge-item");
  el.data  = badge;

  const actions = document.createElement("div");
  actions.className = "badge-actions";
  actions.innerHTML = `
    <button class="btn-action btn-edit">
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4">
        <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z"/>
      </svg>
      Edit
    </button>
    <button class="btn-action btn-delete">
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4">
        <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4"/>
      </svg>
      Delete
    </button>
  `;

  const editForm = document.createElement("div");
  editForm.className = "edit-form hidden";
  editForm.innerHTML = `
    <div class="edit-grid">
      <div class="edit-field">
        <label>First name</label>
        <input type="text" name="name" value="${badge.name || ""}">
      </div>
      <div class="edit-field">
        <label>Last name</label>
        <input type="text" name="surname" value="${badge.surname || ""}">
      </div>
      <div class="edit-field">
        <label>Job title</label>
        <input type="text" name="jobTitle" value="${badge.jobTitle || ""}">
      </div>
      <div class="edit-field">
        <label>Company</label>
        <input type="text" name="company" value="${badge.company || ""}">
      </div>
      <div class="edit-field">
        <label>Email</label>
        <input type="email" name="email" value="${badge.email || ""}">
      </div>
      <div class="edit-field">
        <label>Phone</label>
        <input type="text" name="phone" value="${badge.phone || ""}">
      </div>
      <div class="edit-field">
        <label>Location</label>
        <input type="text" name="location" value="${badge.location || ""}">
      </div>
      <div class="edit-field">
        <label>Color</label>
        <input type="color" name="color" value="${badge.color || "#111111"}">
      </div>
    </div>
    <div class="edit-form-actions">
      <button class="btn-action btn-cancel">Cancel</button>
      <button class="btn-action btn-save">Save</button>
    </div>
  `;

  // Edit toggle
  actions.querySelector(".btn-edit").addEventListener("click", () => {
    const isOpen = !editForm.classList.contains("hidden");
    editForm.classList.toggle("hidden", isOpen);
    actions.querySelector(".btn-edit").innerHTML = isOpen
      ? `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z"/></svg> Edit`
      : `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2l10 10M12 2L2 12"/></svg> Close`;
  });

  // Cancel
  editForm.querySelector(".btn-cancel").addEventListener("click", () => {
    editForm.classList.add("hidden");
    actions.querySelector(".btn-edit").innerHTML =
      `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z"/></svg> Edit`;
  });

  // Save
  editForm.querySelector(".btn-save").addEventListener("click", async () => {
    const btn = editForm.querySelector(".btn-save");
    btn.textContent = "Saving…";
    btn.disabled    = true;

    const updated = {
      name:     editForm.querySelector("[name=name]").value.trim(),
      surname:  editForm.querySelector("[name=surname]").value.trim(),
      jobTitle: editForm.querySelector("[name=jobTitle]").value.trim(),
      company:  editForm.querySelector("[name=company]").value.trim(),
      email:    editForm.querySelector("[name=email]").value.trim(),
      phone:    editForm.querySelector("[name=phone]").value.trim(),
      location: editForm.querySelector("[name=location]").value.trim(),
      color:    editForm.querySelector("[name=color]").value,
    };

    try {
      const res  = await fetch(`${API}/${badge.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(updated),
      });
      const saved = await res.json();

      Object.assign(badge, saved);
      el.data = { ...badge };
      editForm.classList.add("hidden");
      actions.querySelector(".btn-edit").innerHTML =
        `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z"/></svg> Edit`;
    } catch {
      alert("Could not save. Try again.");
    } finally {
      btn.textContent = "Save";
      btn.disabled    = false;
    }
  });

  // Delete
  actions.querySelector(".btn-delete").addEventListener("click", () => deleteBadge(badge.id, wrapper));

  wrapper.appendChild(el);
  wrapper.appendChild(actions);
  wrapper.appendChild(editForm);
  grid.appendChild(wrapper);
}

async function deleteBadge(id, wrapper) {
  if (!confirm("Delete this badge?")) return;

  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    allBadges = allBadges.filter(b => b.id !== id);
    wrapper.remove();

    if (currentPage > Math.ceil(allBadges.length / ITEMS_PER_PAGE)) {
      currentPage = Math.max(1, currentPage - 1);
    }

    if (!allBadges.length) {
      document.getElementById("badge-grid").innerHTML = `
        <div class="state-empty">
          <p>You haven't created any badges yet.</p>
          <a href="/pages/generate-badges.html">Create your first badge →</a>
        </div>`;
      const pag = document.getElementById("profile-pagination");
      if (pag) pag.innerHTML = "";
      return;
    }

    renderPage();
  } catch {
    alert("Could not delete badge. Try again.");
  }
}

init();