// login.js
// Handles the login form submit - demo mode, no real backend

document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault(); // stop form from submitting to a server

  var email    = document.getElementById("login-email").value.trim();
  var password = document.getElementById("login-password").value.trim();
  var errorDiv = document.getElementById("login-error");

  // Hide any previous errors
  errorDiv.style.display = "none";
  errorDiv.textContent   = "";

  // Basic check: email and password must not be empty
  if (email === "") {
    errorDiv.textContent   = "Please enter your email address.";
    errorDiv.style.display = "block";
    return;
  }

  if (password === "") {
    errorDiv.textContent   = "Please enter your password.";
    errorDiv.style.display = "block";
    return;
  }

  // Check email format (simple check)
  if (!email.includes("@") || !email.includes(".")) {
    errorDiv.textContent   = "Please enter a valid email address.";
    errorDiv.style.display = "block";
    return;
  }

  // In demo mode: any valid email + any password is accepted
  // Save a simple "logged in" flag and the user's name
  localStorage.setItem("nexgear_logged_in", "true");
  localStorage.setItem("nexgear_user_email", email);

  // Show success message then redirect
  showToast("Login successful! Redirecting...");

  setTimeout(function() {
    window.location.href = "home.html";
  }, 1500);
});
