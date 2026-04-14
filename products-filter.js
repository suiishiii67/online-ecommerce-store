if (typeof allProducts === "undefined") { var allProducts = []; }

var currentPage = 1;
var productsPerPage = 9;
var filteredList = [];

function buildProductCard(product) {
  var badgeHTML = "";
  if (product.badge) {
    badgeHTML = '<span class="product-badge ' + product.badgeType + '">' + product.badge + '</span>';
  }

  return '<div class="product-card">' +
    badgeHTML +
    '<div class="product-image">' + (product.icon || "") + '</div>' +
    '<div class="product-info">' +
      '<div class="product-brand">' + product.brand + '</div>' +
      '<div class="product-name">' + product.name + '</div>' +
      '<div class="product-specs">' + product.category + '</div>' +
      '<div class="stars">★★★★★</div>' +
      '<div class="product-footer">' +
        '<div><span class="price-current">₹' + parseInt(product.price).toLocaleString("en-IN") + '</span></div>' +
        '<button class="btn-add-cart"' +
          ' data-id="'    + product.id       + '"' +
          ' data-name="'  + product.name     + '"' +
          ' data-brand="' + product.brand    + '"' +
          ' data-price="' + product.price    + '"' +
          ' data-icon="'  + (product.icon || "") + '"' +
        '>+ Cart</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function showProducts(list) {
  filteredList = list;
  currentPage = 1;
  renderPage();
}

function renderPage() {
  var container = document.getElementById("products-container");
  var countEl   = document.getElementById("listing-count");

  if (filteredList.length === 0) {
    container.innerHTML = '<p style="color:#888; font-size:14px; padding:20px;">No products found.</p>';
    if (countEl) countEl.textContent = "0 results";
    renderPagination();
    return;
  }

  // Calculate which products to show on this page
  var totalPages = Math.ceil(filteredList.length / productsPerPage);
  var startIndex = (currentPage - 1) * productsPerPage;
  var endIndex   = startIndex + productsPerPage;
  var pageItems  = filteredList.slice(startIndex, endIndex);

  var html = "";
  for (var i = 0; i < pageItems.length; i++) {
    html += buildProductCard(pageItems[i]);
  }
  container.innerHTML = html;

  if (countEl) {
    countEl.textContent = "Showing " + (startIndex + 1) + "-" + Math.min(endIndex, filteredList.length) + " of " + filteredList.length + " products";
  }

  renderPagination();
}

function renderPagination() {
  var paginationEl = document.getElementById("pagination-controls");
  if (!paginationEl) return;

  var totalPages = Math.ceil(filteredList.length / productsPerPage);

  // Hide pagination if only 1 page or no products
  if (totalPages <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  var html = "";

  // Previous button
  if (currentPage > 1) {
    html += '<button class="page-btn" id="prevPageBtn">Previous</button>';
  } else {
    html += '<button class="page-btn" disabled>Previous</button>';
  }

  // Page numbers
  for (var i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += '<button class="page-btn page-active">' + i + '</button>';
    } else {
      html += '<button class="page-btn page-num" data-page="' + i + '">' + i + '</button>';
    }
  }

  // Next button
  if (currentPage < totalPages) {
    html += '<button class="page-btn" id="nextPageBtn">Next</button>';
  } else {
    html += '<button class="page-btn" disabled>Next</button>';
  }

  paginationEl.innerHTML = html;
}

function filterProducts() {
  var selectedCat = document.querySelector('input[name="cat"]:checked').value;
  var maxPrice    = parseInt(document.getElementById("priceRange").value);
  var result      = [];

  for (var i = 0; i < allProducts.length; i++) {
    var p       = allProducts[i];
    var catOk   = (selectedCat === "all") || (p.category === selectedCat);
    var priceOk = parseInt(p.price) <= maxPrice;
    if (catOk && priceOk) result.push(p);
  }

  showProducts(result);
}

document.getElementById("priceRange").addEventListener("input", function() {
  document.getElementById("priceLabel").textContent = "₹" + parseInt(this.value).toLocaleString("en-IN");
});

document.getElementById("applyFilters").addEventListener("click", filterProducts);

document.getElementById("resetFilters").addEventListener("click", function() {
  document.querySelector('input[name="cat"][value="all"]').checked = true;
  document.getElementById("priceRange").value = 50000;
  document.getElementById("priceLabel").textContent = "₹50,000";
  showProducts(allProducts);
});

// ONE single click handler for all "Add to Cart" buttons (event delegation)
var productsContainer = document.getElementById("products-container");
if (productsContainer) {
  productsContainer.addEventListener("click", function(e) {
    var btn = e.target;
    if (!btn.classList.contains("btn-add-cart")) return;

    var pid   = btn.getAttribute("data-id");
    var name  = btn.getAttribute("data-name")  || pid;
    var brand = btn.getAttribute("data-brand") || "";
    var price = btn.getAttribute("data-price") || 0;
    var icon  = btn.getAttribute("data-icon")  || "";

    if (typeof addToCart === "function") addToCart(pid, name, brand, price, icon);
  });
}

// Pagination click handler (event delegation)
var paginationEl = document.getElementById("pagination-controls");
if (paginationEl) {
  paginationEl.addEventListener("click", function(e) {
    var btn = e.target;
    if (!btn.classList.contains("page-btn") || btn.disabled) return;

    if (btn.id === "prevPageBtn") {
      currentPage--;
      renderPage();
    } else if (btn.id === "nextPageBtn") {
      currentPage++;
      renderPage();
    } else if (btn.classList.contains("page-num")) {
      currentPage = parseInt(btn.getAttribute("data-page"));
      renderPage();
    }

    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

showProducts(allProducts);
