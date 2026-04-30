const API = "https://69de8fdad6de26e1192810df.mockapi.io/users";

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm  = document.getElementById("confirm-password").value.trim();
  const btn      = e.target.querySelector(".btn-submit");

  if (!username || !password) {
    Swal.fire({ toast: true, position: "top-right", icon: "error", title: "Please fill in all fields.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
    return;
  }

  if (password !== confirm) {
    Swal.fire({ toast: true, position: "top-right", icon: "error", title: "Passwords don't match.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Creating account…";

  const createdAt = new Date().toISOString();

  try {
    const res  = await fetch(API, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password: btoa(password), createdAt }),
    });
    const user = await res.json();

    localStorage.setItem("loggedInUser", JSON.stringify({ username: user.username }));
    Swal.fire({ toast: true, position: "top-right", icon: "success", title: "Account created! Redirecting…", showConfirmButton: false, timer: 1500, timerProgressBar: true });
    setTimeout(() => window.location.href = "profile.html", 1500);

  } catch {
    Swal.fire({ toast: true, position: "top-right", icon: "error", title: "Something went wrong. Try again.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
  } finally {
    btn.disabled    = false;
    btn.textContent = "Create account →";
  }
});