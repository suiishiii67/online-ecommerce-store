function loadCheckoutSummary() {
  var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");
  var box = document.getElementById("checkout-items");
  if (!box) return;

  if (cart.length === 0) {
    box.innerHTML = '<p style="font-size:13px; color:#888; padding:10px 0;">Cart is empty. <a href="products.php" style="color:#0071e3;">Add items</a></p>';
    return;
  }

  var html = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var lineTotal = parseInt(item.price) * item.qty;
    subtotal += lineTotal;

    html += '<div class="co-item">';
    html += '<div class="co-item-icon">' + (item.icon || "") + '</div>';
    html += '<div class="co-item-name">' + item.name + '<br><span style="font-weight:400; color:#6e6e73;">Qty: ' + item.qty + '</span></div>';
    html += '<div class="co-item-price">₹' + lineTotal.toLocaleString("en-IN") + '</div>';
    html += '</div>';
  }

  box.innerHTML = html;

  var discount = Math.floor(subtotal * 0.05);
  var gst = Math.floor((subtotal - discount) * 0.18);
  var total = subtotal - discount + gst;

  if (document.getElementById("co-subtotal")) document.getElementById("co-subtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (document.getElementById("co-discount")) document.getElementById("co-discount").textContent = "-₹" + discount.toLocaleString("en-IN");
  if (document.getElementById("co-gst"))      document.getElementById("co-gst").textContent      = "₹" + gst.toLocaleString("en-IN");
  if (document.getElementById("co-total"))    document.getElementById("co-total").textContent    = "₹" + total.toLocaleString("en-IN");

  var btn = document.getElementById("placeOrderBtn");
  if (btn) btn.textContent = "Place Order & Pay ₹" + total.toLocaleString("en-IN");
}

function setupPaymentToggle() {
  var radios = document.querySelectorAll('input[name="payment"]');

  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", function() {
      var cf = document.getElementById("card-fields");
      var uf = document.getElementById("upi-fields");
      var cn = document.getElementById("cod-note");

      if (cf) cf.style.display = "none";
      if (uf) uf.style.display = "none";
      if (cn) cn.style.display = "none";

      if (this.value === "card" && cf) cf.style.display = "block";
      if (this.value === "upi"  && uf) uf.style.display = "block";
      if (this.value === "cod"  && cn) cn.style.display = "block";
    });
  }
}

function setupPlaceOrder() {
  var btn = document.getElementById("placeOrderBtn");
  if (!btn) return;

  btn.addEventListener("click", function() {
    var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");
    if (cart.length === 0) { showToast("Your cart is empty. Please add items first."); return; }

    var fname   = document.getElementById("fname");
    var lname   = document.getElementById("lname");
    var phone   = document.getElementById("phone");
    var addr1   = document.getElementById("addr1");
    var city    = document.getElementById("city");
    var pincode = document.getElementById("pincode");

    if (!fname.value.trim())   { showToast("Please enter your first name."); return; }
    if (!lname.value.trim())   { showToast("Please enter your last name."); return; }
    if (!phone.value.trim())   { showToast("Please enter your phone number."); return; }
    if (!addr1.value.trim())   { showToast("Please enter your address."); return; }
    if (!city.value.trim())    { showToast("Please enter your city."); return; }
    if (!pincode.value.trim() || pincode.value.trim().length !== 6) {
      showToast("Please enter a valid 6-digit PIN code.");
      return;
    }

    var payment = document.querySelector('input[name="payment"]:checked').value;
    if (payment === "card") {
      if (!document.getElementById("cardnum").value.trim())  { showToast("Please enter your card number."); return; }
      if (!document.getElementById("cardname").value.trim()) { showToast("Please enter the cardholder name."); return; }
      if (!document.getElementById("expiry").value.trim())   { showToast("Please enter the expiry date."); return; }
      if (!document.getElementById("cvv").value.trim())      { showToast("Please enter the CVV."); return; }
    }

    var orderNum = "NGR-2025-" + Math.floor(1000 + Math.random() * 9000);
    var overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; z-index:9999;";
    overlay.innerHTML =
      '<div style="background:#fff; border-radius:16px; padding:40px; max-width:400px; width:90%; text-align:center;">' +
        '<h2 style="font-size:22px; font-weight:700; margin-bottom:10px;">Order Placed!</h2>' +
        '<p style="color:#6e6e73; font-size:14px; margin-bottom:20px;">Your order will arrive in 3-5 business days.</p>' +
        '<div style="background:#f5f5f7; border-radius:8px; padding:12px; margin-bottom:24px; font-size:14px;">Order ID: <strong>' + orderNum + '</strong></div>' +
        '<a href="order-tracking.php" style="background:#0071e3; color:#fff; padding:12px 24px; border-radius:24px; font-size:14px; font-weight:600; text-decoration:none; margin-right:10px;">Track Order</a>' +
        '<a href="home.php" style="background:#f0f0f0; color:#333; padding:12px 24px; border-radius:24px; font-size:14px; font-weight:600; text-decoration:none;">Back to Home</a>' +
      '</div>';

    document.body.appendChild(overlay);
    localStorage.removeItem("nexgear_cart");
  });
}

document.addEventListener("DOMContentLoaded", function() {
  loadCheckoutSummary();
  setupPaymentToggle();
  setupPlaceOrder();
});
