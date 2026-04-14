// login.js
// Client-side validation before the form submits to login_check.php

document.getElementById("login-form").addEventListener("submit", function(e) {
  var email    = document.getElementById("login-email").value.trim();
  var password = document.getElementById("login-password").value.trim();
  var errorDiv = document.getElementById("login-error");

  errorDiv.style.display = "none";
  errorDiv.textContent   = "";

  // Check email
  if (email === "") {
    e.preventDefault();
    errorDiv.textContent   = "Please enter your email address.";
    errorDiv.style.display = "block";
    return;
  }

  // Check password
  if (password === "") {
    e.preventDefault();
    errorDiv.textContent   = "Please enter your password.";
    errorDiv.style.display = "block";
    return;
  }

  // If all ok, form submits naturally to login_check.php (POST)
});
