/**
 * order-tracking.js — NexGear Order Tracking
 * ─────────────────────────────────────────────
 * Handles:
 *  1. "Track Order" button → looks up order ID in a demo list
 *  2. Highlights the matching order card if found
 *  3. Shows an error message if not found
 *  4. Cancel Order button → asks for confirmation, then removes the card
 *  5. Download Invoice button → shows a simple printable invoice
 */

// ── 1. DEMO ORDER DATABASE ────────────────────────────────────────────────────
// In real life this would come from a backend API
var DEMO_ORDERS = {
  "NGR-2025-0891": { status: "delivered", card: 0 },
  "NGR-2025-1042": { status: "transit",   card: 1 }
};

// ── 2. TRACK ORDER BY ID ──────────────────────────────────────────────────────

function trackOrder() {
  var input    = document.querySelector(".track-inputs input");
  var resultEl = document.getElementById("track-result-msg");

  if (!input) return;

  var orderId = input.value.trim().toUpperCase();

  // Make sure there's a result message element; create one if not
  if (!resultEl) {
    resultEl = document.createElement("div");
    resultEl.id = "track-result-msg";
    resultEl.style.cssText = "margin-top:12px; padding:14px 18px; border-radius:12px; font-size:14px; font-weight:500;";
    document.querySelector(".track-form").appendChild(resultEl);
  }

  if (orderId === "") {
    showTrackMessage(resultEl, "⚠️ Please enter an Order ID.", "warning");
    return;
  }

  var found = DEMO_ORDERS[orderId];

  if (found) {
    showTrackMessage(resultEl, "✅ Order " + orderId + " found! Highlighted below.", "success");
    // Scroll to and highlight the matching order card
    var cards = document.querySelectorAll(".order-card");
    if (cards[found.card]) {
      cards[found.card].scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a brief highlight outline
      cards[found.card].style.outline = "3px solid #0071e3";
      setTimeout(function() {
        cards[found.card].style.outline = "";
      }, 3000);
    }
  } else {
    showTrackMessage(resultEl, "No order found with ID \"" + orderId + "\". Please check and try again.", "error");
  }
}

function showTrackMessage(el, message, type) {
  el.textContent = message;
  var colors = {
    success: { bg: "rgba(48,209,88,0.1)",   border: "rgba(48,209,88,0.3)",   text: "#1a7f3c" },
    error:   { bg: "rgba(255,59,48,0.08)",  border: "rgba(255,59,48,0.25)",  text: "#c0392b" },
    warning: { bg: "rgba(255,159,10,0.1)",  border: "rgba(255,159,10,0.3)",  text: "#8a5700" }
  };
  var c = colors[type] || colors.warning;
  el.style.background   = c.bg;
  el.style.border       = "1px solid " + c.border;
  el.style.color        = c.text;
  el.style.display      = "block";
}

// ── 3. CANCEL ORDER ───────────────────────────────────────────────────────────

function initCancelButtons() {
  var cancelBtns = document.querySelectorAll(".btn-secondary");
  cancelBtns.forEach(function(btn) {
    if (btn.textContent.trim() !== "Cancel Order") return;

    btn.addEventListener("click", function() {
      var confirmed = confirm("Are you sure you want to cancel this order?\nThis action cannot be undone.");
      if (confirmed) {
        // Find the parent order card and remove it
        var card = btn.closest(".order-card");
        if (card) {
          card.style.opacity = "0";
          card.style.transition = "opacity 0.4s";
          setTimeout(function() { card.remove(); }, 400);
        }
        if (typeof showToast === "function") {
          showToast("🗑️ Order cancelled successfully.");
        }
      }
    });
  });
}

// ── 4. DOWNLOAD INVOICE ───────────────────────────────────────────────────────

function initInvoiceButtons() {
  var invoiceBtns = document.querySelectorAll(".btn-secondary");
  invoiceBtns.forEach(function(btn) {
    if (btn.textContent.trim() !== "Download Invoice") return;

    btn.addEventListener("click", function() {
      var card = btn.closest(".order-card");
      var orderId   = card ? card.querySelector(".order-id").textContent   : "N/A";
      var orderDate = card ? card.querySelector(".order-date").textContent  : "N/A";
      var total     = card ? card.querySelector(".order-total strong").textContent : "N/A";

      // Open a new window with a printable invoice
      var win = window.open("", "_blank");
      win.document.write([
        '<html><head><title>Invoice — ' + orderId + '</title>',
        '<style>body{font-family:Arial,sans-serif;padding:40px;color:#1d1d1f;} h1{font-size:28px; margin-bottom:4px;} .meta{color:#6e6e73; font-size:14px; margin-bottom:32px;} table{width:100%; border-collapse:collapse; margin-bottom:24px;} th,td{border:1px solid #e5e5ea; padding:10px 14px; text-align:left;} th{background:#f5f5f7;} .total-row{font-weight:700; font-size:16px;}</style>',
        '</head><body>',
        '<h1>NexGear Tax Invoice</h1>',
        '<div class="meta">' + orderId + ' · ' + orderDate + '</div>',
        '<table>',
        '  <thead><tr><th>Item</th><th>Brand</th><th>Qty</th><th>Amount</th></tr></thead>',
        '  <tbody>',
        '    <tr><td>Arctis Nova Pro Wireless</td><td>SteelSeries</td><td>1</td><td>₹24,999</td></tr>',
        '    <tr><td>Q3 Pro Wireless QMK</td><td>Keychron</td><td>1</td><td>₹14,999</td></tr>',
        '    <tr><td>G Pro X Superlight 2</td><td>Logitech</td><td>1</td><td>₹13,495</td></tr>',
        '  </tbody>',
        '</table>',
        '<p class="total-row">Total Paid: ' + total + '</p>',
        '<p style="color:#6e6e73; font-size:13px; margin-top:32px;">Thank you for shopping with NexGear. For support: support@nexgear.in</p>',
        '<script>window.print();<\/script>',
        '</body></html>'
      ].join(""));
      win.document.close();
    });
  });
}

// ── 5. INIT ───────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  // Wire up the Track button
  var trackBtn = document.querySelector(".track-inputs .btn-primary");
  if (trackBtn) {
    trackBtn.addEventListener("click", trackOrder);
  }

  // Also track when Enter is pressed in the input
  var trackInput = document.querySelector(".track-inputs input");
  if (trackInput) {
    trackInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") trackOrder();
    });
  }

  initCancelButtons();
  initInvoiceButtons();
});
