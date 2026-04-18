<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Orders - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .track-form { background: #f8f8f8; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .orders-list { display: flex; flex-direction: column; gap: 16px; }
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 18px; }
    .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .order-id { font-size: 15px; font-weight: bold; margin-bottom: 4px; }
    .order-date { font-size: 13px; color: #666; }
    .order-status { font-size: 13px; font-weight: bold; padding: 4px 12px; border-radius: 20px; }
    .order-status.delivered { background: #d4edda; color: #155724; }
    .order-status.transit { background: #fff3cd; color: #856404; }
    .order-items-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .item-chip { background: #f0f0f0; border: 1px solid #ddd; border-radius: 20px; padding: 4px 10px; font-size: 13px; }
    .timeline { padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 14px; }
    .timeline-step { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
    .t-dot { width: 12px; height: 12px; border-radius: 50%; background: #ccc; margin-top: 3px; flex-shrink: 0; }
    .t-dot.done { background: #28a745; }
    .t-dot.active { background: #0071e3; }
    .t-label { font-size: 14px; font-weight: bold; }
    .t-date { font-size: 12px; color: #666; }
    .order-footer { display: flex; justify-content: space-between; align-items: center; }
    .btn-sm-outline { border: 1px solid #0071e3; color: #0071e3; padding: 6px 14px; border-radius: 6px; font-size: 13px; background: white; cursor: pointer; }
  </style>
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
        <li><a href="cart.php">Cart</a></li>
        <li><a href="order-tracking.php" class="active">Orders</a></li>
        <li><a href="feedback.php">Contact Us</a></li>
      </ul>
      <div class="nav-actions">
        <a href="login.php" class="btn-primary">Sign In</a>
      </div>
    </div>
  </nav>

  <div class="page-wrapper">

    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span> My Orders
    </div>

    <h1 class="page-title">My Orders</h1>

    <div class="track-form">
      <h3 style="font-size:15px; font-weight:bold; margin-bottom:10px;">Track an Order</h3>
      <div style="display:flex; gap:10px;">
        <input type="text" class="form-input" id="trackInput" placeholder="Enter Order ID (e.g. NGR-2025-0001)" style="max-width:340px;" />
        <button class="btn-primary" id="trackBtn" style="padding:10px 18px; border-radius:8px;">Track</button>
      </div>
      <div id="track-result" style="margin-top:10px; font-size:13px;"></div>
    </div>

    <div class="orders-list" id="orders-container">
      <div style="text-align:center; padding:60px 20px; color:#666;">
        <p style="font-size:15px; font-weight:bold; margin-bottom:8px;">No orders yet</p>
        <p style="font-size:13px;">Your orders will appear here after you place one.</p>
        <a href="products.php" class="btn-primary" style="display:inline-block; margin-top:18px; padding:10px 22px; border-radius:8px;">Shop Now</a>
      </div>
    </div>

  </div>

  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>

  <script>
  document.getElementById("trackBtn").addEventListener("click", function() {
    var orderId = document.getElementById("trackInput").value.trim().toUpperCase();
    var resultDiv = document.getElementById("track-result");

    if (orderId == "") {
      resultDiv.textContent = "Please enter an order ID.";
      resultDiv.style.color = "#dc3545";
      return;
    }

    resultDiv.textContent = "Order tracking requires a backend connection.";
    resultDiv.style.color = "#666";
  });

  document.getElementById("trackInput").addEventListener("keypress", function(e) {
    if (e.key == "Enter") {
      document.getElementById("trackBtn").click();
    }
  });
  </script>

</body>
</html>
