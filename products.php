<?php
session_start();
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$result = pg_query($conn, "SELECT * FROM products ORDER BY id ASC");
$products = [];
while ($row = pg_fetch_assoc($result)) {
    $products[] = [
        'id'       => $row['id'],
        'name'     => $row['name'],
        'brand'    => $row['description'],
        'category' => $row['category'],
        'price'     => floatval($row['price']),
        'stock'     => intval($row['stock']),
        'image_url' => $row['image_url'] ?? ''
    ];
}
pg_close($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Products - NexGear</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .products-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; }
    .sidebar { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
    .filter-block { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #eee; }
    .filter-heading { font-size: 13px; font-weight: bold; margin-bottom: 8px; }
    .filter-block ul li { margin-bottom: 6px; }
    .filter-block ul li label { font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .listing-area { min-height: 400px; }
    .listing-header { margin-bottom: 16px; }
    .page-btn { padding: 7px 13px; border: 1px solid #ddd; border-radius: 6px; background: white; font-size: 13px; cursor: pointer; }
    .page-btn.page-active { background: #0071e3; color: white; border-color: #0071e3; }
    .page-btn:disabled { opacity: 0.5; cursor: default; }
  </style>
</head>
<body>

<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
    <ul class="nav-links">
      <li><a href="home.php">Home</a></li>
      <li><a href="products.php" class="active">Products</a></li>
      <li><a href="cart.php">Cart</a></li>
      <li><a href="order-tracking.php">Orders</a></li>
      <li><a href="feedback.php">Contact Us</a></li>
    </ul>
    <div class="nav-actions">
      <a href="cart.php" class="cart-icon-wrap">Cart <span class="cart-badge" id="nav-cart-count">0</span></a>
      <?php if(isset($_SESSION["username"])): ?>
        <span style="font-size:13px; color:#333;">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?></span>
        <a href="logout.php" class="btn-primary">Sign Out</a>
      <?php else: ?>
        <a href="login.php" class="btn-primary">Sign In</a>
      <?php endif; ?>
    </div>
  </div>
</nav>

<div class="page-wrapper">

  <div class="breadcrumb">
    <a href="home.php">Home</a> <span>/</span> All Products
  </div>

  <div class="products-layout">

    <aside class="sidebar">
      <div class="filter-block">
        <h3 class="filter-heading">Category</h3>
        <ul>
          <li><label><input type="radio" name="cat" value="all" checked> All Products</label></li>
          <li><label><input type="radio" name="cat" value="Peripherals"> Peripherals</label></li>
          <li><label><input type="radio" name="cat" value="Accessories"> Accessories</label></li>
          <li><label><input type="radio" name="cat" value="Audio"> Audio</label></li>
          <li><label><input type="radio" name="cat" value="Monitors"> Monitors</label></li>
          <li><label><input type="radio" name="cat" value="Headphones"> Headphones</label></li>
          <li><label><input type="radio" name="cat" value="Keyboards"> Keyboards</label></li>
          <li><label><input type="radio" name="cat" value="Mouse"> Mouse</label></li>
          <li><label><input type="radio" name="cat" value="Gaming Chairs"> Gaming Chairs</label></li>
          <li><label><input type="radio" name="cat" value="Microphones"> Microphones</label></li>
          <li><label><input type="radio" name="cat" value="Webcams"> Webcams</label></li>
        </ul>
      </div>

      <div class="filter-block">
        <h3 class="filter-heading">Max Price (₹)</h3>
        <input type="range" id="priceRange" min="0" max="50000" value="50000" style="width:100%;">
        <p style="font-size:13px; margin-top:6px;">Up to: <span id="priceLabel">₹50,000</span></p>
      </div>

      <button class="btn-primary" id="applyFilters" style="width:100%; padding:10px; border-radius:8px; margin-top:10px;">Apply Filters</button>
      <button id="resetFilters" style="width:100%; padding:10px; border-radius:8px; margin-top:8px; border:1px solid #ccc; background:#fff; font-size:13px;">Reset</button>
    </aside>

    <div class="listing-area">
      <div class="listing-header">
        <h1 style="font-size:20px; font-weight:700;">All Products</h1>
        <p id="listing-count" style="font-size:13px; color:#6e6e73;"></p>
      </div>
      <div class="product-grid" id="products-container"></div>
      <div id="pagination-controls" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:28px; margin-bottom:10px;"></div>
    </div>

  </div>
</div>

<footer>
  <p>© 2025 NexGear. All rights reserved.</p>
</footer>

<script src="cart.js"></script>
<script>
var allProducts = <?php echo json_encode($products); ?>;
var filtered = allProducts.slice();
var currentPage = 1;
var perPage = 9;

function makeCard(p) {
  var name  = p.name.replace(/'/g, "\\'");
  var brand = p.brand.replace(/'/g, "\\'");
  var imgHtml = p.image_url
    ? '<img src="' + p.image_url + '" alt="' + name + '" style="width:100%;height:100%;object-fit:contain;">'
    : '';
  return '<div class="product-card" onclick="window.location.href=\'product-detail.php?id=' + p.id + '\'" style="cursor:pointer;">' +
    '<div class="product-image">' + imgHtml + '</div>' +
    '<div class="product-info">' +
    '<div class="product-brand">' + p.brand + '</div>' +
    '<div class="product-name">' + p.name + '</div>' +
    '<div class="product-specs">' + p.category + '</div>' +
    '<div class="product-footer">' +
    '<span class="price-current">₹' + parseInt(p.price).toLocaleString("en-IN") + '</span>' +
    '<button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(\'' + p.id + '\', \'' + name + '\', \'' + brand + '\', ' + p.price + ', \'\')">+ Cart</button>' +
    '</div></div></div>';
}

function showPage() {
  var container = document.getElementById("products-container");
  var countEl = document.getElementById("listing-count");
  var start = (currentPage - 1) * perPage;
  var page = filtered.slice(start, start + perPage);

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:#888; padding:20px;">No products found.</p>';
    countEl.textContent = "0 results";
    document.getElementById("pagination-controls").innerHTML = "";
    return;
  }

  var html = "";
  for (var i = 0; i < page.length; i++) html += makeCard(page[i]);
  container.innerHTML = html;
  countEl.textContent = "Showing " + (start + 1) + "-" + Math.min(start + perPage, filtered.length) + " of " + filtered.length;

  makePagination();
}

function makePagination() {
  var el = document.getElementById("pagination-controls");
  var total = Math.ceil(filtered.length / perPage);
  if (total <= 1) { el.innerHTML = ""; return; }

  var html = '<button class="page-btn" ' + (currentPage == 1 ? "disabled" : 'onclick="changePage(-1)"') + '>Previous</button>';
  for (var i = 1; i <= total; i++) {
    html += '<button class="page-btn ' + (i == currentPage ? "page-active" : "") + '" onclick="gotoPage(' + i + ')">' + i + '</button>';
  }
  html += '<button class="page-btn" ' + (currentPage == total ? "disabled" : 'onclick="changePage(1)"') + '>Next</button>';
  el.innerHTML = html;
}

function changePage(dir) {
  currentPage += dir;
  showPage();
  window.scrollTo(0, 0);
}

function gotoPage(n) {
  currentPage = n;
  showPage();
  window.scrollTo(0, 0);
}

document.getElementById("priceRange").addEventListener("input", function() {
  document.getElementById("priceLabel").textContent = "₹" + parseInt(this.value).toLocaleString("en-IN");
});

document.getElementById("applyFilters").addEventListener("click", function() {
  var cat = document.querySelector('input[name="cat"]:checked').value;
  var maxPrice = parseInt(document.getElementById("priceRange").value);
  filtered = [];
  for (var i = 0; i < allProducts.length; i++) {
    if ((cat == "all" || allProducts[i].category == cat) && allProducts[i].price <= maxPrice) {
      filtered.push(allProducts[i]);
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

showPage();
</script>
</body>
</html>
