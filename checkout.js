// Step 1: Show cart items and calculate totals in the order summary
function loadOrderSummary() {
  var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");
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
  var gst      = Math.floor((subtotal - discount) * 0.18);
  var total    = subtotal - discount + gst;

  document.getElementById("co-subtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
  document.getElementById("co-discount").textContent = "-₹" + discount.toLocaleString("en-IN");
  document.getElementById("co-gst").textContent      = "₹" + gst.toLocaleString("en-IN");
  document.getElementById("co-total").textContent    = "₹" + total.toLocaleString("en-IN");
  document.getElementById("placeOrderBtn").textContent = "Place Order";
}

// Step 2: Validate form, fill hidden inputs, then submit to PHP
document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");
  if (cart.length == 0) { alert("Your cart is empty!"); return; }

  if (document.getElementById("fname").value.trim() == "")  { alert("Please enter your first name."); return; }
  if (document.getElementById("lname").value.trim() == "")  { alert("Please enter your last name."); return; }
  if (document.getElementById("phone").value.trim() == "")  { alert("Please enter your phone number."); return; }
  if (document.getElementById("addr").value.trim() == "")   { alert("Please enter your address."); return; }
  if (document.getElementById("city").value.trim() == "")   { alert("Please enter your city."); return; }

  var pin = document.getElementById("pincode").value.trim();
  if (pin == "" || pin.length != 6) { alert("Please enter a valid 6-digit PIN code."); return; }

  // get total number from the page
  var totalText = document.getElementById("co-total").textContent;
  var total = totalText.replace("₹", "").replace(/,/g, "");

  // pass cart and total to PHP via hidden inputs
  document.getElementById("cart_items_input").value = JSON.stringify(cart);
  document.getElementById("grand_total_input").value = total;

  // save order to localStorage for order-tracking page
  var orders = JSON.parse(localStorage.getItem("nexgear_orders") || "[]");
  var now     = new Date();
  var date    = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  var time    = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  var orderNum = "NGR-2025-" + Math.floor(1000 + Math.random() * 9000);

  orders.push({ orderId: orderNum, date: date + " " + time, items: cart, total: "₹" + total });
  localStorage.setItem("nexgear_orders", JSON.stringify(orders));
  localStorage.removeItem("nexgear_cart");

  this.submit();
});

// Run on page load
loadOrderSummary();
