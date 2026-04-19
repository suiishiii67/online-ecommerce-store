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
      <a href="home.php" class="nav-logo">
        <div class="logo-icon">N</div>
        NexGear
      </a>
      <ul class="nav-links">
        <li><a href="home.php">Home</a></li>
        <li><a href="products.php">Products</a></li>
        <li><a href="cart.php">Cart</a></li>
        <li><a href="order-tracking.php">Orders</a></li>
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

        <div class="summary-total">
          <span>Total</span>
          <span id="co-total">₹0</span>
        </div>

        <button class="btn-place-order" id="placeOrderBtn">Place Order</button>
      </aside>

    </div>
  </div>

  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>

  <script src="cart.js"></script>
  <script>
  // show cart items and calculate total in the order summary
  function loadOrderSummary() {
    var cart = getCart();
    var box = document.getElementById("checkout-items");

    if (cart.length == 0) {
      box.innerHTML = '<p style="font-size:13px; color:#888; padding:8px 0;">Cart is empty. <a href="products.php" style="color:#0071e3;">Add items</a></p>';
      return;
    }

    var html = "";
    var subtotal = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var lineTotal = parseInt(item.price) * item.qty;
      subtotal = subtotal + lineTotal;
      html += '<div class="co-item">';
      html += '<span>' + item.name + ' x' + item.qty + '</span>';
      html += '<span>₹' + lineTotal.toLocaleString("en-IN") + '</span>';
      html += '</div>';
    }

    box.innerHTML = html;

    var discount = Math.floor(subtotal * 0.05);
    var gst = Math.floor((subtotal - discount) * 0.18);
    var total = subtotal - discount + gst;

    document.getElementById("co-subtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
    document.getElementById("co-discount").textContent = "-₹" + discount.toLocaleString("en-IN");
    document.getElementById("co-gst").textContent = "₹" + gst.toLocaleString("en-IN");
    document.getElementById("co-total").textContent = "₹" + total.toLocaleString("en-IN");
    document.getElementById("placeOrderBtn").textContent = "Place Order ₹" + total.toLocaleString("en-IN");
  }

  // validate address and place the order
  document.getElementById("placeOrderBtn").addEventListener("click", function() {
    var cart = getCart();
    if (cart.length == 0) { alert("Your cart is empty!"); return; }

    if (document.getElementById("fname").value.trim() == "")   { alert("Please enter your first name."); return; }
    if (document.getElementById("lname").value.trim() == "")   { alert("Please enter your last name."); return; }
    if (document.getElementById("phone").value.trim() == "")   { alert("Please enter your phone number."); return; }
    if (document.getElementById("addr").value.trim() == "")    { alert("Please enter your address."); return; }
    if (document.getElementById("city").value.trim() == "")    { alert("Please enter your city."); return; }

    var pin = document.getElementById("pincode").value.trim();
    if (pin == "" || pin.length != 6) { alert("Please enter a valid 6-digit PIN code."); return; }

    var orderNum = "NGR-2025-" + Math.floor(1000 + Math.random() * 9000);

    // save this order to order history in browser storage
    var orders = JSON.parse(localStorage.getItem("nexgear_orders") || "[]");
    var now = new Date();
    var dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    var timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    orders.push({
      orderId: orderNum,
      date: dateStr + " " + timeStr,
      items: cart,
      total: document.getElementById("co-total").textContent
    });

    localStorage.setItem("nexgear_orders", JSON.stringify(orders));
    localStorage.removeItem("nexgear_cart");
    alert("Order placed!\nYour Order ID: " + orderNum + "\nWe will deliver your order soon.");
    window.location.href = "order-tracking.php";
  });

  loadOrderSummary();
  </script>

</body>
</html>
