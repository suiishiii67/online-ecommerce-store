var products = [];
var specRows  = [];

function loadProducts() {
  fetch('admin.php?action=list')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      products = data;
      renderTable(document.getElementById('searchInput').value);
    });
}

function getStatus(stock) {
  stock = parseInt(stock);
  if (stock === 0) return { label: "Out of Stock", cls: "status-out" };
  if (stock < 10)  return { label: "Low Stock",    cls: "status-low" };
  return               { label: "In Stock",     cls: "status-in"  };
}

function updateStats() {
  var totalVal = 0, lowCount = 0;
  for (var i = 0; i < products.length; i++) {
    totalVal += parseFloat(products[i].price) * parseInt(products[i].stock);
    if (parseInt(products[i].stock) < 10) lowCount++;
  }
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalValue").textContent    = "₹" + totalVal.toLocaleString("en-IN");
  document.getElementById("lowStock").textContent      = lowCount;
}

function renderTable(searchText) {
  var tbody    = document.getElementById("tableBody");
  var emptyMsg = document.getElementById("emptyMsg");
  var filtered = [];

  searchText = searchText ? searchText.toLowerCase() : "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var text = (p.name + " " + p.description + " " + p.category).toLowerCase();
    if (text.indexOf(searchText) !== -1) filtered.push(p);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyMsg.style.display = "block";
    updateStats();
    return;
  }

  emptyMsg.style.display = "none";
  var html = "";

  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    var s = getStatus(p.stock);
    html += "<tr>";
    html += "<td><strong>" + p.name + "</strong></td>";
    html += "<td>" + (p.description || "") + "</td>";
    html += "<td>" + p.category + "</td>";
    html += "<td>₹" + parseFloat(p.price).toLocaleString("en-IN") + "</td>";
    html += "<td>" + p.stock + "</td>";
    html += "<td><span class='status-badge " + s.cls + "'>" + s.label + "</span></td>";
    html += "<td>";
    html += "<button class='btn-edit' onclick='openEdit(" + p.id + ")'>Edit</button> ";
    html += "<button class='btn-spec' onclick='openSpecModal(" + p.id + ")' style='padding:5px 12px; border:1px solid #0071e3; border-radius:6px; font-size:12px; color:#0071e3; background:#fff; cursor:pointer;'>Spec</button> ";
    html += "<button class='btn-delete' onclick='deleteProduct(" + p.id + ")'>Delete</button>";
    html += "</td>";
    html += "</tr>";
  }

  tbody.innerHTML = html;
  updateStats();
}

function openEdit(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) === productId) { product = products[i]; break; }
  }
  if (!product) return;

  document.getElementById("modalTitle").textContent = "Edit Product";
  document.getElementById("prodId").value           = product.id;
  document.getElementById("prodName").value         = product.name;
  document.getElementById("prodDesc").value         = product.description || "";
  document.getElementById("prodCat").value          = product.category;
  document.getElementById("prodPrice").value        = product.price;
  document.getElementById("prodStock").value        = product.stock;
  document.getElementById("prodImage").value        = product.image_url || "";
  document.getElementById("productModal").style.display = "flex";
}

function deleteProduct(productId) {
  if (!confirm("Delete this product?")) return;

  fetch('admin.php?action=delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: productId })
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    if (result.success) loadProducts();
    else alert("Failed to delete product.");
  });
}

// ── Spec Modal ────────────────────────────────────────────
function openSpecModal(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) === productId) { product = products[i]; break; }
  }
  document.getElementById("specProductId").value = productId;
  specRows = [];
  if (product && product.specs && product.specs.trim() !== "") {
    var lines = product.specs.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var idx  = line.indexOf(":");
      var key  = idx !== -1 ? line.substring(0, idx).trim() : line;
      var val  = idx !== -1 ? line.substring(idx + 1).trim() : "";
      specRows.push({ name: key, value: val });
    }
  }
  renderSpecTable();
  document.getElementById("specModal").style.display = "flex";
}

