// register.js
// Handles the registration form - demo mode, no real backend or PHP

document.getElementById("register-form").addEventListener("submit", function(e) {
  e.preventDefault();

  var name     = document.getElementById("reg-name").value.trim();
  var email    = document.getElementById("reg-email").value.trim();
  var phone    = document.getElementById("reg-phone").value.trim();
  var password = document.getElementById("reg-password").value.trim();
  var errorDiv = document.getElementById("reg-error");

  // Hide previous error
  errorDiv.style.display = "none";
  errorDiv.textContent   = "";

  // Validation checks
  if (name === "") {
    errorDiv.textContent   = "Please enter your full name.";
    errorDiv.style.display = "block";
    return;
  }
  if (email === "" || !email.includes("@")) {
    errorDiv.textContent   = "Please enter a valid email address.";
    errorDiv.style.display = "block";
    return;
  }
  if (phone === "" || phone.length < 10) {
    errorDiv.textContent   = "Please enter a valid phone number.";
    errorDiv.style.display = "block";
    return;
  }
  if (password === "" || password.length < 6) {
    errorDiv.textContent   = "Password must be at least 6 characters.";
    errorDiv.style.display = "block";
    return;
  }

  // Save user info locally (demo mode)
  localStorage.setItem("nexgear_logged_in", "true");
  localStorage.setItem("nexgear_user_email", email);
  localStorage.setItem("nexgear_user_name",  name);

  showToast("Account created! Redirecting...");

  setTimeout(function() {
    window.location.href = "home.html";
  }, 1500);
});
