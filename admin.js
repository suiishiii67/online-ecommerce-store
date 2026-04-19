var products = [];
var specRows  = [];

// ── Helper: send data to server and get response ──────────
function sendRequest(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    callback(response);
  };
  xhr.send(JSON.stringify(data));
}

// ── Load all products from the database ──────────────────
function loadProducts() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "admin.php?action=list");
  xhr.onload = function() {
    products = JSON.parse(xhr.responseText);
    renderTable("");
  };
  xhr.send();
}

// ── Show stock status label ───────────────────────────────
function getStatus(stock) {
  stock = parseInt(stock);
  if (stock == 0)  return { label: "Out of Stock", cls: "status-out" };
  if (stock < 10)  return { label: "Low Stock",    cls: "status-low" };
  return               { label: "In Stock",     cls: "status-in"  };
}

// ── Update the 3 stat boxes at the top ───────────────────
function updateStats() {
  var totalValue = 0;
  var lowCount   = 0;

  for (var i = 0; i < products.length; i++) {
    totalValue += parseFloat(products[i].price) * parseInt(products[i].stock);
    if (parseInt(products[i].stock) < 10) lowCount++;
  }

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalValue").textContent    = "₹" + totalValue.toLocaleString("en-IN");
  document.getElementById("lowStock").textContent      = lowCount;
}

// ── Render the product table (with optional search filter) ─
function renderTable(searchText) {
  var tbody    = document.getElementById("tableBody");
  var emptyMsg = document.getElementById("emptyMsg");
  var filtered = [];

  searchText = searchText.toLowerCase();

  for (var i = 0; i < products.length; i++) {
    var p    = products[i];
    var text = (p.name + " " + p.description + " " + p.category).toLowerCase();
    if (text.indexOf(searchText) !== -1) filtered.push(p);
  }

  if (filtered.length == 0) {
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
    html += "<button class='btn-edit'   onclick='openEdit(" + p.id + ")'>Edit</button> ";
    html += "<button class='btn-spec'   onclick='openSpecModal(" + p.id + ")'>Spec</button> ";
    html += "<button class='btn-delete' onclick='deleteProduct(" + p.id + ")'>Delete</button>";
    html += "</td>";
    html += "</tr>";
  }

  tbody.innerHTML = html;
  updateStats();
}

// ── Open the edit modal and fill in the product data ──────
function openEdit(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) == productId) { product = products[i]; break; }
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

// ── Delete a product ──────────────────────────────────────
function deleteProduct(productId) {
  if (!confirm("Delete this product?")) return;

  sendRequest("admin.php?action=delete", { id: productId }, function(result) {
    if (result.success) loadProducts();
    else alert("Failed to delete product.");
  });
}

// ── Save product (add or update) ──────────────────────────
document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();

  var existingId = document.getElementById("prodId").value;
  var action     = existingId ? "update" : "add";

  var data = {
    name:        document.getElementById("prodName").value.trim(),
    description: document.getElementById("prodDesc").value.trim(),
    category:    document.getElementById("prodCat").value,
    price:       parseFloat(document.getElementById("prodPrice").value),
    stock:       parseInt(document.getElementById("prodStock").value),
    image_url:   document.getElementById("prodImage").value.trim()
  };
  if (existingId) data.id = existingId;

  sendRequest("admin.php?action=" + action, data, function(result) {
    if (result.success) {
      document.getElementById("productModal").style.display = "none";
      loadProducts();
    } else {
      alert("Failed to save product.");
    }
  });
});

// ── Open/close product modal ──────────────────────────────
document.getElementById("addBtn").addEventListener("click", function() {
  document.getElementById("modalTitle").textContent = "Add Product";
  document.getElementById("productForm").reset();
  document.getElementById("prodId").value = "";
  document.getElementById("productModal").style.display = "flex";
});

document.getElementById("cancelModalBtn").addEventListener("click", function() {
  document.getElementById("productModal").style.display = "none";
});

// ── Search box ────────────────────────────────────────────
document.getElementById("searchInput").addEventListener("input", function() {
  renderTable(this.value);
});

// ── Spec Modal ────────────────────────────────────────────
function openSpecModal(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) == productId) { product = products[i]; break; }
  }

  document.getElementById("specProductId").value = productId;
  specRows = [];

  if (product && product.specs && product.specs.trim() != "") {
    var lines = product.specs.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var idx  = line.indexOf(":");
      var key  = idx != -1 ? line.substring(0, idx).trim() : line;
      var val  = idx != -1 ? line.substring(idx + 1).trim() : "";
      specRows.push({ name: key, value: val });
    }
  }

  renderSpecTable();
  document.getElementById("specModal").style.display = "flex";
}

function renderSpecTable() {
  var tbody = document.getElementById("specTableBody");
  if (specRows.length == 0) {
    tbody.innerHTML = "<tr><td colspan='3' style='text-align:center; color:#aaa; padding:12px;'>No specs yet.</td></tr>";
    return;
  }

  var html = "";
  for (var i = 0; i < specRows.length; i++) {
    html += "<tr>";
    html += "<td style='padding:8px 10px; border:1px solid #e0e0e0;'>" + specRows[i].name  + "</td>";
    html += "<td style='padding:8px 10px; border:1px solid #e0e0e0;'>" + specRows[i].value + "</td>";
    html += "<td style='padding:8px 10px; border:1px solid #e0e0e0; text-align:center;'><button onclick='removeSpec(" + i + ")' style='color:red; border:none; background:none; cursor:pointer;'>✕</button></td>";
    html += "</tr>";
  }
  tbody.innerHTML = html;
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

function removeSpec(index) {
  specRows.splice(index, 1);
  renderSpecTable();
}

function closeSpecModal() {
  document.getElementById("specModal").style.display = "none";
  specRows = [];
}

function saveSpecs() {
  var productId = document.getElementById("specProductId").value;
  var specsText = "";

  for (var i = 0; i < specRows.length; i++) {
    specsText += specRows[i].name + ": " + specRows[i].value + "\n";
  }

  sendRequest("admin.php?action=update_specs", { id: productId, specs: specsText }, function(result) {
    if (result.success) { closeSpecModal(); loadProducts(); }
    else alert("Failed to save specs.");
  });
}

// ── Start: load products when page opens ──────────────────
loadProducts();
