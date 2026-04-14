// checkout.js
// Handles: showing cart items on checkout, payment toggle, and placing order

// Product list (same as cart.js - needed here too)
var CHECKOUT_PRODUCTS = {
  "arctis-nova-pro":  { name: "Arctis Nova Pro Wireless", brand: "SteelSeries", price: 24999, icon: "🎧" },
  "lg-ultragear":     { name: "UltraGear 27GP850-B",      brand: "LG",          price: 32499, icon: "🖥️" },
  "keychron-q3":      { name: "Q3 Pro Wireless QMK",      brand: "Keychron",    price: 14999, icon: "⌨️" },
  "logitech-super2":  { name: "G Pro X Superlight 2",     brand: "Logitech",    price: 13495, icon: "🖱️" },
  "secretlab-titan":  { name: "TITAN Evo XL Series",      brand: "SecretLab",   price: 42999, icon: "🪑" },
  "hyperx-quadcast":  { name: "QuadCast S USB Mic",       brand: "HyperX",      price: 11999, icon: "🎤" },
  "facecam-pro":      { name: "Facecam Pro 4K",           brand: "Elgato",      price: 19999, icon: "📷" },
  "razer-blackshark": { name: "BlackShark V2 Pro 2023",   brand: "Razer",       price: 17999, icon: "🎧" },
  "hyperx-cloud3":    { name: "Cloud III Wireless",       brand: "HyperX",      price: 12999, icon: "🎧" },
  "logitech-g935":    { name: "G935 Wireless 7.1",        brand: "Logitech",    price: 10499, icon: "🎧" },
  "corsair-hs80":     { name: "HS80 RGB Wireless",        brand: "Corsair",     price: 9999,  icon: "🎧" },
  "corsair-mat":      { name: "MM700 RGB Desk Mat",       brand: "Corsair",     price: 5499,  icon: "🟦" },
  "fractal-case":     { name: "Define 7 PC Case",         brand: "Fractal",     price: 9999,  icon: "🖥️" },
  "asus-rog-monk":    { name: "ROG Gladius III Wireless", brand: "ASUS",        price: 8999,  icon: "🖱️" },
  "asus-27-monitor":  { name: "ROG Swift 27in QHD 165Hz", brand: "ASUS",       price: 38000, icon: "🖥️" }
};

// Load cart items and fill order summary
function loadCheckoutSummary() {
  var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");
  var itemsBox = document.getElementById("checkout-items");

  if (!itemsBox) return;

  // If cart is empty
  if (cart.length === 0) {
    itemsBox.innerHTML = '<p style="font-size:13px; color:#888; padding:10px 0;">Cart is empty. <a href="products.html" style="color:#0071e3;">Add items</a></p>';
    return;
  }

  var html = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var p = CHECKOUT_PRODUCTS[item.id];
    if (!p) continue;

    var lineTotal = p.price * item.qty;
    subtotal += lineTotal;

    html += '<div class="co-item">' +
      '<div class="co-item-icon">' + p.icon + '</div>' +
      '<div class="co-item-name">' + p.name + '<br><span style="font-weight:400; color:#6e6e73;">Qty: ' + item.qty + '</span></div>' +
      '<div class="co-item-price">₹' + lineTotal.toLocaleString("en-IN") + '</div>' +
    '</div>';
  }

  itemsBox.innerHTML = html;

  // Calculate totals
  var discount = Math.floor(subtotal * 0.05);
  var gst      = Math.floor((subtotal - discount) * 0.18);
  var total    = subtotal - discount + gst;

  // Update totals in DOM
  var el = function(id) { return document.getElementById(id); };
  if (el("co-subtotal")) el("co-subtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (el("co-discount")) el("co-discount").textContent = "-₹" + discount.toLocaleString("en-IN");
  if (el("co-gst"))      el("co-gst").textContent      = "₹" + gst.toLocaleString("en-IN");
  if (el("co-total"))    el("co-total").textContent     = "₹" + total.toLocaleString("en-IN");

  var btn = document.getElementById("placeOrderBtn");
  if (btn) btn.textContent = "Place Order & Pay ₹" + total.toLocaleString("en-IN");
}

