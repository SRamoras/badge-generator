const API = "https://69de8fdad6de26e1192810df.mockapi.io/users";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const btn      = e.target.querySelector(".btn-submit");

  if (!username || !password) {
    Swal.fire({ toast: true, position: "top-right", icon: "error", title: "Please fill in all fields.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Logging in…";

  try {
    const res   = await fetch(`${API}?username=${encodeURIComponent(username)}`);
    const users = await res.json();
    const user  = users.find(u => u.username === username && u.password === btoa(password));

    if (!user) {
      Swal.fire({ toast: true, position: "top-right", icon: "error", title: "Invalid username or password.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify({ username: user.username }));
    Swal.fire({ toast: true, position: "top-right", icon: "success", title: "Welcome back! 👋", showConfirmButton: false, timer: 1500, timerProgressBar: true });
    setTimeout(() => window.location.href = "profile.html", 1500);

  } catch {
    Swal.fire({ toast: true, position: "top-right", icon: "error", title: "Something went wrong. Try again.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
  } finally {
    btn.disabled    = false;
    btn.textContent = "Log in →";
  }
});