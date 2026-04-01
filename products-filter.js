
var ALL_PRODUCTS = [
  { id: 1, name: "Arctis Nova Pro Wireless",    brand: "SteelSeries", price: 24999, badge: "new",     rating: 5, icon: "🎧" },
  { id: 2, name: "UltraGear 27GP850-B",         brand: "LG",          price: 32499, badge: "sale",    rating: 5, icon: "🖥️" },
  { id: 3, name: "Q3 Pro Wireless QMK",         brand: "Keychron",    price: 14999, badge: "",        rating: 5, icon: "⌨️" },
  { id: 4, name: "G Pro X Superlight 2",        brand: "Logitech",    price: 13495, badge: "popular", rating: 5, icon: "🖱️" },
  { id: 5, name: "TITAN Evo XL Series",         brand: "SecretLab",   price: 42999, badge: "",        rating: 5, icon: "🪑" },
  { id: 6, name: "QuadCast S USB Mic",          brand: "HyperX",      price: 11999, badge: "new",     rating: 5, icon: "🎤" },
  { id: 7, name: "Facecam Pro 4K",              brand: "Elgato",      price: 19999, badge: "",        rating: 4, icon: "📷" },
  { id: 8, name: "MM700 RGB Extended Desk Mat", brand: "Corsair",     price: 5499,  badge: "sale",    rating: 4, icon: "🟦" },
  { id: 9, name: "Define 7 Compact PC Case",    brand: "Fractal",     price: 9999,  badge: "",        rating: 4, icon: "🖥️" }
];

// Tracks which filter/sort is currently applied
var currentFilter = "all";  
var currentSort   = "featured";

// ── 2. APPLY FILTER + SORT AND RE-RENDER ────────────────────────────────────

function applyFilterAndSort() {
  var list = ALL_PRODUCTS.slice(); // copy array

  // --- Filter step ---
  if (currentFilter === "new") {
    list = list.filter(function(p) { return p.badge === "new"; });
  } else if (currentFilter === "sale") {
    list = list.filter(function(p) { return p.badge === "sale"; });
  } else if (currentFilter === "popular") {
    list = list.filter(function(p) { return p.badge === "popular"; });
  }
  // "all" → no filtering needed

  // --- Sort step ---
  if (currentSort === "price-low") {
    list.sort(function(a, b) { return a.price - b.price; });
  } else if (currentSort === "price-high") {
    list.sort(function(a, b) { return b.price - a.price; });
  } else if (currentSort === "rated") {
    list.sort(function(a, b) { return b.rating - a.rating; });
  }
  // "featured" → keep original order

  renderProducts(list);
}

// ── 3. RENDER PRODUCT CARDS ──────────────────────────────────────────────────

function renderProducts(list) {
  var grid = document.querySelector(".product-grid");
  var countEl = document.querySelector(".listing-count");

  if (!grid) return;

  // Update count text
  if (countEl) {
    countEl.textContent = "Showing " + list.length + " result" + (list.length !== 1 ? "s" : "");
  }

  if (list.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-secondary);">No products match your filters.</div>';
    return;
  }

  var badges = { new: '<span class="product-badge new">New</span>', sale: '<span class="product-badge sale">Sale</span>', popular: '<span class="product-badge">Popular</span>' };
  grid.innerHTML = list.map(p => `
    <div class="product-card" onclick="window.location='product-detail.html'">
      ${badges[p.badge] || ""}
      <div class="product-image">${p.icon}</div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer" style="margin-top:12px">
          <div class="product-price"><span class="price-current">₹${p.price.toLocaleString("en-IN")}</span></div>
          <button class="btn-add-cart">+ Cart</button>
        </div>
      </div>
    </div>`).join("");


  // Re-attach cart button listeners after re-render
  grid.querySelectorAll(".btn-add-cart").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      if (typeof showToast === "function") showToast("✅ Item added to cart!");
    });
  });
}

// ── 4. FILTER TAG CLICKS (All / New Arrivals / On Sale / Best Rated) ─────────

function initFilterTags() {
  var tags = document.querySelectorAll(".filter-tags .tag");
  tags.forEach(function(tag) {
    tag.addEventListener("click", function() {
      // Remove active class from all tags
      tags.forEach(function(t) { t.classList.remove("active"); });
      tag.classList.add("active");

      // Map tag label to filter key
      var label = tag.textContent.trim().toLowerCase();
      if (label === "all")          currentFilter = "all";
      else if (label === "new arrivals") currentFilter = "new";
      else if (label === "on sale")  currentFilter = "sale";
      else if (label === "best rated") currentFilter = "popular";

      applyFilterAndSort();
    });
  });
}

// ── 5. SORT DROPDOWN ─────────────────────────────────────────────────────────

function initSortDropdown() {
  var select = document.querySelector(".sort-select");
  if (!select) return;

  select.addEventListener("change", function() {
    var val = select.value.toLowerCase();
    if (val.includes("low to high"))  currentSort = "price-low";
    else if (val.includes("high to low")) currentSort = "price-high";
    else if (val.includes("best rated"))  currentSort = "rated";
    else currentSort = "featured";

    applyFilterAndSort();
  });
}

// ── 6. PRICE RANGE SLIDER ─────────────────────────────────────────────────────

function initPriceSlider() {
  var slider = document.querySelector(".range-slider");
  var maxInput = document.querySelectorAll(".price-inputs input")[1];

  if (!slider) return;

  slider.addEventListener("input", function() {
    var maxVal = parseInt(slider.value);
    // Update the max price input field to match the slider
    if (maxInput) maxInput.value = maxVal;
  });
}

// ── 7. APPLY FILTERS BUTTON ──────────────────────────────────────────────────

function initApplyButton() {
  var btn = document.querySelector(".sidebar .btn-primary");
  if (!btn) return;

  btn.addEventListener("click", function() {
    // Just re-apply current state and show a brief confirmation
    applyFilterAndSort();
    btn.textContent = "✓ Applied!";
    setTimeout(function() { btn.textContent = "Apply Filters"; }, 1500);
  });
}

// ── 8. INIT ───────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  // Only run on the products page
  if (!document.querySelector(".product-grid")) return;

  initFilterTags();
  initSortDropdown();
  initPriceSlider();
  initApplyButton();
  // Initial render: show all products
  applyFilterAndSort();
});