// Show/hide payment sub-forms based on selection
function setupPaymentToggle() {
  var radioButtons = document.querySelectorAll('input[name="payment"]');
  var cardFields   = document.getElementById("card-fields");
  var upiFields    = document.getElementById("upi-fields");
  var codNote      = document.getElementById("cod-note");

  for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("change", function() {
      // Hide all first
      if (cardFields) cardFields.style.display = "none";
      if (upiFields)  upiFields.style.display  = "none";
      if (codNote)    codNote.style.display    = "none";

      // Show the right one
      if (this.value === "card" && cardFields)  cardFields.style.display  = "block";
      if (this.value === "upi"  && upiFields)   upiFields.style.display   = "block";
      if (this.value === "cod"  && codNote)     codNote.style.display     = "block";
    });
  }
}

// Basic validation and show success message
function setupPlaceOrder() {
  var btn = document.getElementById("placeOrderBtn");
  if (!btn) return;

  btn.addEventListener("click", function() {
    var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");

    // Check cart is not empty
    if (cart.length === 0) {
      showToast("Your cart is empty. Please add items first.");
      return;
    }

    // Check delivery form fields
    var fname   = document.getElementById("fname");
    var lname   = document.getElementById("lname");
    var phone   = document.getElementById("phone");
    var addr1   = document.getElementById("addr1");
    var city    = document.getElementById("city");
    var pincode = document.getElementById("pincode");

    if (!fname.value.trim()) { showToast("Please enter your first name."); return; }
    if (!lname.value.trim()) { showToast("Please enter your last name."); return; }
    if (!phone.value.trim()) { showToast("Please enter your phone number."); return; }
    if (!addr1.value.trim()) { showToast("Please enter your address."); return; }
    if (!city.value.trim())  { showToast("Please enter your city."); return; }
    if (!pincode.value.trim() || pincode.value.trim().length !== 6) {
      showToast("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Check selected payment
    var selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    if (selectedPayment === "card") {
      var cardnum  = document.getElementById("cardnum");
      var cardname = document.getElementById("cardname");
      var expiry   = document.getElementById("expiry");
      var cvv      = document.getElementById("cvv");
      if (!cardnum.value.trim())  { showToast("Please enter your card number."); return; }
      if (!cardname.value.trim()) { showToast("Please enter cardholder name."); return; }
      if (!expiry.value.trim())   { showToast("Please enter expiry date."); return; }
      if (!cvv.value.trim())      { showToast("Please enter CVV."); return; }
    }

    // All ok — show success
    var orderNum = "NGR-2025-" + Math.floor(1000 + Math.random() * 9000);

    var overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; z-index:9999;";

    overlay.innerHTML =
      '<div style="background:#fff; border-radius:16px; padding:40px; max-width:400px; width:90%; text-align:center;">' +
        '<div style="font-size:60px; margin-bottom:16px;">🎉</div>' +
        '<h2 style="font-size:22px; font-weight:700; margin-bottom:10px;">Order Placed!</h2>' +
        '<p style="color:#6e6e73; font-size:14px; margin-bottom:20px;">Your order will arrive in 3-5 business days.</p>' +
        '<div style="background:#f5f5f7; border-radius:8px; padding:12px; margin-bottom:24px; font-size:14px;">' +
          'Order ID: <strong>' + orderNum + '</strong>' +
        '</div>' +
        '<a href="order-tracking.html" style="background:#0071e3; color:#fff; padding:12px 24px; border-radius:24px; font-size:14px; font-weight:600; text-decoration:none; margin-right:10px;">Track Order</a>' +
        '<a href="home.html" style="background:#f0f0f0; color:#333; padding:12px 24px; border-radius:24px; font-size:14px; font-weight:600; text-decoration:none;">Back to Home</a>' +
      '</div>';

    document.body.appendChild(overlay);

    // Clear the cart
    localStorage.removeItem("nexgear_cart");
  });
}

// Run everything when page loads
document.addEventListener("DOMContentLoaded", function() {
  loadCheckoutSummary();
  setupPaymentToggle();
  setupPlaceOrder();
});
