// get cart items from browser storage
function getCart() {
  var data = localStorage.getItem("nexgear_cart");
  if (data == null) {
    return [];
  }
  return JSON.parse(data);
}

// save cart items to browser storage
function saveCart(cart) {
  localStorage.setItem("nexgear_cart", JSON.stringify(cart));
}

// add a product to cart (called when user clicks Add to Cart button)
function addToCart(id, name, brand, price, icon) {
  var cart = getCart();
  var found = false;

  // check if this product is already in the cart
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
      break;
    }
  }

  // if not found, add it as a new item
  if (found == false) {
    var newItem = {
      id: id,
      name: name,
      brand: brand,
      price: price,
      icon: icon,
      qty: 1
    };
    cart.push(newItem);
  }

  saveCart(cart);
  updateCartCount();
  alert(name + " added to cart!");
}

// remove a product from cart by its id
function removeFromCart(productId) {
  var cart = getCart();
  var newCart = [];

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id != productId) {
      newCart.push(cart[i]);
    }
  }

  saveCart(newCart);
  showCart();
}

// increase or decrease the quantity of a product in cart
function changeQty(productId, change) {
  var cart = getCart();

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == productId) {
      cart[i].qty = cart[i].qty + change;
      if (cart[i].qty < 1) {
        cart[i].qty = 1;
      }
      break;
    }
  }

  saveCart(cart);
  showCart();
}

// update the cart count number shown in the navbar
function updateCartCount() {
  var cart = getCart();
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].qty;
  }

  var badge = document.getElementById("nav-cart-count");
  if (badge != null) {
    badge.textContent = total;
    if (total > 0) {
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }
}

// calculate and display price totals in cart summary
function updateTotal(subtotal) {
  var delivery = 0;
  if (subtotal < 999) {
    delivery = 99;
  }
  var discount = Math.floor(subtotal * 0.05);
  var gst = Math.floor((subtotal - discount) * 0.18);
  var total = subtotal - discount + gst + delivery;

  var s = document.getElementById("sum-subtotal");
  var d = document.getElementById("sum-delivery");
  var dis = document.getElementById("sum-discount");
  var g = document.getElementById("sum-gst");
  var t = document.getElementById("sum-total");

  if (s != null) s.textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (d != null) d.textContent = delivery == 0 ? "FREE" : "₹" + delivery;
  if (dis != null) dis.textContent = "-₹" + discount.toLocaleString("en-IN");
  if (g != null) g.textContent = "₹" + gst.toLocaleString("en-IN");
  if (t != null) t.textContent = "₹" + total.toLocaleString("en-IN");
}

// show all cart items on the cart page
function showCart() {
  var wrap = document.getElementById("cart-items-wrap");
  if (wrap == null) return;

  var cart = getCart();

  // count total items
  var totalQty = 0;
  for (var i = 0; i < cart.length; i++) {
    totalQty = totalQty + cart[i].qty;
  }

  var label = document.getElementById("cart-count-label");
  if (label != null) {
    label.textContent = "(" + totalQty + " items)";
  }

  // if cart is empty, show empty message
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

  // build the cart items HTML
  var html = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var lineTotal = parseInt(item.price) * item.qty;
    subtotal = subtotal + lineTotal;

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

// run when the page loads
window.onload = function() {
  showCart();
  updateCartCount();
};
