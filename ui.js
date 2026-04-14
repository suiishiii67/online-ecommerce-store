function showToast(message) {
  var toast = document.getElementById("toast-msg");
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(function() {
    toast.style.display = "none";
  }, 3000);
}

function markActiveNav() {
  var page = window.location.pathname.split("/").pop();
  var links = document.querySelectorAll(".nav-links a");

  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (href === page) {
      links[i].classList.add("active");
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  markActiveNav();
});
