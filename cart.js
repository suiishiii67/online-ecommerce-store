function loadCart() {
  var data = localStorage.getItem("nexgear_cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem("nexgear_cart", JSON.stringify(cart));
}

function formatPrice(n) {
  return "₹" + parseInt(n).toLocaleString("en-IN");
}

function addToCart(id, name, brand, price, icon) {
  var cart = loadCart();
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty++;
      found = true;
      break;
    }
  }

  if (!found) {
    cart.push({ id: id, name: name, brand: brand, price: price, icon: icon || "", qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  showToast("Added to cart: " + name);
}

function removeFromCart(productId) {
  var cart = loadCart();
  var updated = [];

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) updated.push(cart[i]);
  }

  saveCart(updated);
  renderCart();
}

function changeQty(productId, delta) {
  var cart = loadCart();

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].qty += delta;
      if (cart[i].qty < 1) cart[i].qty = 1;
      break;
    }
  }

  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  var cart = loadCart();
  var count = 0;
  for (var i = 0; i < cart.length; i++) count += cart[i].qty;

  var badge = document.getElementById("nav-cart-count");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function updateSummary(subtotal) {
  var delivery = subtotal > 999 ? 0 : 99;
  var discount = Math.floor(subtotal * 0.05);
  var gst = Math.floor((subtotal - discount) * 0.18);
  var total = subtotal - discount + gst + delivery;

  var s = document.getElementById("sum-subtotal");
  var d = document.getElementById("sum-delivery");
  var dis = document.getElementById("sum-discount");
  var g = document.getElementById("sum-gst");
  var t = document.getElementById("sum-total");

  if (s) s.textContent = formatPrice(subtotal);
  if (d) d.textContent = delivery === 0 ? "FREE" : formatPrice(delivery);
  if (dis) dis.textContent = "-" + formatPrice(discount);
  if (g) g.textContent = formatPrice(gst);
  if (t) t.textContent = formatPrice(total);
}

function renderCart() {
  var wrap = document.getElementById("cart-items-wrap");
  if (!wrap) return;

  var cart = loadCart();
  var totalQty = 0;
  for (var i = 0; i < cart.length; i++) totalQty += cart[i].qty;

  var label = document.getElementById("cart-count-label");
  if (label) label.textContent = "(" + totalQty + " item" + (totalQty !== 1 ? "s" : "") + ")";

  if (cart.length === 0) {
    wrap.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#6e6e73;">' +
      '<h2 style="font-size:20px; margin-bottom:10px;">Your cart is empty</h2>' +
      '<p style="margin-bottom:20px;">Add some products first.</p>' +
      '<a href="products.php" class="btn-primary" style="padding:10px 24px; border-radius:24px;">Browse Products</a></div>';
    updateSummary(0);
    updateCartBadge();
    return;
  }

  var html = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var lineTotal = parseInt(item.price) * item.qty;
    subtotal += lineTotal;

    html += '<div class="cart-item">';
    html += '<div class="cart-item-image">' + (item.icon || "") + '</div>';
    html += '<div style="flex:1;">';
    html += '<div class="cart-item-brand">' + (item.brand || "") + '</div>';
    html += '<div class="cart-item-name">' + item.name + '</div>';
    html += '<div style="font-size:13px; color:#6e6e73;">' + formatPrice(item.price) + ' each</div>';
    html += '<div class="qty-control">';
    html += '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">-</button>';
    html += '<span class="qty-value">' + item.qty + '</span>';
    html += '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>';
    html += '</div>';
    html += '<button class="btn-remove" onclick="removeFromCart(\'' + item.id + '\')">Remove</button>';
    html += '</div>';
    html += '<div style="font-size:16px; font-weight:700;">' + formatPrice(lineTotal) + '</div>';
    html += '</div>';
  }

  wrap.innerHTML = html;
  updateSummary(subtotal);
  updateCartBadge();
}

document.addEventListener("DOMContentLoaded", function() {
  renderCart();
  updateCartBadge();
});
