<?php
session_start();
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
    .payment-options { display: flex; flex-direction: column; gap: 8px; }
    .payment-option { border: 1px solid #ddd; border-radius: 6px; padding: 10px 12px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    .checkout-summary { border: 1px solid #ddd; border-radius: 8px; padding: 18px; }
    .co-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
    .co-item-name { flex: 1; font-weight: bold; }
    .co-item-price { font-weight: bold; }
    .summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eee; }
    .summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding: 12px 0; }
    .btn-place-order { display: block; width: 100%; background: #0071e3; color: white; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; border: none; cursor: pointer; }
    .btn-place-order:hover { background: #005cc8; }
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
        <a href="login.php" class="btn-primary">Sign In</a>
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

      <div class="checkout-forms">

        <div class="checkout-card">
          <h2 class="checkout-card-title">Step 1 — Delivery Address</h2>

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
            <label class="form-label">Address Line 1</label>
            <input type="text" class="form-input" id="addr1" placeholder="Flat / House No, Street" />
          </div>

          <div class="form-group">
            <label class="form-label">Address Line 2 (optional)</label>
            <input type="text" class="form-input" id="addr2" placeholder="Area, Landmark" />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" class="form-input" id="city" placeholder="Mumbai" />
            </div>
            <div class="form-group">
              <label class="form-label">State</label>
              <select class="form-select" id="state">
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>West Bengal</option>
                <option>Gujarat</option>
                <option>Rajasthan</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">PIN Code</label>
            <input type="text" class="form-input" id="pincode" placeholder="400001" maxlength="6" />
          </div>
        </div>

        <div class="checkout-card">
          <h2 class="checkout-card-title">Step 2 — Payment Method</h2>

          <div class="payment-options">
            <label class="payment-option">
              <input type="radio" name="payment" value="card" checked /> Credit / Debit Card
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="upi" /> UPI
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="cod" /> Cash on Delivery
            </label>
          </div>

          <div id="card-fields" style="margin-top: 16px;">
            <div class="form-group">
              <label class="form-label">Card Number</label>
              <input type="text" class="form-input" id="cardnum" placeholder="1234 5678 9012 3456" maxlength="19" />
            </div>
            <div class="form-group">
              <label class="form-label">Cardholder Name</label>
              <input type="text" class="form-input" id="cardname" placeholder="As printed on card" />
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Expiry</label>
                <input type="text" class="form-input" id="expiry" placeholder="MM/YY" maxlength="5" />
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input type="password" class="form-input" id="cvv" placeholder="123" maxlength="4" />
              </div>
            </div>
          </div>

          <div id="upi-fields" style="margin-top:16px; display:none;">
            <div class="form-group">
              <label class="form-label">UPI ID</label>
              <input type="text" class="form-input" placeholder="yourname@upi" />
            </div>
          </div>

          <div id="cod-note" style="margin-top:16px; display:none; background:#f5f5f5; padding:12px; border-radius:6px; font-size:13px; color:#555;">
            You will pay cash at the time of delivery.
          </div>
        </div>

      </div>

      <aside class="checkout-summary">
        <h2 style="font-size:17px; font-weight:bold; margin-bottom:14px;">Order Summary</h2>

        <div id="checkout-items"></div>

        <div class="summary-row"><span>Subtotal</span><span id="co-subtotal">₹0</span></div>
        <div class="summary-row"><span>Delivery</span><span>FREE</span></div>
        <div class="summary-row"><span>Discount (5%)</span><span id="co-discount" style="color:#dc3545;">₹0</span></div>
        <div class="summary-row"><span>GST (18%)</span><span id="co-gst">₹0</span></div>

        <div class="summary-total">
          <span>Total Payable</span>
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
  // show order items and total price in the summary box
  function loadOrderSummary() {
    var cart = getCart();
    var box = document.getElementById("checkout-items");
    if (box == null) return;

    if (cart.length == 0) {
      box.innerHTML = '<p style="font-size:13px; color:#888; padding:10px 0;">Cart is empty. <a href="products.php" style="color:#0071e3;">Add items</a></p>';
      return;
    }

    var html = "";
    var subtotal = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var lineTotal = parseInt(item.price) * item.qty;
      subtotal = subtotal + lineTotal;
      html += '<div class="co-item">';
      html += '<div class="co-item-name">' + item.name + '<br><span style="font-weight:normal; color:#888;">Qty: ' + item.qty + '</span></div>';
      html += '<div class="co-item-price">₹' + lineTotal.toLocaleString("en-IN") + '</div>';
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

    var btn = document.getElementById("placeOrderBtn");
    if (btn != null) {
      btn.textContent = "Place Order ₹" + total.toLocaleString("en-IN");
    }
  }

  // show or hide payment fields based on what the user selects
  var radios = document.querySelectorAll('input[name="payment"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", function() {
      document.getElementById("card-fields").style.display = "none";
      document.getElementById("upi-fields").style.display = "none";
      document.getElementById("cod-note").style.display = "none";

      if (this.value == "card") document.getElementById("card-fields").style.display = "block";
      if (this.value == "upi")  document.getElementById("upi-fields").style.display = "block";
      if (this.value == "cod")  document.getElementById("cod-note").style.display = "block";
    });
  }

  // check form and place the order when button is clicked
  document.getElementById("placeOrderBtn").addEventListener("click", function() {
    var cart = getCart();
    if (cart.length == 0) { alert("Your cart is empty!"); return; }

    // check that all required fields are filled
    if (document.getElementById("fname").value.trim() == "") { alert("Please enter your first name."); return; }
    if (document.getElementById("lname").value.trim() == "") { alert("Please enter your last name."); return; }
    if (document.getElementById("phone").value.trim() == "") { alert("Please enter your phone number."); return; }
    if (document.getElementById("addr1").value.trim() == "") { alert("Please enter your address."); return; }
    if (document.getElementById("city").value.trim() == "")  { alert("Please enter your city."); return; }

    var pin = document.getElementById("pincode").value.trim();
    if (pin == "" || pin.length != 6) { alert("Please enter a valid 6-digit PIN code."); return; }

    // check card fields if card payment is selected
    var payment = document.querySelector('input[name="payment"]:checked').value;
    if (payment == "card") {
      if (document.getElementById("cardnum").value.trim() == "")  { alert("Please enter your card number."); return; }
      if (document.getElementById("cardname").value.trim() == "") { alert("Please enter the cardholder name."); return; }
      if (document.getElementById("expiry").value.trim() == "")   { alert("Please enter the expiry date."); return; }
      if (document.getElementById("cvv").value.trim() == "")      { alert("Please enter the CVV."); return; }
    }

    // generate a random order id and confirm the order
    var orderNum = "NGR-2025-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.removeItem("nexgear_cart");
    alert("Order placed successfully!\nYour Order ID is: " + orderNum + "\n\nYou will be redirected to the orders page.");
    window.location.href = "order-tracking.php";
  });

  loadOrderSummary();
  </script>

</body>
</html>
