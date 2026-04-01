

function initPaymentMethods() {
  var methods  = document.querySelectorAll(".payment-method");
  var cardForm = document.querySelector(".card-form");

  // Additional payment forms (UPI, Net Banking, COD) – we'll create them dynamically
  var upiForm = document.getElementById("upi-form");
  var codNote = document.getElementById("cod-note");

  methods.forEach(function(label) {
    label.addEventListener("click", function() {
      // Remove active from all labels
      methods.forEach(function(m) { m.classList.remove("active"); });
      label.classList.add("active");

      var radio = label.querySelector("input[type='radio']");
      var value = radio ? radio.value : "";

      // Show/hide the correct sub-form
      if (cardForm) cardForm.style.display = (value === "card") ? "block" : "none";
      if (upiForm)  upiForm.style.display  = (value === "upi")  ? "block" : "none";
      if (codNote)  codNote.style.display  = (value === "cod")  ? "block" : "none";
    });
  });

  // Assign values to radio inputs (so we can read them above)
  var radios = document.querySelectorAll(".payment-method input[type='radio']");
  var values = ["card", "upi", "netbanking", "cod"];
  radios.forEach(function(r, i) {
    r.value = values[i] || "card";
  });
}

// ── 2. CARD NUMBER FORMATTING ────────────────────────────────────────────────
// Converts "1234567890123456" → "1234 5678 9012 3456" as the user types

function initCardFormatting() {
  var cardInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
  if (!cardInput) return;

  cardInput.addEventListener("input", function() {
    // Remove all non-digits
    var digits = cardInput.value.replace(/\D/g, "");
    // Insert a space every 4 characters
    var formatted = digits.match(/.{1,4}/g);
    cardInput.value = formatted ? formatted.join(" ") : "";
  });
}

// ── 3. EXPIRY DATE FORMATTING ─────────────────────────────────────────────────
// Auto-inserts " / " after month is entered: "12" → "12 / "

function initExpiryFormatting() {
  var expiryInput = document.querySelector('input[placeholder="MM / YY"]');
  if (!expiryInput) return;

  expiryInput.addEventListener("input", function() {
    var val = expiryInput.value.replace(/\D/g, ""); // digits only
    if (val.length >= 2) {
      // Insert separator after 2nd digit
      val = val.slice(0, 2) + " / " + val.slice(2, 4);
    }
    expiryInput.value = val;
  });
}

// ── 4. PLACE ORDER BUTTON → SUCCESS ──────────────────────────────────────────

function initPlaceOrderButton() {
  var btn = document.querySelector(".btn-place-order");
  if (!btn) return;

  btn.addEventListener("click", function() {
    // Simple validation: check that required fields are not empty
    var requiredInputs = document.querySelectorAll(".checkout-forms input[type='text'], .checkout-forms input[type='tel']");
    var allFilled = true;
    requiredInputs.forEach(function(input) {
      if (input.value.trim() === "") allFilled = false;
    });

    if (!allFilled) {
      if (typeof showToast === "function") {
        showToast("⚠️ Please fill in all delivery details!");
      } else {
        alert("Please fill in all delivery details!");
      }
      return;
    }

    // Show success modal
    showOrderSuccessModal();
  });
}

