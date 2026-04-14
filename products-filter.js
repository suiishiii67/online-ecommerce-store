var allProducts = [];

function buildProductCard(product) {
  var badgeHTML = "";
  if (product.badge) {
    badgeHTML = '<span class="product-badge ' + product.badgeType + '">' + product.badge + '</span>';
  }

  return '<div class="product-card">' +
    badgeHTML +
    '<div class="product-image">' + (product.icon || "📦") + '</div>' +
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
          ' data-icon="'  + (product.icon || "📦") + '"' +
        '>+ Cart</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function showProducts(list) {
  var container = document.getElementById("products-container");
  var countEl   = document.getElementById("listing-count");

  if (list.length === 0) {
    container.innerHTML = '<p style="color:#888; font-size:14px; padding:20px;">No products found.</p>';
    if (countEl) countEl.textContent = "0 results";
    return;
  }

  var html = "";
  for (var i = 0; i < list.length; i++) {
    html += buildProductCard(list[i]);
  }
  container.innerHTML = html;
  if (countEl) countEl.textContent = "Showing " + list.length + " products";

  var btns = container.querySelectorAll(".btn-add-cart");
  for (var j = 0; j < btns.length; j++) {
    btns[j].addEventListener("click", function(e) {
      e.stopPropagation();
      var pid = this.getAttribute("data-id");
      if (typeof addToCart === "function") addToCart(pid);
    });
  }
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

showProducts(allProducts);
