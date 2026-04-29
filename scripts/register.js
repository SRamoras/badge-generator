const API = "https://69de8fdad6de26e1192810df.mockapi.io/users";

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm  = document.getElementById("confirm-password").value.trim();
  const btn      = e.target.querySelector(".btn-submit");

  if (!username || !password) return;

  if (password !== confirm) {
    showError("Passwords don't match.");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Creating account…";

  try {
    // Check if username already exists
    const check = await fetch(`${API}?username=${encodeURIComponent(username)}`);
    const existing = await check.json();

    if (existing.some(u => u.username === username)) {
      showError("Username already taken.");
      return;
    }

    const res  = await fetch(API, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password }),
    });
    const user = await res.json();

    localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id, username: user.username }));
    window.location.href = "/pages/profile.html";

  } catch (err) {
    console.error(err);
    showError("Something went wrong. Try again.");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Create account →";
  }
});

function showError(msg) {
  let el = document.getElementById("form-error");
  if (!el) {
    el = document.createElement("p");
    el.id = "form-error";
    el.style.cssText = "font-size:12.5px;color:#ef4444;margin-top:10px;text-align:center;";
    document.getElementById("register-form").appendChild(el);
  }
  el.textContent = msg;
}