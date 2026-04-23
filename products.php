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
    <form class="nav-search" action="products.php" method="get">
      <input type="text" name="search" placeholder="Search products..." value="<?php echo htmlspecialchars(isset($_GET['search']) ? $_GET['search'] : ''); ?>">
      <button type="submit">Search</button>
    </form>
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
var searchQuery = <?php echo json_encode(isset($_GET['search']) ? trim($_GET['search']) : ''); ?>;
</script>
<script src="products.js"></script>
</body>
</html>
