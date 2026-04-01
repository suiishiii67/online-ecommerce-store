
var PRODUCTS = {
  "arctis-nova-pro":   { name: "Arctis Nova Pro Wireless", brand: "SteelSeries", price: 24999, icon: "🎧" },
  "lg-ultragear":      { name: "UltraGear 27GP850-B",      brand: "LG",          price: 32499, icon: "🖥️" },
  "keychron-q3":       { name: "Q3 Pro Wireless QMK",      brand: "Keychron",    price: 14999, icon: "⌨️" },
  "logitech-super2":   { name: "G Pro X Superlight 2",     brand: "Logitech",    price: 13495, icon: "🖱️" },
  "secretlab-titan":   { name: "TITAN Evo XL Series",      brand: "SecretLab",   price: 42999, icon: "🪑" },
  "hyperx-quadcast":   { name: "QuadCast S USB Mic",       brand: "HyperX",      price: 11999, icon: "🎤" }
};

// Load cart from localStorage (returns an array of {id, qty})
function loadCart() {
  var saved = localStorage.getItem("nexgear_cart");
  return saved ? JSON.parse(saved) : [];
}

// Save cart array back to localStorage
function saveCart(cart) {
  localStorage.setItem("nexgear_cart", JSON.stringify(cart));
}

// Format a number as Indian Rupees e.g. 24999 → "₹24,999"
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ── 3. ADD TO CART ───────────────────────────────────────────────────────────

function addToCart(productId) {
  var cart = loadCart();

  // Check if the item already exists in cart
  var existing = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      existing = cart[i];
      break;
    }
  }

  if (existing) {
    // Item already in cart → increase quantity by 1
    existing.qty = existing.qty + 1;
  } else {
    // New item → add with qty 1
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();

  // Show a small toast notification
  if (typeof showToast === "function") {
    var product = PRODUCTS[productId];
    var name = product ? product.name : productId;
    showToast("✅ Added to cart: " + name);
  }
}

// ── 4. REMOVE FROM CART ──────────────────────────────────────────────────────

function removeFromCart(productId) {
  var cart = loadCart();
  // Keep all items EXCEPT the one being removed
  var newCart = cart.filter(function(item) {
    return item.id !== productId;
  });
  saveCart(newCart);
  renderCart(); // re-draw the cart page
}

// ── 5. UPDATE QUANTITY ───────────────────────────────────────────────────────

function updateQty(productId, newQty) {
  newQty = parseInt(newQty);
  if (isNaN(newQty) || newQty < 1) return; // ignore bad values

  var cart = loadCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].qty = newQty;
      break;
    }
  }
  saveCart(cart);
  renderCart();
}

// ── 6. RENDER CART PAGE ──────────────────────────────────────────────────────

function renderCart() {
  var wrap = document.getElementById("cart-items-wrap");
  if (!wrap) return; // not on the cart page

  var cart = loadCart();

  // Update the "X Items" badge in the page title
  var countBadge = document.querySelector(".cart-count-badge");
  if (countBadge) {
    var total = 0;
    cart.forEach(function(item) { total += item.qty; });
    countBadge.textContent = total + " Item" + (total !== 1 ? "s" : "");
  }

  // Empty state
  if (cart.length === 0) {
    wrap.innerHTML = [
      '<div style="text-align:center; padding: 80px 20px; color: var(--text-secondary);">',
      '  <div style="font-size: 64px; margin-bottom: 20px;">🛒</div>',
      '  <h2 style="font-size:20px; margin-bottom:10px;">Your cart is empty</h2>',
      '  <p style="margin-bottom: 24px;">Add some products to get started.</p>',
      '  <a href="products.html" class="btn-primary" style="padding:12px 28px; border-radius:32px;">Browse Products</a>',
      '</div>'
    ].join("");
    updateSummary(0);
    updateCartBadge();
    return;
  }

  var subtotal = 0;
  var html = cart.map(function(item) {
    var p = PRODUCTS[item.id];
    if (!p) return "";
    var lt = p.price * item.qty;
    subtotal += lt;
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">${p.icon}</div>
        <div>
          <div class="cart-item-brand">${p.brand}</div>
          <div class="cart-item-name">${p.name}</div>
          <div>${formatPrice(p.price)} each</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
          <div style="font-weight:700">${formatPrice(lt)}</div>
          <button class="btn-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>`;
  }).join("");

  wrap.innerHTML = html;
  updateSummary(subtotal);
  updateCartBadge();
}

// Increase or decrease qty by delta (+1 or -1)
function changeQty(productId, delta) {
  var cart = loadCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].qty = cart[i].qty + delta;
      if (cart[i].qty < 1) cart[i].qty = 1; // minimum qty is 1
      break;
    }
  }
  saveCart(cart);
  renderCart();
}

// ── 7. UPDATE ORDER SUMMARY SIDEBAR ─────────────────────────────────────────

function updateSummary(subtotal) {
  var delivery = subtotal > 999 ? 0 : 99;   // free shipping above ₹999
  var discount = Math.floor(subtotal * 0.05); // 5% discount
  var gst      = Math.floor((subtotal - discount) * 0.18); // 18% GST
  var total    = subtotal - discount + gst + delivery;

  // Write values into the DOM
  var set = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("sum-subtotal", formatPrice(subtotal));
  set("sum-delivery", delivery === 0 ? "FREE" : formatPrice(delivery));
  set("sum-discount", "−" + formatPrice(discount));
  set("sum-gst",      formatPrice(gst));
  set("sum-total",    formatPrice(total));
}

// ── 8. UPDATE CART BADGE IN NAVBAR ──────────────────────────────────────────

function updateCartBadge() {
  var cart = loadCart();
  var totalQty = 0;
  cart.forEach(function(item) { totalQty += item.qty; });

  var badges = document.querySelectorAll(".cart-badge");
  badges.forEach(function(badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
  });
}

// ── 9. WIRE UP "ADD TO CART" BUTTONS ─────────────────────────────────────────

// Any button with class "btn-add-cart" and a data-id attribute will add that product
document.addEventListener("DOMContentLoaded", function() {
  // Attach click listeners to all "+ Cart" buttons
  var addButtons = document.querySelectorAll(".btn-add-cart");
  addButtons.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation(); // prevent product card click from firing too
      var productId = btn.getAttribute("data-id");
      if (productId) addToCart(productId);
    });
  });

  // If we are on cart.html, render the cart
  renderCart();

  // Always update the badge count
  updateCartBadge();
});
