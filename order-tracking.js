// order-tracking.js
// TODO: Connect trackBtn to backend to fetch real order by ID

document.getElementById("trackBtn").addEventListener("click", function() {
  var input     = document.getElementById("trackInput");
  var resultDiv = document.getElementById("track-result");
  var orderId   = input.value.trim().toUpperCase();

  if (orderId === "") {
    resultDiv.textContent = "Please enter an order ID.";
    resultDiv.style.color = "#dc3545";
    return;
  }

  // TODO: Replace this with a real backend call, e.g.:
  // fetch("server.php?action=track&order_id=" + orderId)
  //   .then(function(res) { return res.json(); })
  //   .then(function(data) { /* show order */ });

  resultDiv.textContent = "Order tracking requires a backend connection.";
  resultDiv.style.color = "#6e6e73";
});

document.getElementById("trackInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    document.getElementById("trackBtn").click();
  }
});
