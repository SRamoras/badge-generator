const API = "https://69de8fdad6de26e1192810df.mockapi.io/users";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const btn      = e.target.querySelector(".btn-submit");

  if (!username || !password) return;

  btn.disabled     = true;
  btn.textContent  = "Logging in…";

  try {
    const res   = await fetch(`${API}?username=${encodeURIComponent(username)}`);
    const users = await res.json();
    const user  = users.find(u => u.username === username && u.password === password);

    if (!user) {
      showError("Invalid username or password.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify({ id: user.id, username: user.username }));
    window.location.href = "/pages/profile.html";

  } catch (err) {
    console.error(err);
    showError("Something went wrong. Try again.");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Log in →";
  }
});

function showError(msg) {
  let el = document.getElementById("form-error");
  if (!el) {
    el = document.createElement("p");
    el.id = "form-error";
    el.style.cssText = "font-size:12.5px;color:#ef4444;margin-top:10px;text-align:center;";
    document.getElementById("login-form").appendChild(el);
  }
  el.textContent = msg;
}