// client-side validation before form submits to register.php

document.getElementById("register-form").addEventListener("submit", function(e) {
  var name     = document.getElementById("reg-name").value.trim();
  var email    = document.getElementById("reg-email").value.trim();
  var phone    = document.getElementById("reg-phone").value.trim();
  var password = document.getElementById("reg-password").value.trim();

  if (name === "") {
    e.preventDefault();
    showToast("Please enter your full name.");
    return;
  }

  if (email === "" || !email.includes("@")) {
    e.preventDefault();
    showToast("Please enter a valid email address.");
    return;
  }

  if (phone === "" || phone.replace(/\D/g, "").length < 10) {
    e.preventDefault();
    showToast("Please enter a valid 10-digit phone number.");
    return;
  }

  if (password.length < 6) {
    e.preventDefault();
    showToast("Password must be at least 6 characters.");
    return;
  }
});