function renderSpecTable() {
  var tbody = document.getElementById("specTableBody");
  if (specRows.length === 0) {
    tbody.innerHTML = "<tr><td colspan='3' style='text-align:center;color:#aaa;font-size:13px;padding:12px;'>No specs yet. Add one below.</td></tr>";
    return;
  }
  var html = "";
  for (var i = 0; i < specRows.length; i++) {
    html += "<tr>";
    html += "<td style='padding:8px 10px; border:1px solid #e0e0e0;'>" + specRows[i].name + "</td>";
    html += "<td style='padding:8px 10px; border:1px solid #e0e0e0;'>" + specRows[i].value + "</td>";
    html += "<td style='padding:8px 10px; border:1px solid #e0e0e0; text-align:center;'><button onclick='removeSpec(" + i + ")' style='color:red; border:none; background:transparent; cursor:pointer; font-size:15px;'>✕</button></td>";
    html += "</tr>";
  }
  tbody.innerHTML = html;
}

function removeSpec(index) {
  specRows.splice(index, 1);
  renderSpecTable();
}

function addSpecRow() {
  var name  = document.getElementById("newSpecName").value.trim();
  var value = document.getElementById("newSpecValue").value.trim();
  if (!name || !value) { alert("Please fill both Spec Name and Value."); return; }
  specRows.push({ name: name, value: value });
  document.getElementById("newSpecName").value  = "";
  document.getElementById("newSpecValue").value = "";
  renderSpecTable();
}

function closeSpecModal() {
  document.getElementById("specModal").style.display = "none";
  specRows = [];
}

function saveSpecs() {
  var productId = document.getElementById("specProductId").value;
  var specsText = specRows.map(function(r) { return r.name + ": " + r.value; }).join("\n");

  var saveBtn = document.getElementById("saveSpecBtn");
  saveBtn.disabled = true;

  fetch("admin.php?action=update_specs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: productId, specs: specsText })
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    saveBtn.disabled = false;
    if (result.success) { closeSpecModal(); loadProducts(); }
    else alert("Failed to save specs.");
  })
  .catch(function() {
    saveBtn.disabled = false;
    alert("Error connecting to server.");
  });
}
// ──────────────────────────────────────────────────────────

document.getElementById("addBtn").addEventListener("click", function() {
  document.getElementById("modalTitle").textContent = "Add Product";
  document.getElementById("productForm").reset();
  document.getElementById("prodId").value = "";
  document.getElementById("productModal").style.display = "flex";
});

document.getElementById("cancelModalBtn").addEventListener("click", function() {
  document.getElementById("productModal").style.display = "none";
});

document.getElementById("productModal").addEventListener("click", function(e) {
  if (e.target === this) this.style.display = "none";
});

document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var saveBtn = this.querySelector('button[type="submit"]');
  if (saveBtn.disabled) return;
  saveBtn.disabled = true;

  var existingId = document.getElementById("prodId").value;
  var data = {
    name:        document.getElementById("prodName").value.trim(),
    description: document.getElementById("prodDesc").value.trim(),
    category:    document.getElementById("prodCat").value,
    price:       parseFloat(document.getElementById("prodPrice").value),
    stock:       parseInt(document.getElementById("prodStock").value),
    image_url:   document.getElementById("prodImage").value.trim()
  };
  if (existingId) data.id = existingId;

  fetch('admin.php?action=' + (existingId ? "update" : "add"), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    saveBtn.disabled = false;
    if (result.success) { document.getElementById("productModal").style.display = "none"; loadProducts(); }
    else alert("Failed to save product.");
  })
  .catch(function() {
    saveBtn.disabled = false;
    alert("Error connecting to server.");
  });
});

document.getElementById("searchInput").addEventListener("input", function() {
  renderTable(this.value);
});

loadProducts();
