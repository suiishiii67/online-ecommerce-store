document.getElementById("registerForm").addEventListener("submit", function(e) {
  var name     = document.getElementById("regName").value.trim();
  var email    = document.getElementById("regEmail").value.trim();
  var phone    = document.getElementById("regPhone").value.trim();
  var password = document.getElementById("regPassword").value.trim();
  if (name == "") {
    e.preventDefault();
    alert("Please enter your full name.");
    return;
  }
  if (email == "" || !email.includes("@")) {
    e.preventDefault();
    alert("Please enter a valid email address.");
    return;
  }
  if (phone.length < 10) {
    e.preventDefault();
    alert("Please enter a valid 10-digit phone number.");
    return;
  }
  if (password.length < 6) {
    e.preventDefault();
    alert("Password must be at least 6 characters.");
    return;
  }
});
