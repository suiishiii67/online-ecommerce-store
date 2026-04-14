<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Cart - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="cart.css" />
</head>
<body>


  <nav class="navbar">
    <div class="nav-container">
      <a href="home.php" class="nav-logo">
        <div class="logo-icon">N</div>
        NexGear
      </a>
      <ul class="nav-links">
        <li><a href="home.php">Home</a></li>
        <li><a href="products.php">Products</a></li>
        <li><a href="cart.php" class="active">Cart</a></li>
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


    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span>
      <a href="products.php">Products</a> <span>/</span> My Cart
    </div>

    <h1 class="page-title">My Cart <span id="cart-count-label" style="font-size:16px; font-weight:500; color:#6e6e73;"></span></h1>

    <div class="cart-layout">


      <div id="cart-items-wrap">

      </div>


      <aside class="cart-summary">
        <h2 style="font-size:18px; font-weight:700; margin-bottom:16px;">Order Summary</h2>
        <div class="summary-row"><span>Subtotal</span><span id="sum-subtotal">₹0</span></div>
        <div class="summary-row"><span>Delivery</span><span id="sum-delivery">FREE</span></div>
        <div class="summary-row"><span>Discount (5%)</span><span id="sum-discount" style="color:#dc3545;">₹0</span></div>
        <div class="summary-row"><span>GST (18%)</span><span id="sum-gst">₹0</span></div>
        <div class="summary-total">
          <span>Total</span>
          <span id="sum-total">₹0</span>
        </div>
        <a href="checkout.php" class="btn-checkout">Proceed to Checkout →</a>
      </aside>

    </div>
  </div>


  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>


  <div id="toast-msg"></div>


  <script src="cart.js"></script>
  <script src="ui.js"></script>

</body>
</html>
