if (typeof allProducts === "undefined") { var allProducts = []; }

var currentPage = 1;
var productsPerPage = 9;
var filteredList = [];

function buildProductCard(p) {
  var badge = p.badge ? '<span class="product-badge ' + p.badgeType + '">' + p.badge + '</span>' : "";
  var card = '<div class="product-card">' + badge;
  card += '<div class="product-image">' + (p.icon || "") + '</div>';
  card += '<div class="product-info">';
  card += '<div class="product-brand">' + p.brand + '</div>';
  card += '<div class="product-name">' + p.name + '</div>';
  card += '<div class="product-specs">' + p.category + '</div>';
  card += '<div class="stars">★★★★★</div>';
  card += '<div class="product-footer">';
  card += '<div><span class="price-current">₹' + parseInt(p.price).toLocaleString("en-IN") + '</span></div>';
  card += '<button class="btn-add-cart" data-id="' + p.id + '" data-name="' + p.name + '" data-brand="' + p.brand + '" data-price="' + p.price + '" data-icon="' + (p.icon || "") + '">+ Cart</button>';
  card += '</div></div></div>';
  return card;
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

  var start     = (currentPage - 1) * productsPerPage;
  var end       = start + productsPerPage;
  var pageItems = filteredList.slice(start, end);
  var html      = "";

  for (var i = 0; i < pageItems.length; i++) {
    html += buildProductCard(pageItems[i]);
  }

  container.innerHTML = html;

  if (countEl) {
    countEl.textContent = "Showing " + (start + 1) + "-" + Math.min(end, filteredList.length) + " of " + filteredList.length + " products";
  }

  renderPagination();
}

function renderPagination() {
  var paginationEl = document.getElementById("pagination-controls");
  if (!paginationEl) return;

  var totalPages = Math.ceil(filteredList.length / productsPerPage);
  if (totalPages <= 1) { paginationEl.innerHTML = ""; return; }

  var html = "";
  html += currentPage > 1 ? '<button class="page-btn" id="prevPageBtn">Previous</button>' : '<button class="page-btn" disabled>Previous</button>';

  for (var i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += '<button class="page-btn page-active">' + i + '</button>';
    } else {
      html += '<button class="page-btn page-num" data-page="' + i + '">' + i + '</button>';
    }
  }

  html += currentPage < totalPages ? '<button class="page-btn" id="nextPageBtn">Next</button>' : '<button class="page-btn" disabled>Next</button>';
  paginationEl.innerHTML = html;
}

function filterProducts() {
  var cat      = document.querySelector('input[name="cat"]:checked').value;
  var maxPrice = parseInt(document.getElementById("priceRange").value);
  var result   = [];

  for (var i = 0; i < allProducts.length; i++) {
    var p = allProducts[i];
    if ((cat === "all" || p.category === cat) && parseInt(p.price) <= maxPrice) {
      result.push(p);
    }
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

var paginationEl = document.getElementById("pagination-controls");
if (paginationEl) {
  paginationEl.addEventListener("click", function(e) {
    var btn = e.target;
    if (!btn.classList.contains("page-btn") || btn.disabled) return;

    if (btn.id === "prevPageBtn")              currentPage--;
    else if (btn.id === "nextPageBtn")         currentPage++;
    else if (btn.classList.contains("page-num")) currentPage = parseInt(btn.getAttribute("data-page"));

    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

showProducts(allProducts);
