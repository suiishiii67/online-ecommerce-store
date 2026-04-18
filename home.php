<?php
session_start();
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$result = pg_query($conn, "SELECT * FROM products ORDER BY id DESC LIMIT 4");
$featured = [];
while ($row = pg_fetch_assoc($result)) {
    $featured[] = $row;
}
pg_close($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexGear - PC & Gaming Accessories</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .hero-section { background: #f0f4ff; text-align: center; padding: 60px 20px; }
    .hero-section h1 { font-size: 36px; font-weight: bold; margin-bottom: 12px; }
    .hero-section p { font-size: 15px; color: #666; margin-bottom: 20px; }
    .btn-hero { background: #0071e3; color: white; padding: 10px 24px; border-radius: 24px; font-size: 14px; font-weight: bold; margin-right: 8px; display: inline-block; }
    .btn-hero-outline { border: 2px solid #0071e3; color: #0071e3; padding: 9px 24px; border-radius: 24px; font-size: 14px; display: inline-block; }
    .features-bar { padding: 30px 20px; border-bottom: 1px solid #eee; }
    .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1200px; margin: auto; text-align: center; }
    .feat-title { font-size: 14px; font-weight: bold; margin: 6px 0 3px; }
    .feat-desc { font-size: 12px; color: #666; }
    .section { padding: 50px 20px; }
    .container { max-width: 1200px; margin: auto; }
    .section-title { font-size: 26px; font-weight: bold; text-align: center; margin-bottom: 8px; }
    .section-sub { font-size: 14px; color: #666; text-align: center; margin-bottom: 24px; }
    .category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .category-card { border: 1px solid #ddd; border-radius: 10px; padding: 20px 14px; text-align: center; display: block; }
    .category-card:hover { border-color: #0071e3; }
    .cat-name { font-size: 14px; font-weight: bold; }
  </style>
</head>
<body>

<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
    <ul class="nav-links">
      <li><a href="home.php" class="active">Home</a></li>
      <li><a href="products.php">Products</a></li>
      <li><a href="cart.php">Cart</a></li>
      <li><a href="order-tracking.php">Orders</a></li>
      <li><a href="feedback.php">Contact Us</a></li>
    </ul>
    <div class="nav-actions">
      <a href="cart.php" class="cart-icon-wrap">Cart <span class="cart-badge" id="nav-cart-count">0</span></a>
      <a href="login.php" class="btn-primary">Sign In</a>
    </div>
  </div>
</nav>

<section class="hero-section">
  <h1>Level Up Your PC Setup</h1>
  <p>Gaming accessories — keyboards, headsets, monitors and more.</p>
  <a href="products.php" class="btn-hero">Shop Now</a>
  <a href="#categories" class="btn-hero-outline">Browse Categories</a>
</section>

<section class="features-bar">
  <div class="features-grid">
    <div><div class="feat-title">Free Delivery</div><div class="feat-desc">On orders above ₹999</div></div>
    <div><div class="feat-title">Secure Payments</div><div class="feat-desc">UPI, Cards, NetBanking</div></div>
    <div><div class="feat-title">Easy Returns</div><div class="feat-desc">7-day return policy</div></div>
    <div><div class="feat-title">24/7 Support</div><div class="feat-desc">Always here to help</div></div>
  </div>
</section>

<section class="section" id="categories" style="background: #f8f8f8;">
  <div class="container">
    <h2 class="section-title">Shop by Category</h2>
    <p class="section-sub">Find what you need for the perfect setup.</p>
    <div class="category-grid">
      <a href="products.php" class="category-card"><div class="cat-name">Monitors</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Headphones</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Keyboards</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Mouse</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Gaming Chairs</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Microphones</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Webcams</div></a>
      <a href="products.php" class="category-card"><div class="cat-name">Accessories</div></a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">Featured Products</h2>
    <p class="section-sub">Top picks this month.</p>

    <?php if (count($featured) > 0) { ?>
    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:18px;">
      <?php foreach ($featured as $fp) { ?>
      <div style="background:white; border:1px solid #ddd; border-radius:10px; padding:18px; text-align:center;">
        <div style="font-size:11px; color:#888; text-transform:uppercase;"><?php echo htmlspecialchars($fp['category']); ?></div>
        <div style="font-size:15px; font-weight:bold; margin:6px 0;"><?php echo htmlspecialchars($fp['name']); ?></div>
        <div style="font-size:12px; color:#888; margin-bottom:8px;"><?php echo htmlspecialchars($fp['description']); ?></div>
        <div style="font-size:16px; font-weight:bold; color:#0071e3;">₹<?php echo number_format(floatval($fp['price'])); ?></div>
      </div>
      <?php } ?>
    </div>
    <?php } else { ?>
    <p style="text-align:center; color:#888; padding:30px;">No products yet.</p>
    <?php } ?>

    <div style="text-align:center; margin-top:24px;">
      <a href="products.php" class="btn-primary" style="padding:10px 26px; border-radius:20px;">View All Products</a>
    </div>
  </div>
</section>

<footer>
  <p>© 2025 NexGear. All rights reserved.</p>
  <div style="margin-top:8px;">
    <a href="products.php">Products</a>
    <a href="cart.php">Cart</a>
    <a href="feedback.php">Contact</a>
    <a href="admin.php">Admin</a>
  </div>
</footer>

<script src="cart.js"></script>
</body>
</html>