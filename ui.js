
function showToast(message) {
  // Remove any existing toast first
  var existing = document.getElementById("nexgear-toast");
  if (existing) existing.remove();

  // Create the toast element
  var toast = document.createElement("div");
  toast.id = "nexgear-toast";
  toast.textContent = message;
  toast.style.cssText = [
    "position: fixed",
    "bottom: 28px",
    "left: 50%",
    "transform: translateX(-50%)",
    "background: #1d1d1f",
    "color: #fff",
    "padding: 12px 24px",
    "border-radius: 32px",
    "font-size: 14px",
    "font-weight: 500",
    "z-index: 9999",
    "box-shadow: 0 8px 32px rgba(0,0,0,0.25)",
    "opacity: 0",
    "transition: opacity 0.3s"
  ].join(";");

  document.body.appendChild(toast);

  // Fade in
  setTimeout(function() { toast.style.opacity = "1"; }, 10);

  // Auto-dismiss after 3 seconds
  setTimeout(function() {
    toast.style.opacity = "0";
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// ── 2. AUTO HIGHLIGHT ACTIVE NAV LINK ────────────────────────────────────────
// Compares the current page URL to each nav link and adds "active" class

function highlightActiveNav() {
  var currentPage = window.location.pathname.split("/").pop(); // e.g. "products.html"
  if (currentPage === "") currentPage = "home.html"; // root → treat as home

  var navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(function(link) {
    var href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ── 3. SCROLL-TO-TOP BUTTON ──────────────────────────────────────────────────
// A small button appears after the user scrolls 400px down

function initScrollToTop() {
  // Create the button element
  var btn = document.createElement("button");
  btn.id = "scroll-top-btn";
  btn.textContent = "↑";
  btn.title = "Back to top";
  btn.style.cssText = [
    "position: fixed",
    "bottom: 28px",
    "right: 28px",
    "width: 44px",
    "height: 44px",
    "border-radius: 50%",
    "background: #0071e3",
    "color: #fff",
    "border: none",
    "font-size: 18px",
    "cursor: pointer",
    "z-index: 888",
    "display: none",
    "align-items: center",
    "justify-content: center",
    "box-shadow: 0 4px 16px rgba(0,113,227,0.35)"
  ].join(";");

  document.body.appendChild(btn);

  // Show button after scrolling 400px
  window.addEventListener("scroll", function() {
    if (window.scrollY > 400) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  // Scroll to the top when clicked
  btn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ── 4. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────────────────────
// Any link with href="#section-id" will smoothly scroll there instead of jumping

function initSmoothScroll() {
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(link) {
    link.addEventListener("click", function(e) {
      var targetId = link.getAttribute("href").slice(1); // remove the "#"
      var target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ── 5. INIT — runs on every page ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  highlightActiveNav();
  initScrollToTop();
  initSmoothScroll();
});
