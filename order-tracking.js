// read orders from localStorage and show them on the page
function showOrders() {
  var orders    = JSON.parse(localStorage.getItem("nexgear_orders") || "[]");
  var container = document.getElementById("orders-container");

  if (orders.length == 0) {
    container.innerHTML =
      '<div style="text-align:center; padding:60px 20px; color:#666;">' +
      '<p style="font-size:15px; font-weight:bold; margin-bottom:8px;">No orders yet</p>' +
      '<p style="font-size:13px;">Your orders will appear here after you place one.</p>' +
      '<a href="products.php" class="btn-primary" style="display:inline-block; margin-top:18px; padding:10px 22px; border-radius:8px;">Shop Now</a>' +
      '</div>';
    return;
  }

  var html = "";

  // show latest order first
  for (var i = orders.length - 1; i >= 0; i--) {
    var order = orders[i];

    html += '<div class="order-card">';
    html += '<div class="order-header">';
    html += '<div>';
    html += '<div class="order-id">' + order.orderId + '</div>';
    html += '<div class="order-date">Ordered on: ' + order.date + '</div>';
    html += '</div>';
    html += '<span class="status-badge">Out for Delivery</span>';
    html += '</div>';

    html += '<div class="order-items">';
    for (var j = 0; j < order.items.length; j++) {
      var item = order.items[j];
      html += '<div class="order-item-row">';
      html += '<span>' + item.name + ' x' + item.qty + '</span>';
      html += '<span>₹' + (parseInt(item.price) * item.qty).toLocaleString("en-IN") + '</span>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="order-total">Total Paid: ' + order.total + ' (Cash on Delivery)</div>';
    html += '</div>';
  }

  container.innerHTML = html;
}

showOrders();
