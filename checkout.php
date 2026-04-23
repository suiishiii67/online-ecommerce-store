<?php
session_start();
if(!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$order_success = "";
$order_error   = "";
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["place_order"])) {
    $user_id   = $_SESSION["user_id"];
    $items     = json_decode($_POST["cart_items"], true);
    $total     = floatval($_POST["grand_total"]);
    $all_ok    = true;
    foreach ($items as $item) {
        $item_total = floatval($item["price"]) * intval($item["qty"]);
        $res = pg_query_params($conn,
            "CALL place_order($1, $2, $3, $4)",
            array($user_id, $item["id"], $item["qty"], $item_total)
        );
        if (!$res) {
            $all_ok      = false;
            $order_error = pg_last_error($conn);
            break;
        }
    }
    if ($all_ok) {
        $order_success = "Order placed successfully!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Checkout - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .checkout-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
    .checkout-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 18px; }
    .checkout-card-title { font-size: 15px; font-weight: bold; margin-bottom: 16px; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .checkout-summary { border: 1px solid #ddd; border-radius: 8px; padding: 18px; }
    .co-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
    .summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eee; }
    .summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding: 12px 0; }
    .btn-place-order { display: block; width: 100%; background: #0071e3; color: white; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; border: none; cursor: pointer; }
    .btn-place-order:hover { background: #005cc8; }
    .cod-note { background: #f5f5f5; padding: 12px; border-radius: 6px; font-size: 13px; color: #555; }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
      <ul class="nav-links">
        <li><a href="home.php">Home</a></li>
        <li><a href="products.php">Products</a></li>
        <li><a href="cart.php">Cart</a></li>
        <li><a href="order-tracking.php">Orders</a></li>
        <li><a href="feedback.php">Contact Us</a></li>
      </ul>
      <form class="nav-search" action="products.php" method="get">
        <input type="text" name="search" placeholder="Search products...">
        <button type="submit">Search</button>
      </form>
      <div class="nav-actions">
        <span style="font-size:13px; color:#333;">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?></span>
        <a href="logout.php" class="btn-primary">Sign Out</a>
      </div>
    </div>
  </nav>
  <div class="page-wrapper">
    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span>
      <a href="cart.php">Cart</a> <span>/</span> Checkout
    </div>
    <h1 class="page-title">Checkout</h1>
    <div class="checkout-layout">
      <div>
        <div class="checkout-card">
          <h2 class="checkout-card-title">Delivery Address</h2>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" class="form-input" id="fname" placeholder="First Name" />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-input" id="lname" placeholder="Last Name" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-input" id="phone" placeholder="Phone Number" />
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" class="form-input" id="addr" placeholder="Flat / House No, Street, Area" />
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" class="form-input" id="city" placeholder="Mumbai" />
            </div>
            <div class="form-group">
              <label class="form-label">PIN Code</label>
              <input type="text" class="form-input" id="pincode" placeholder="400001" maxlength="6" />
            </div>
          </div>
        </div>
        <div class="checkout-card">
          <h2 class="checkout-card-title">Payment Method</h2>
          <div class="cod-note">
            <strong>Cash on Delivery</strong><br>
            You will pay cash when the order is delivered.
          </div>
        </div>
      </div>
      <aside class="checkout-summary">
        <h2 style="font-size:17px; font-weight:bold; margin-bottom:14px;">Order Summary</h2>
        <div id="checkout-items"></div>
        <div class="summary-row"><span>Subtotal</span><span id="co-subtotal">₹0</span></div>
        <div class="summary-row"><span>Delivery</span><span>FREE</span></div>
        <div class="summary-row"><span>Discount (5%)</span><span id="co-discount" style="color:red;">₹0</span></div>
        <div class="summary-row"><span>GST (18%)</span><span id="co-gst">₹0</span></div>
        <div class="summary-total"><span>Total</span><span id="co-total">₹0</span></div>
        <?php if ($order_success != ""): ?>
          <p style="color:green; font-size:13px; margin-bottom:8px;"><?php echo $order_success; ?></p>
        <?php endif; ?>
        <?php if ($order_error != ""): ?>
          <p style="color:red; font-size:13px; margin-bottom:8px;">Error: <?php echo htmlspecialchars($order_error); ?></p>
        <?php endif; ?>
        <form id="orderForm" method="POST" action="checkout.php">
          <input type="hidden" name="place_order" value="1">
          <input type="hidden" name="cart_items" id="cart_items_input">
          <input type="hidden" name="grand_total" id="grand_total_input">
          <button type="submit" class="btn-place-order" id="placeOrderBtn">Place Order</button>
        </form>
      </aside>
    </div>
  </div>
  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>
  <script src="cart.js"></script>
  <script src="checkout.js"></script>
</body>
</html>
