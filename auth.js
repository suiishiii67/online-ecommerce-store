
// ── 1. DEMO USER DATABASE ─────────────────────────────────────────────────────
// In a real app, this would be checked against a backend
var DEMO_USERS = [
  { email: "demo@nexgear.in",  password: "demo1234", name: "Demo User"  },
  { email: "arjun@email.com",  password: "arjun123",  name: "Arjun Sharma" }
];

// ── 2. LOGIN LOGIC ────────────────────────────────────────────────────────────

function handleLogin(event) {
  event.preventDefault(); // stop the form from reloading the page

  var emailInput = document.getElementById("login-email");
  var passInput  = document.getElementById("login-password");
  var errorEl    = document.getElementById("login-error");

  if (!emailInput || !passInput) return;

  var email    = emailInput.value.trim().toLowerCase();
  var password = passInput.value;

  // Simple blank check
  if (email === "" || password === "") {
    showAuthError(errorEl, "Please enter your email and password.");
    return;
  }

  // Check against demo users list
  var user = null;
  DEMO_USERS.forEach(function(u) {
    if (u.email === email && u.password === password) {
      user = u;
    }
  });

  if (user) {
    // Save login state and redirect
    sessionStorage.setItem("nexgear_user", JSON.stringify({ name: user.name, email: user.email }));
    hideAuthError(errorEl);

    showSuccessBanner("Welcome back, " + user.name + "! Redirecting…");
    setTimeout(function() { window.location.href = "home.html"; }, 1500);
  } else {
    showAuthError(errorEl, "Incorrect email or password. Try demo@nexgear.in / demo1234");
  }
}

// ── 3. REGISTER LOGIC ────────────────────────────────────────────────────────

function handleRegister(event) {
  event.preventDefault();

  var nameInput    = document.getElementById("reg-name");
  var emailInput   = document.getElementById("reg-email");
  var passInput    = document.getElementById("reg-password");
  var confirmInput = document.getElementById("reg-confirm");
  var errorEl      = document.getElementById("reg-error");

  if (!emailInput || !passInput) return;

  var name     = nameInput    ? nameInput.value.trim()    : "";
  var email    = emailInput.value.trim().toLowerCase();
  var password = passInput.value;
  var confirm  = confirmInput ? confirmInput.value : "";

  // Validation checks
  if (name === "" || email === "" || password === "") {
    showAuthError(errorEl, "Please fill in all fields.");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    showAuthError(errorEl, "Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    showAuthError(errorEl, "Password must be at least 6 characters long.");
    return;
  }

  if (confirm !== "" && password !== confirm) {
    showAuthError(errorEl, "Passwords do not match.");
    return;
  }

  // All good — "register" the user
  hideAuthError(errorEl);
  sessionStorage.setItem("nexgear_user", JSON.stringify({ name: name, email: email }));

  showSuccessBanner("Account created! Welcome, " + name + "! Redirecting…");
  setTimeout(function() { window.location.href = "home.html"; }, 1500);
}

// ── 4. SHOW / HIDE PASSWORD ───────────────────────────────────────────────────

function initPasswordToggle() {
  var toggleBtns = document.querySelectorAll(".toggle-password");
  toggleBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      // Find the associated password input (sibling)
      var wrapper = btn.parentElement;
      var input   = wrapper ? wrapper.querySelector("input[type='password'], input[type='text']") : null;
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈"; // hide icon
      } else {
        input.type = "password";
        btn.textContent = "👁️"; // show icon
      }
    });
  });
}

// ── 5. ERROR / SUCCESS DISPLAY ────────────────────────────────────────────────

function showAuthError(el, message) {
  if (!el) return;
  el.textContent  = message;
  el.style.display = "block";
  el.style.background = "rgba(255,59,48,0.08)";
  el.style.border  = "1px solid rgba(255,59,48,0.25)";
  el.style.color   = "#c0392b";
  el.style.padding = "12px 16px";
  el.style.borderRadius = "10px";
  el.style.fontSize = "13px";
  el.style.marginTop = "12px";
}

function hideAuthError(el) {
  if (!el) return;
  el.style.display = "none";
}

function showSuccessBanner(message) {
  var banner = document.createElement("div");
  banner.style.cssText = [
    "position: fixed",
    "top: 20px", "left: 50%",
    "transform: translateX(-50%)",
    "background: #30d158",
    "color: white",
    "padding: 14px 28px",
    "border-radius: 32px",
    "font-size: 15px",
    "font-weight: 600",
    "z-index: 9999",
    "box-shadow: 0 8px 24px rgba(0,0,0,0.15)"
  ].join(";");
  banner.textContent = message;
  document.body.appendChild(banner);
}

// ── 6. INIT ───────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  // Wire up login form
  var loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  // Wire up register form
  var regForm = document.getElementById("register-form");
  if (regForm) regForm.addEventListener("submit", handleRegister);

  // Password show/hide
  initPasswordToggle();

  // If already logged in, update the Sign In button to show name
  var userData = sessionStorage.getItem("nexgear_user");
  if (userData) {
    var user = JSON.parse(userData);
    var signInBtns = document.querySelectorAll(".btn-primary[href='login.html']");
    signInBtns.forEach(function(btn) {
      btn.textContent = "Hi, " + user.name.split(" ")[0]; // show first name
      btn.href = "#";
    });
  }
});
