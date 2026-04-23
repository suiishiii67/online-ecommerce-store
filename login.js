document.getElementById("loginForm").addEventListener("submit", function(e) {
  var email    = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();
  if (email == "") {
    e.preventDefault();
    alert("Please enter your email address.");
    return;
  }
  if (password == "") {
    e.preventDefault();
    alert("Please enter your password.");
    return;
  }
});
