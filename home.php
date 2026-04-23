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
  </style>
</head>
<body>
<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
    <ul class="nav-links">
      <li><a href="home.php" class="active">Home</a></li>
      <li><a href="products.php">Products</a></li>
      <li><a href="order-tracking.php">Orders</a></li>
      <li><a href="feedback.php">Contact Us</a></li>
    </ul>
    <form class="nav-search" action="products.php" method="get">
      <input type="text" name="search" placeholder="Search products...">
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
<section class="hero-section">
  <h1>Level Up Your PC Setup</h1>
  <p>Gaming accessories — keyboards, headsets, monitors and more.</p>
  <a href="products.php" class="btn-hero">Shop Now</a>
  <a href="#categories" class="btn-hero-outline">Browse Categories</a>
</section>
<section class="features-bar">
  <div class="features-grid">
    <div style="text-align:center;">
      <img src="images/pngtree-free-delivery-truck-icon-png-image_6565580.png" alt="Free Delivery" style="height:120px; object-fit:contain;">
    </div>
    <div style="text-align:center;">
      <img src="images/secure-payment-label-maximum-security-and-reliability-when-paying-online-png.webp" alt="Secure Payment" style="height:120px; object-fit:contain;">
    </div>
    <div style="text-align:center;">
      <img src="images/pngtree-simple-line-retail-icon-for-easy-returns-great-for-templates-web-png-image_12754937.png" alt="Easy Returns" style="height:120px; object-fit:contain;">
    </div>
    <div style="text-align:center;">
      <div style="height:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#e8f0fc" stroke="#0071e3" stroke-width="2"/>
          <text x="32" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#0071e3" font-family="Arial">24/7</text>
          <path d="M20 38 Q20 44 26 44 Q28 44 30 42 L28 38 Q26 38 26 36 Q26 30 32 26 Q38 22 42 24 L44 28 Q42 30 40 28 Q38 28 36 34 Q34 40 38 42 Q40 44 42 42 Q44 40 44 38" stroke="#0071e3" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
        <span style="font-size:12px; font-weight:bold; color:#333;">24/7 Support</span>
      </div>
    </div>
  </div>
</section>
<section style="padding: 30px 20px;">
  <div style="max-width:1200px; margin:auto;">
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
      <a href="products.php">
        <img src="images/MSI-BANNER.webp" alt="MSI Banner" style="width:100%; height:250px; object-fit:cover; display:block;">
      </a>
      <a href="products.php">
        <img src="images/keyboard.jpg" alt="Keyboard" style="width:100%; height:250px; object-fit:cover; display:block;">
      </a>
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
      <div class="product-card" onclick="window.location.href='product-detail.php?id=<?php echo $fp['id']; ?>'" style="cursor:pointer;">
        <div class="product-image">
          <?php if (!empty($fp['image_url'])): ?>
            <img src="<?php echo htmlspecialchars($fp['image_url']); ?>" alt="<?php echo htmlspecialchars($fp['name']); ?>" style="width:100%;height:100%;object-fit:contain;">
          <?php endif; ?>
        </div>
        <div class="product-info">
          <div class="product-brand"><?php echo htmlspecialchars($fp['description']); ?></div>
          <div class="product-name"><?php echo htmlspecialchars($fp['name']); ?></div>
          <div class="product-specs"><?php echo htmlspecialchars($fp['category']); ?></div>
          <div class="product-footer">
            <span class="price-current">₹<?php echo number_format(floatval($fp['price'])); ?></span>
            <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('<?php echo $fp['id']; ?>', '<?php echo addslashes($fp['name']); ?>', '<?php echo addslashes($fp['description']); ?>', <?php echo floatval($fp['price']); ?>, '')">+ Cart</button>
          </div>
        </div>
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
