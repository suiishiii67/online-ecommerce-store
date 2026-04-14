function showToast(message) {
  var toast = document.getElementById("toast-msg");
  if (!toast) return;

  toast.textContent   = message;
  toast.style.display = "block";

  setTimeout(function() {
    toast.style.display = "none";
  }, 3000);
}

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

document.addEventListener("DOMContentLoaded", function() {
  markActiveNav();
});
