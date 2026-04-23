function getCart() {
  var data = localStorage.getItem("nexgear_cart");
  if (data == null) return [];
  return JSON.parse(data);
}
function saveCart(cart) {
  localStorage.setItem("nexgear_cart", JSON.stringify(cart));
}
function addToCart(id, name, brand, price, icon) {
  var cart = getCart();
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
      break;
    }
  }
  if (found == false) {
    cart.push({ id: id, name: name, brand: brand, price: price, icon: icon, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert(name + " added to cart!");
}
function removeFromCart(productId) {
  var cart = getCart();
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id != productId) newCart.push(cart[i]);
  }
  saveCart(newCart);
  showCart();
}
function changeQty(productId, change) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == productId) {
      cart[i].qty = cart[i].qty + change;
      if (cart[i].qty < 1) cart[i].qty = 1;
      break;
    }
  }
  saveCart(cart);
  showCart();
}
function updateCartCount() {
  var cart = getCart();
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].qty;
  }
  var badge = document.getElementById("nav-cart-count");
  if (badge != null) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
  }
}
function updateTotal(subtotal) {
  var delivery = subtotal < 999 ? 99 : 0;
  var discount = Math.floor(subtotal * 0.05);
  var gst = Math.floor((subtotal - discount) * 0.18);
  var total = subtotal - discount + gst + delivery;
  var s = document.getElementById("sum-subtotal");
  var d = document.getElementById("sum-delivery");
  var dis = document.getElementById("sum-discount");
  var g = document.getElementById("sum-gst");
  var t = document.getElementById("sum-total");
  if (s) s.textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (d) d.textContent = delivery == 0 ? "FREE" : "₹" + delivery;
  if (dis) dis.textContent = "-₹" + discount.toLocaleString("en-IN");
  if (g) g.textContent = "₹" + gst.toLocaleString("en-IN");
  if (t) t.textContent = "₹" + total.toLocaleString("en-IN");
}
function showCart() {
  var wrap = document.getElementById("cart-items-wrap");
  if (wrap == null) return;
  var cart = getCart();
  var totalQty = 0;
  for (var i = 0; i < cart.length; i++) totalQty += cart[i].qty;
  var label = document.getElementById("cart-count-label");
  if (label) label.textContent = "(" + totalQty + " items)";
  if (cart.length == 0) {
    wrap.innerHTML =
      '<div style="text-align:center; padding:60px 20px;">' +
      '<h2 style="font-size:20px; margin-bottom:10px;">Your cart is empty</h2>' +
      '<p style="margin-bottom:20px;">Add some products first.</p>' +
      '<a href="products.php" class="btn-primary" style="padding:10px 24px; border-radius:24px;">Browse Products</a>' +
      '</div>';
    updateTotal(0);
    updateCartCount();
    return;
  }
  var html = "";
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var lineTotal = parseInt(item.price) * item.qty;
    subtotal += lineTotal;
    html += '<div class="cart-item">';
    html += '<div style="flex:1;">';
    html += '<div class="cart-item-brand">' + item.brand + '</div>';
    html += '<div class="cart-item-name">' + item.name + '</div>';
    html += '<div style="font-size:13px; color:#888;">₹' + parseInt(item.price).toLocaleString("en-IN") + ' each</div>';
    html += '<div class="qty-control">';
    html += '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">-</button>';
    html += '<span class="qty-value">' + item.qty + '</span>';
    html += '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>';
    html += '</div>';
    html += '<button class="btn-remove" onclick="removeFromCart(\'' + item.id + '\')">Remove</button>';
    html += '</div>';
    html += '<div style="font-size:16px; font-weight:bold;">₹' + lineTotal.toLocaleString("en-IN") + '</div>';
    html += '</div>';
  }
  wrap.innerHTML = html;
  updateTotal(subtotal);
  updateCartCount();
}
window.onload = function() {
  showCart();
  updateCartCount();
};
