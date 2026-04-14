// register.js
// Client-side validation before the form submits to process_registration.php

document.getElementById("register-form").addEventListener("submit", function(e) {
  var name     = document.getElementById("reg-name").value.trim();
  var email    = document.getElementById("reg-email").value.trim();
  var phone    = document.getElementById("reg-phone").value.trim();
  var password = document.getElementById("reg-password").value.trim();
  var errorDiv = document.getElementById("reg-error");

  errorDiv.style.display = "none";
  errorDiv.textContent   = "";

  if (name === "") {
    e.preventDefault();
    errorDiv.textContent   = "Please enter your full name.";
    errorDiv.style.display = "block";
    return;
  }

  if (email === "" || !email.includes("@")) {
    e.preventDefault();
    errorDiv.textContent   = "Please enter a valid email address.";
    errorDiv.style.display = "block";
    return;
  }

  if (phone === "" || phone.replace(/\D/g, "").length < 10) {
    e.preventDefault();
    errorDiv.textContent   = "Please enter a valid 10-digit phone number.";
    errorDiv.style.display = "block";
    return;
  }

  if (password.length < 6) {
    e.preventDefault();
    errorDiv.textContent   = "Password must be at least 6 characters.";
    errorDiv.style.display = "block";
    return;
  }

  // If all ok, form submits to process_registration.php (POST)
});
