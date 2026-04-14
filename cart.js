// cart uses localStorage to store items
// each item has: { id, name, brand, price, icon, qty }

function loadCart() {
  var saved = localStorage.getItem("nexgear_cart");
  if (saved) return JSON.parse(saved);
  return [];
}

function saveCart(cart) {
  localStorage.setItem("nexgear_cart", JSON.stringify(cart));
}

function formatPrice(amount) {
  return "₹" + parseInt(amount).toLocaleString("en-IN");
}

function addToCart(id, name, brand, price, icon) {
  var cart  = loadCart();
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
      break;
    }
  }

  if (!found) {
    cart.push({
      id:    id,
      name:  name,
      brand: brand,
      price: price,
      icon:  icon || "",
      qty:   1
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast("Added to cart: " + name);
}

function removeFromCart(productId) {
  var cart    = loadCart();
  var newCart = [];

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i]);
    }
  }

  saveCart(newCart);
  renderCart();
}

function changeQty(productId, delta) {
  var cart = loadCart();

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].qty = cart[i].qty + delta;
      if (cart[i].qty < 1) cart[i].qty = 1;
      break;
    }
  }

  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  var cart     = loadCart();
  var totalQty = 0;

  for (var i = 0; i < cart.length; i++) {
    totalQty += cart[i].qty;
  }

  var badge = document.getElementById("nav-cart-count");
  if (badge) {
    badge.textContent   = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
  }
}

function updateSummary(subtotal) {
  var delivery = subtotal > 999 ? 0 : 99;
  var discount = Math.floor(subtotal * 0.05);
  var gst      = Math.floor((subtotal - discount) * 0.18);
  var total    = subtotal - discount + gst + delivery;

  var set = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("sum-subtotal", formatPrice(subtotal));
  set("sum-delivery",  delivery === 0 ? "FREE" : formatPrice(delivery));
  set("sum-discount", "-" + formatPrice(discount));
  set("sum-gst",       formatPrice(gst));
  set("sum-total",     formatPrice(total));
}

function renderCart() {
  var wrap = document.getElementById("cart-items-wrap");
  if (!wrap) return;

  var cart = loadCart();

  var countLabel = document.getElementById("cart-count-label");
  if (countLabel) {
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].qty;
    countLabel.textContent = "(" + total + " item" + (total !== 1 ? "s" : "") + ")";
  }

  if (cart.length === 0) {
    wrap.innerHTML =
      '<div style="text-align:center; padding:60px 20px; color:#6e6e73;">' +
        '<h2 style="font-size:20px; margin-bottom:10px;">Your cart is empty</h2>' +
        '<p style="margin-bottom:20px;">Add some products first.</p>' +
        '<a href="products.php" class="btn-primary" style="padding:10px 24px; border-radius:24px;">Browse Products</a>' +
      '</div>';
    updateSummary(0);
    updateCartBadge();
    return;
  }

  var html     = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item      = cart[i];
    var lineTotal = parseInt(item.price) * item.qty;
    subtotal     += lineTotal;

    html +=
      '<div class="cart-item">' +
        '<div class="cart-item-image">' + (item.icon || "") + '</div>' +
        '<div style="flex:1;">' +
          '<div class="cart-item-brand">' + (item.brand || "") + '</div>' +
          '<div class="cart-item-name">'  + item.name + '</div>' +
          '<div style="font-size:13px; color:#6e6e73;">' + formatPrice(item.price) + ' each</div>' +
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

document.addEventListener("DOMContentLoaded", function() {
  renderCart();
  updateCartBadge();
});