function showOrderSuccessModal() {
  // Generate a random order number
  var orderNum = "NGR-2025-" + Math.floor(1000 + Math.random() * 9000);

  // Create a full-screen overlay
  var overlay = document.createElement("div");
  overlay.id = "order-success-overlay";
  overlay.style.cssText = [
    "position: fixed",
    "top: 0", "left: 0",
    "width: 100%", "height: 100%",
    "background: rgba(0,0,0,0.6)",
    "display: flex",
    "align-items: center",
    "justify-content: center",
    "z-index: 9999"
  ].join(";");

  overlay.innerHTML = [
    '<div style="background:#fff; border-radius:20px; padding:48px 40px; max-width:440px; width:90%; text-align:center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">',
    '  <div style="font-size:64px; margin-bottom:16px;">🎉</div>',
    '  <h2 style="font-size:24px; font-weight:700; margin-bottom:8px; color:#1d1d1f;">Order Placed!</h2>',
    '  <p style="color:#6e6e73; font-size:15px; margin-bottom:20px;">Your order has been confirmed and will be delivered in 3-5 business days.</p>',
    '  <div style="background:#f5f5f7; border-radius:12px; padding:14px 20px; margin-bottom:28px; font-size:14px; color:#1d1d1f;">',
    '    Order ID: <strong>' + orderNum + '</strong>',
    '  </div>',
    '  <a href="order-tracking.html" style="display:inline-block; background:#0071e3; color:#fff; padding:14px 32px; border-radius:32px; font-size:15px; font-weight:600; text-decoration:none; margin-right:12px;">Track Order</a>',
    '  <a href="home.html" style="display:inline-block; background:#f5f5f7; color:#1d1d1f; padding:14px 32px; border-radius:32px; font-size:15px; font-weight:600; text-decoration:none;">Back to Home</a>',
    '</div>'
  ].join("");

  document.body.appendChild(overlay);

  // Clear the cart after placing an order
  localStorage.removeItem("nexgear_cart");

  // Close overlay when clicking outside the card
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ── 5. POPULATE ORDER SUMMARY FROM CART ──────────────────────────────────────

function populateCheckoutSummary() {
  // The checkout page has static demo items, so we just update totals
  // In a real app you'd read from localStorage cart here
  var cart = JSON.parse(localStorage.getItem("nexgear_cart") || "[]");
  if (cart.length === 0) return; // keep the static demo if cart is empty

  var PRODUCTS = {
    "arctis-nova-pro": { name: "Arctis Nova Pro Wireless", brand: "SteelSeries", price: 24999, icon: "🎧" },
    "lg-ultragear":    { name: "UltraGear 27GP850-B",      brand: "LG",          price: 32499, icon: "🖥️" },
    "keychron-q3":     { name: "Q3 Pro Wireless QMK",      brand: "Keychron",    price: 14999, icon: "⌨️" },
    "logitech-super2": { name: "G Pro X Superlight 2",     brand: "Logitech",    price: 13495, icon: "🖱️" },
    "secretlab-titan": { name: "TITAN Evo XL Series",      brand: "SecretLab",   price: 42999, icon: "🪑" },
    "hyperx-quadcast": { name: "QuadCast S USB Mic",       brand: "HyperX",      price: 11999, icon: "🎤" }
  };

  var itemsContainer = document.querySelector(".checkout-items");
  if (!itemsContainer) return;

  var subtotal = 0;
  var html = cart.map(item => {
    var p = PRODUCTS[item.id];
    if (!p) return "";
    var line = p.price * item.qty;
    subtotal += line;
    return `
      <div class="checkout-item">
        <div class="checkout-item-img">${p.icon}</div>
        <div class="checkout-item-info">
          <div class="checkout-item-name">${p.name}</div>
          <div class="checkout-item-brand">${p.brand} · Qty: ${item.qty}</div>
        </div>
        <div class="checkout-item-price">₹${line.toLocaleString("en-IN")}</div>
      </div>`;
  }).join("");

  itemsContainer.innerHTML = html;

  // Recalculate totals
  var discount = Math.floor(subtotal * 0.05);
  var gst      = Math.floor((subtotal - discount) * 0.18);
  var total    = subtotal - discount + gst;

  var rows = document.querySelectorAll(".checkout-summary .summary-row span:last-child");
  if (rows[0]) rows[0].textContent = "₹" + subtotal.toLocaleString("en-IN");
  if (rows[1]) rows[1].textContent = "FREE";
  if (rows[2]) rows[2].textContent = "−₹" + discount.toLocaleString("en-IN");
  if (rows[3]) rows[3].textContent = "₹" + gst.toLocaleString("en-IN");

  var totalEl = document.querySelector(".checkout-summary .summary-total span:last-child");
  if (totalEl) totalEl.textContent = "₹" + total.toLocaleString("en-IN");

  var placeBtn = document.querySelector(".btn-place-order");
  if (placeBtn) placeBtn.textContent = "Place Order & Pay ₹" + total.toLocaleString("en-IN");
}

// ── 6. INIT ───────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  initPaymentMethods();
  initCardFormatting();
  initExpiryFormatting();
  initPlaceOrderButton();
  populateCheckoutSummary();
});
