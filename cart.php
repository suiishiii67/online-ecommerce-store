<?php
session_start();
if(!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Cart - NexGear</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .cart-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
    .cart-item { display: flex; align-items: center; justify-content: space-between; gap: 14px; border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin-bottom: 12px; background: white; }
    .cart-item-brand { font-size: 11px; color: #888; text-transform: uppercase; }
    .cart-item-name { font-size: 15px; font-weight: bold; margin: 4px 0; }
    .qty-control { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
    .qty-btn { width: 28px; height: 28px; border: 1px solid #ccc; border-radius: 4px; background: white; font-size: 15px; }
    .qty-value { font-size: 15px; font-weight: bold; min-width: 20px; text-align: center; }
    .btn-remove { background: none; border: none; color: red; font-size: 13px; margin-top: 6px; padding: 0; cursor: pointer; }
    .cart-summary { border: 1px solid #ddd; border-radius: 8px; padding: 18px; background: white; position: sticky; top: 70px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 9px 0; border-bottom: 1px solid #f0f0f0; }
    .summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding: 12px 0; }
    .btn-checkout { display: block; background: #0071e3; color: white; text-align: center; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; margin-top: 8px; }
  </style>
</head>
<body>
<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
    <ul class="nav-links">
      <li><a href="home.php">Home</a></li>
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
      <span style="font-size:13px; color:#333;">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?></span>
      <a href="logout.php" class="btn-primary">Sign Out</a>
    </div>
  </div>
</nav>
<div class="page-wrapper">
  <div class="breadcrumb"><a href="home.php">Home</a> <span>/</span> My Cart</div>
  <h1 class="page-title">My Cart <span id="cart-count-label" style="font-size:16px; font-weight:normal; color:#888;"></span></h1>
  <div class="cart-layout">
    <div id="cart-items-wrap"></div>
    <aside class="cart-summary">
      <h2 style="font-size:18px; font-weight:bold; margin-bottom:14px;">Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><span id="sum-subtotal">₹0</span></div>
      <div class="summary-row"><span>Delivery</span><span id="sum-delivery">FREE</span></div>
      <div class="summary-row"><span>Discount (5%)</span><span id="sum-discount" style="color:red;">₹0</span></div>
      <div class="summary-row"><span>GST (18%)</span><span id="sum-gst">₹0</span></div>
      <div class="summary-total"><span>Total</span><span id="sum-total">₹0</span></div>
      <a href="checkout.php" class="btn-checkout">Proceed to Checkout</a>
    </aside>
  </div>
</div>
<footer>
  <p>© 2025 NexGear. All rights reserved.</p>
</footer>
<script src="cart.js"></script>
</body>
</html>
