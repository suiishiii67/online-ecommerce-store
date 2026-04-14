<?php
session_start();

/* === DATABASE CONNECTION START === */
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
/* === DATABASE CONNECTION END === */

/* === FETCHING PRODUCTS FROM DATABASE START === */
$result = pg_query($conn, "SELECT * FROM products ORDER BY id ASC");
$products_for_js = [];

while ($row = pg_fetch_assoc($result)) {
    $products_for_js[] = [
        'id'       => $row['id'],
        'name'     => $row['name'],
        'brand'    => $row['description'],
        'category' => $row['category'],
        'price'    => floatval($row['price']),
        'icon'     => '',
        'stock'    => intval($row['stock'])
    ];
}
/* === FETCHING PRODUCTS FROM DATABASE END === */

/* === DATABASE CONNECTION CLOSE === */
pg_close($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Products - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="products.css" />
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar">
    <div class="nav-container">
      <a href="home.php" class="nav-logo">
        <div class="logo-icon">N</div>
        NexGear
      </a>
      <ul class="nav-links">
        <li><a href="home.php">Home</a></li>
        <li><a href="products.php" class="active">Products</a></li>
        <li><a href="cart.php">Cart</a></li>
        <li><a href="order-tracking.php">Orders</a></li>
        <li><a href="feedback.php">Contact Us</a></li>
      </ul>
      <div class="nav-actions">
        <a href="cart.php" class="cart-icon-wrap">
          Cart
          <span class="cart-badge" id="nav-cart-count">0</span>
        </a>
        <a href="login.php" class="btn-primary">Sign In</a>
      </div>
    </div>
  </nav>

  <div class="page-wrapper">

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span> All Products
    </div>

    <div class="products-layout">

      <!-- Sidebar Filters -->
      <aside class="sidebar">

        <div class="filter-block">
          <h3 class="filter-heading">Category</h3>
          <ul>
            <li><label><input type="radio" name="cat" value="all" checked /> All Products</label></li>
            <li><label><input type="radio" name="cat" value="Peripherals" /> Peripherals</label></li>
            <li><label><input type="radio" name="cat" value="Accessories" /> Accessories</label></li>
            <li><label><input type="radio" name="cat" value="Audio" /> Audio</label></li>
            <li><label><input type="radio" name="cat" value="Monitors" /> Monitors</label></li>
            <li><label><input type="radio" name="cat" value="Headphones" /> Headphones</label></li>
            <li><label><input type="radio" name="cat" value="Keyboards" /> Keyboards</label></li>
            <li><label><input type="radio" name="cat" value="Mouse" /> Mouse</label></li>
            <li><label><input type="radio" name="cat" value="Gaming Chairs" /> Gaming Chairs</label></li>
            <li><label><input type="radio" name="cat" value="Microphones" /> Microphones</label></li>
            <li><label><input type="radio" name="cat" value="Webcams" /> Webcams</label></li>
          </ul>
        </div>

        <div class="filter-block">
          <h3 class="filter-heading">Max Price (₹)</h3>
          <input type="range" id="priceRange" min="0" max="50000" value="50000" style="width:100%;" />
          <p style="font-size: 13px; margin-top: 6px;">Up to: <span id="priceLabel">₹50,000</span></p>
        </div>

        <button class="btn-primary" id="applyFilters" style="width:100%; padding:10px; border-radius:8px; margin-top:10px;">Apply Filters</button>
        <button id="resetFilters" style="width:100%; padding:10px; border-radius:8px; margin-top:8px; border:1px solid #ccc; background:#fff; font-size:13px;">Reset</button>

      </aside>

      <!-- Product Listing -->
      <div class="listing-area">
        <div class="listing-header">
          <h1 id="listing-title" style="font-size:20px; font-weight:700;">All Products</h1>
          <p id="listing-count" style="font-size:13px; color:#6e6e73;"></p>
        </div>

        <div class="product-grid" id="products-container">
          <!-- Products inserted by JS -->
        </div>

        <!-- Pagination buttons inserted by products-filter.js -->
        <div id="pagination-controls" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:28px; margin-bottom:10px;"></div>

      </div>
    </div>
  </div>


  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>


  <div id="toast-msg"></div>


  <script src="cart.js"></script>

  <!-- === LOADING PRODUCTS FROM DATABASE INTO JAVASCRIPT START === -->
  <script>
    var allProducts = <?php echo json_encode($products_for_js); ?>;
  </script>
  <!-- === LOADING PRODUCTS FROM DATABASE INTO JAVASCRIPT END === -->

  <script src="products-filter.js"></script>
  <script src="ui.js"></script>

</body>
</html>
