
// ── 1. ALL SEARCHABLE PRODUCTS ───────────────────────────────────────────────
var SEARCH_CATALOG = [
  { name: "Arctis Nova Pro Wireless",   brand: "SteelSeries", icon: "🎧", url: "product-detail.html" },
  { name: "UltraGear 27GP850-B",        brand: "LG",          icon: "🖥️", url: "product-detail.html" },
  { name: "Q3 Pro Wireless QMK",        brand: "Keychron",    icon: "⌨️", url: "product-detail.html" },
  { name: "G Pro X Superlight 2",       brand: "Logitech",    icon: "🖱️", url: "product-detail.html" },
  { name: "TITAN Evo XL Series",        brand: "SecretLab",   icon: "🪑", url: "product-detail.html" },
  { name: "QuadCast S USB Mic",         brand: "HyperX",      icon: "🎤", url: "product-detail.html" },
  { name: "Facecam Pro 4K",             brand: "Elgato",      icon: "📷", url: "product-detail.html" },
  { name: "MM700 RGB Extended Desk Mat",brand: "Corsair",     icon: "🟦", url: "product-detail.html" },
  { name: "Define 7 Compact PC Case",   brand: "Fractal",     icon: "🖥️", url: "product-detail.html" },
  { name: "BlackShark V2 Pro",          brand: "Razer",       icon: "🎧", url: "product-detail.html" },
  { name: "K100 RGB Mechanical",        brand: "Corsair",     icon: "⌨️", url: "product-detail.html" },
  { name: "DeathAdder V3 HyperSpeed",   brand: "Razer",       icon: "🖱️", url: "product-detail.html" }
];

// ── 2. SEARCH FUNCTION ───────────────────────────────────────────────────────

// Returns products whose name OR brand contains the query (case-insensitive)
function filterProducts(query) {
  query = query.toLowerCase().trim();
  if (query.length === 0) return [];

  return SEARCH_CATALOG.filter(function(product) {
    return product.name.toLowerCase().includes(query) ||
           product.brand.toLowerCase().includes(query);
  });
}

// ── 3. RENDER THE DROPDOWN ───────────────────────────────────────────────────

function renderDropdown(results, dropdown) {
  if (results.length === 0) {
    dropdown.innerHTML = '<div class="search-no-results">No products found</div>';
    dropdown.style.display = "block";
    return;
  }
  dropdown.innerHTML = results.map(item => `
    <a href="${item.url}" class="search-result-item">
      <span class="search-result-icon">${item.icon}</span>
      <div class="search-result-info">
        <div class="search-result-name">${item.name}</div>
        <div class="search-result-brand">${item.brand}</div>
      </div>
    </a>`).join("");
  dropdown.style.display = "block";
}

function hideDropdown(dropdown) {
  dropdown.style.display = "none";
  dropdown.innerHTML = "";
}

// ── 4. INIT — wire everything up on page load ─────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  var input    = document.getElementById("navSearchInput");
  var dropdown = document.getElementById("searchDropdown");

  // Only run if the search elements exist on this page
  if (!input || !dropdown) return;

  // Listen for typing in the search input
  input.addEventListener("input", function() {
    var query   = input.value;
    var results = filterProducts(query);

    if (query.trim().length === 0) {
      hideDropdown(dropdown);
    } else {
      renderDropdown(results, dropdown);
    }
  });

  // Press Escape → close dropdown and clear input
  input.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      input.value = "";
      hideDropdown(dropdown);
    }
  });

  // Clicking anywhere outside the search wrapper → close dropdown
  document.addEventListener("click", function(e) {
    var wrapper = document.getElementById("searchWrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      hideDropdown(dropdown);
    }
  });
});
