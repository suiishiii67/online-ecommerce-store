// cart.js
// Handles: adding to cart, removing, updating qty, showing cart page, badge count

// Product data - our local "database"
var PRODUCTS = {
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

// Load cart from localStorage
function loadCart() {
  var saved = localStorage.getItem("nexgear_cart");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("nexgear_cart", JSON.stringify(cart));
}

// Format number to Indian rupees
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Add a product to cart
function addToCart(productId) {
  var cart = loadCart();
  var found = false;

  // Check if product already in cart
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
      break;
    }
  }

  // If not in cart, add it
  if (!found) {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();

  // Show toast
  var product = PRODUCTS[productId];
  var name = product ? product.name : productId;
  showToast("Added to cart: " + name);
}

// Remove a product from cart
function removeFromCart(productId) {
  var cart = loadCart();
  var newCart = [];

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i]);
    }
  }

  saveCart(newCart);
  renderCart();
}

// Change qty (delta = +1 or -1)
function changeQty(productId, delta) {
  var cart = loadCart();

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].qty = cart[i].qty + delta;
      if (cart[i].qty < 1) {
        cart[i].qty = 1; // don't go below 1
      }
      break;
    }
  }

  saveCart(cart);
  renderCart();
}

// Update the cart badge number in the navbar
function updateCartBadge() {
  var cart = loadCart();
  var totalQty = 0;

  for (var i = 0; i < cart.length; i++) {
    totalQty += cart[i].qty;
  }

  var badge = document.getElementById("nav-cart-count");
  if (badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
  }
}

// Calculate and update order summary totals
function updateSummary(subtotal) {
  var delivery = subtotal > 999 ? 0 : 99;
  var discount = Math.floor(subtotal * 0.05);
  var gst      = Math.floor((subtotal - discount) * 0.18);
  var total    = subtotal - discount + gst + delivery;

  var setText = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText("sum-subtotal", formatPrice(subtotal));
  setText("sum-delivery", delivery === 0 ? "FREE" : formatPrice(delivery));
  setText("sum-discount", "-" + formatPrice(discount));
  setText("sum-gst", formatPrice(gst));
  setText("sum-total", formatPrice(total));
}

// Render the cart page items
function renderCart() {
  var wrap = document.getElementById("cart-items-wrap");
  if (!wrap) return; // not on cart page

  var cart = loadCart();

  // Update item count label
  var countLabel = document.getElementById("cart-count-label");
  if (countLabel) {
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].qty;
    countLabel.textContent = "(" + total + " item" + (total !== 1 ? "s" : "") + ")";
  }

  // Empty cart state
  if (cart.length === 0) {
    wrap.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#6e6e73;">' +
      '<div style="font-size:60px; margin-bottom:16px;">🛒</div>' +
      '<h2 style="font-size:20px; margin-bottom:10px;">Your cart is empty</h2>' +
      '<p style="margin-bottom:20px;">Add some products first.</p>' +
      '<a href="products.html" class="btn-primary" style="padding:10px 24px; border-radius:24px;">Browse Products</a>' +
    '</div>';
    updateSummary(0);
    updateCartBadge();
    return;
  }

  // Build cart items HTML
  var html = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var p = PRODUCTS[item.id];
    if (!p) continue;

    var lineTotal = p.price * item.qty;
    subtotal += lineTotal;

    html += '<div class="cart-item">' +
      '<div class="cart-item-image">' + p.icon + '</div>' +
      '<div style="flex:1;">' +
        '<div class="cart-item-brand">' + p.brand + '</div>' +
        '<div class="cart-item-name">' + p.name + '</div>' +
        '<div style="font-size:13px; color:#6e6e73;">' + formatPrice(p.price) + ' each</div>' +
        '<div class="qty-control">' +
          '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">-</button>' +
          '<span class="qty-value">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
        '</div>' +
        '<button class="btn-remove" onclick="removeFromCart(\'' + item.id + '\')">Remove</button>' +
      '</div>' +
      '<div style="font-size:16px; font-weight:700;">' + formatPrice(lineTotal) + '</div>' +
    '</div>';
  }

  wrap.innerHTML = html;
  updateSummary(subtotal);
  updateCartBadge();
}

// On page load — wire up add-to-cart buttons and render cart if on cart page
document.addEventListener("DOMContentLoaded", function() {

  // Attach click to all add-to-cart buttons on the page
  var addBtns = document.querySelectorAll(".btn-add-cart");
  for (var i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener("click", function(e) {
      e.stopPropagation();
      var pid = this.getAttribute("data-id");
      if (pid) addToCart(pid);
    });
  }

  // Render cart (only does something on cart.html)
  renderCart();

  // Always update badge
  updateCartBadge();
});
