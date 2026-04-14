// ui.js
// Shared utility functions used on every page

// Show a small popup message at the bottom of screen ("toast")
function showToast(message) {
  var toast = document.getElementById("toast-msg");
  if (!toast) return;

  toast.textContent   = message;
  toast.style.display = "block";

  // Auto-hide after 3 seconds
  setTimeout(function() {
    toast.style.display = "none";
  }, 3000);
}

// Highlight the current page link in the navbar
function markActiveNav() {
  var currentPage = window.location.pathname.split("/").pop();
  var navLinks    = document.querySelectorAll(".nav-links a");

  for (var i = 0; i < navLinks.length; i++) {
    var href = navLinks[i].getAttribute("href");
    if (href === currentPage) {
      navLinks[i].classList.add("active");
    }
  }
}

// Run on every page load
document.addEventListener("DOMContentLoaded", function() {
  markActiveNav();
});
