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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Orders - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 18px; margin-bottom: 16px; }
    .order-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .order-id { font-size: 15px; font-weight: bold; }
    .order-date { font-size: 13px; color: #666; margin-top: 4px; }
    .order-items { margin-bottom: 10px; }
    .order-item-row { font-size: 13px; padding: 4px 0; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; }
    .order-total { font-size: 14px; font-weight: bold; margin-top: 10px; }
    .status-badge { background: #fff3cd; color: #856404; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px; }
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
        <span style="font-size:13px; color:#333;">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?></span>
        <a href="logout.php" class="btn-primary">Sign Out</a>
      </div>
    </div>
  </nav>

  <div class="page-wrapper">

    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span> My Orders
    </div>

    <h1 class="page-title">My Orders</h1>

    <div id="orders-container"></div>

  </div>

  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>

  <script>
  // read orders saved in browser storage and show them
  function showOrders() {
    var orders = JSON.parse(localStorage.getItem("nexgear_orders") || "[]");
    var container = document.getElementById("orders-container");

    if (orders.length == 0) {
      container.innerHTML =
        '<div style="text-align:center; padding:60px 20px; color:#666;">' +
        '<p style="font-size:15px; font-weight:bold; margin-bottom:8px;">No orders yet</p>' +
        '<p style="font-size:13px;">Your orders will appear here after you place one.</p>' +
        '<a href="products.php" class="btn-primary" style="display:inline-block; margin-top:18px; padding:10px 22px; border-radius:8px;">Shop Now</a>' +
        '</div>';
      return;
    }

    var html = "";

    // show latest orders first
    for (var i = orders.length - 1; i >= 0; i--) {
      var order = orders[i];
      html += '<div class="order-card">';
      html += '<div class="order-header">';
      html += '<div><div class="order-id">' + order.orderId + '</div><div class="order-date">Ordered on: ' + order.date + '</div></div>';
      html += '<span class="status-badge">Out for Delivery</span>';
      html += '</div>';

      html += '<div class="order-items">';
      for (var j = 0; j < order.items.length; j++) {
        var item = order.items[j];
        html += '<div class="order-item-row">';
        html += '<span>' + item.name + ' x' + item.qty + '</span>';
        html += '<span>₹' + (parseInt(item.price) * item.qty).toLocaleString("en-IN") + '</span>';
        html += '</div>';
      }
      html += '</div>';

      html += '<div class="order-total">Total Paid: ' + order.total + ' (Cash on Delivery)</div>';
      html += '</div>';
    }

    container.innerHTML = html;
  }

  showOrders();
  </script>

</body>
</html>
