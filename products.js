var filtered = allProducts.slice();
var currentPage = 1;
var perPage = 9;
function makeCard(p) {
  var card = document.createElement("div");
  card.className = "product-card";
  card.style.cursor = "pointer";
  card.onclick = function() {
    window.location.href = "product-detail.php?id=" + p.id;
  };
  var img = p.image_url
    ? '<img src="' + p.image_url + '" style="width:100%;height:100%;object-fit:contain;">'
    : '';
  card.innerHTML =
    '<div class="product-image">' + img + '</div>' +
    '<div class="product-info">' +
      '<div class="product-brand">' + p.brand + '</div>' +
      '<div class="product-name">' + p.name + '</div>' +
      '<div class="product-specs">' + p.category + '</div>' +
      '<div class="product-footer">' +
        '<span class="price-current">₹' + parseInt(p.price).toLocaleString("en-IN") + '</span>' +
        '<button class="btn-add-cart">+ Cart</button>' +
      '</div>' +
    '</div>';
  var btn = card.querySelector(".btn-add-cart");
  btn.onclick = function(e) {
    e.stopPropagation();
    addToCart(p.id, p.name, p.brand, p.price, "");
  };
  return card;
}
function showPage() {
  var container = document.getElementById("products-container");
  var countEl = document.getElementById("listing-count");
  var start = (currentPage - 1) * perPage;
  var page = filtered.slice(start, start + perPage);
  container.innerHTML = "";
  if (filtered.length == 0) {
    container.innerHTML = '<p style="color:#888; padding:20px;">No products found.</p>';
    countEl.textContent = "0 results";
    document.getElementById("pagination-controls").innerHTML = "";
    return;
  }
  for (var i = 0; i < page.length; i++) {
    container.appendChild(makeCard(page[i]));
  }
  countEl.textContent = "Showing " + (start + 1) + " - " + Math.min(start + perPage, filtered.length) + " of " + filtered.length;
  showPagination();
}
function showPagination() {
  var el = document.getElementById("pagination-controls");
  var totalPages = Math.ceil(filtered.length / perPage);
  if (totalPages <= 1) { el.innerHTML = ""; return; }
  var html = "";
  if (currentPage == 1) {
    html += '<button class="page-btn" disabled>Previous</button>';
  } else {
    html += '<button class="page-btn" onclick="changePage(-1)">Previous</button>';
  }
  for (var i = 1; i <= totalPages; i++) {
    if (i == currentPage) {
      html += '<button class="page-btn page-active">' + i + '</button>';
    } else {
      html += '<button class="page-btn" onclick="gotoPage(' + i + ')">' + i + '</button>';
    }
  }
  if (currentPage == totalPages) {
    html += '<button class="page-btn" disabled>Next</button>';
  } else {
    html += '<button class="page-btn" onclick="changePage(1)">Next</button>';
  }
  el.innerHTML = html;
}
function changePage(dir) {
  currentPage = currentPage + dir;
  showPage();
  window.scrollTo(0, 0);
}
function gotoPage(n) {
  currentPage = n;
  showPage();
  window.scrollTo(0, 0);
}
document.getElementById("applyFilters").addEventListener("click", function() {
  var cat = document.querySelector('input[name="cat"]:checked').value;
  var maxPrice = parseInt(document.getElementById("priceRange").value);
  filtered = [];
  for (var i = 0; i < allProducts.length; i++) {
    var p = allProducts[i];
    if ((cat == "all" || p.category == cat) && p.price <= maxPrice) {
      filtered.push(p);
    }
  }
  currentPage = 1;
  showPage();
});
document.getElementById("resetFilters").addEventListener("click", function() {
  document.querySelector('input[name="cat"][value="all"]').checked = true;
  document.getElementById("priceRange").value = 50000;
  document.getElementById("priceLabel").textContent = "₹50,000";
  filtered = allProducts.slice();
  currentPage = 1;
  showPage();
});
document.getElementById("priceRange").addEventListener("input", function() {
  document.getElementById("priceLabel").textContent = "₹" + parseInt(this.value).toLocaleString("en-IN");
});
if (typeof searchQuery !== 'undefined' && searchQuery != '') {
  filtered = [];
  for (var i = 0; i < allProducts.length; i++) {
    var text = (allProducts[i].name + ' ' + allProducts[i].brand + ' ' + allProducts[i].category).toLowerCase();
    if (text.indexOf(searchQuery.toLowerCase()) != -1) {
      filtered.push(allProducts[i]);
    }
  }
}
showPage();
