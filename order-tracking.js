document.getElementById("trackBtn").addEventListener("click", function() {
  var input     = document.getElementById("trackInput");
  var resultDiv = document.getElementById("track-result");
  var orderId   = input.value.trim().toUpperCase();

  if (orderId === "") {
    resultDiv.textContent = "Please enter an order ID.";
    resultDiv.style.color = "#dc3545";
    return;
  }

  resultDiv.textContent = "Order tracking requires a backend connection.";
  resultDiv.style.color = "#6e6e73";
});

document.getElementById("trackInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    document.getElementById("trackBtn").click();
  }
});
