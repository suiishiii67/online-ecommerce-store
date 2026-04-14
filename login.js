// client-side validation before form submits to login.php

document.getElementById("login-form").addEventListener("submit", function(e) {
  var email    = document.getElementById("login-email").value.trim();
  var password = document.getElementById("login-password").value.trim();

  if (email === "") {
    e.preventDefault();
    showToast("Please enter your email address.");
    return;
  }

  if (password === "") {
    e.preventDefault();
    showToast("Please enter your password.");
    return;
  }
});
