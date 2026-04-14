<?php
session_start();

/* === DATABASE CONNECTION START === */
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
/* === DATABASE CONNECTION END === */

/* === FETCHING FEATURED PRODUCTS FROM DATABASE START === */
$featured_result = pg_query($conn, "SELECT * FROM products ORDER BY id DESC LIMIT 4");
$featured = [];
while ($row = pg_fetch_assoc($featured_result)) {
    $featured[] = $row;
}
/* === FETCHING FEATURED PRODUCTS FROM DATABASE END === */

/* === DATABASE CONNECTION CLOSE === */
pg_close($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NexGear - PC &amp; Gaming Accessories</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="home.css" />
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
        <li><a href="home.php" class="active">Home</a></li>
        <li><a href="products.php">Products</a></li>
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

  <!-- Hero Section -->
  <section class="hero-section">
    <h1>Level Up Your PC Setup</h1>
    <p>Premium gaming accessories — keyboards, headsets, monitors and more.</p>
    <div style="margin-top: 24px;">
      <a href="products.php" class="btn-hero">Shop Now</a>
      <a href="#categories" class="btn-hero-outline">Browse Categories</a>
    </div>

    <!-- Stats loaded from backend -->
    <div class="hero-stats" id="hero-stats" style="display:none;">
      <!-- filled by backend -->
    </div>
  </section>

  <!-- Features Bar -->
  <section class="features-bar">
    <div class="container">
      <div class="features-grid">
        <div class="feature">
          <div class="feat-icon">Delivery</div>
          <div class="feat-title">Free Delivery</div>
          <div class="feat-desc">On orders above ₹999</div>
        </div>
        <div class="feature">
          <div class="feat-icon">Secure</div>
          <div class="feat-title">Secure Payments</div>
          <div class="feat-desc">UPI, Cards, NetBanking</div>
        </div>
        <div class="feature">
          <div class="feat-icon">Returns</div>
          <div class="feat-title">Easy Returns</div>
          <div class="feat-desc">7-day return policy</div>
        </div>
        <div class="feature">
          <div class="feat-icon">Support</div>
          <div class="feat-title">24/7 Support</div>
          <div class="feat-desc">Always here to help</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="section" id="categories" style="background: #f8f8f8;">
    <div class="container">
      <h2 class="section-title">Shop by Category</h2>
      <p class="section-sub">Find what you need for the perfect gaming setup.</p>
      <div class="category-grid">
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Monitors</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Headphones</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Keyboards</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Mouse</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Gaming Chairs</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Microphones</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">Webcams</div>
        </a>
        <a href="products.php" class="category-card">
          <div class="cat-icon"></div>
          <div class="cat-name">PC Cabinets</div>
        </a>
      </div>
    </div>
  </section>

  <!-- Featured Products -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">Featured Products</h2>
      <p class="section-sub">Top picks this month.</p>

      <!-- === FEATURED PRODUCTS FROM DATABASE START === -->
      <?php if (count($featured) > 0) { ?>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:20px;">
        <?php foreach ($featured as $fp) {
          $fprice = number_format(floatval($fp['price']));
        ?>
        <div style="background:#fff; border:1px solid #e5e5e7; border-radius:12px; padding:20px; text-align:center;">
          <div style="font-size:11px; color:#6e6e73; text-transform:uppercase; letter-spacing:0.5px;"><?php echo htmlspecialchars($fp['category']); ?></div>
          <div style="font-size:15px; font-weight:600; margin:6px 0;"><?php echo htmlspecialchars($fp['name']); ?></div>
          <div style="font-size:12px; color:#6e6e73; margin-bottom:8px;"><?php echo htmlspecialchars($fp['description']); ?></div>
          <div style="font-size:16px; font-weight:700; color:#0071e3;">₹<?php echo $fprice; ?></div>
        </div>
        <?php } ?>
      </div>
      <?php } else { ?>
      <div style="text-align:center; padding:40px 20px; color:#6e6e73; border:1px dashed #ddd; border-radius:12px;">
        <p style="font-size:14px;">No products available yet. Add products via Admin Panel.</p>
      </div>
      <?php } ?>
      <!-- === FEATURED PRODUCTS FROM DATABASE END === -->

      <div style="text-align: center; margin-top: 24px;">
        <a href="products.php" class="btn-primary" style="padding: 10px 28px; border-radius: 24px; font-size: 14px;">View All Products →</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
    <div style="margin-top: 8px;">
      <a href="products.php">Products</a>
      <a href="cart.php">Cart</a>
      <a href="feedback.php">Contact</a>
      <a href="admin.php">Admin</a>
    </div>
  </footer>

  <!-- Toast -->
  <div id="toast-msg"></div>

  <!-- JS Files -->
  <script src="cart.js"></script>
  <script src="ui.js"></script>

</body>
</html>
