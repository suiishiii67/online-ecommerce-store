var products = [];

/* === FETCHING PRODUCTS FROM DATABASE START === */
function loadProducts() {
  fetch('admin.php?action=list')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      products = data;
      renderTable(document.getElementById('searchInput').value);
    });
}
/* === FETCHING PRODUCTS FROM DATABASE END === */

function getStatus(stock) {
  stock = parseInt(stock);
  if (stock === 0) return { label: "Out of Stock", cls: "status-out" };
  if (stock < 10)  return { label: "Low Stock",    cls: "status-low" };
  return                  { label: "In Stock",     cls: "status-in"  };
}

function updateStats() {
  var totalVal = 0;
  var lowCount = 0;

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
    var combined = (p.name + " " + p.description + " " + p.category).toLowerCase();
    if (combined.indexOf(searchText) !== -1) filtered.push(p);
  }

  if (filtered.length === 0) {
    tbody.innerHTML        = "";
    emptyMsg.style.display = "block";
    updateStats();
    return;
  }

  emptyMsg.style.display = "none";
  var html = "";

  for (var i = 0; i < filtered.length; i++) {
    var p      = filtered[i];
    var status = getStatus(p.stock);
    html +=
      "<tr>" +
        "<td><strong>" + p.name + "</strong></td>" +
        "<td>" + (p.description || "") + "</td>" +
        "<td>" + p.category + "</td>" +
        "<td>₹" + parseFloat(p.price).toLocaleString("en-IN") + "</td>" +
        "<td>" + p.stock + "</td>" +
        "<td><span class='status-badge " + status.cls + "'>" + status.label + "</span></td>" +
        "<td>" +
          "<button class='btn-edit' onclick='openEdit(" + p.id + ")'>Edit</button>" +
          "<button class='btn-delete' onclick='deleteProduct(" + p.id + ")'>Delete</button>" +
        "</td>" +
      "</tr>";
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

/* === DELETE PRODUCT FROM DATABASE START === */
function deleteProduct(productId) {
  if (!confirm("Delete this product?")) return;

  fetch('admin.php?action=delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: productId })
  })
  .then(function(response) { return response.json(); })
  .then(function(result) {
    if (result.success) {
      loadProducts();
    } else {
      alert("Failed to delete product.");
    }
  });
}
/* === DELETE PRODUCT FROM DATABASE END === */

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

/* === SAVING PRODUCT TO DATABASE START === */
document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Prevent double submission
  var saveBtn = this.querySelector('button[type="submit"]');
  if (saveBtn.disabled) return;
  saveBtn.disabled = true;

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

  fetch('admin.php?action=' + action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(response) { return response.json(); })
  .then(function(result) {
    saveBtn.disabled = false;
    if (result.success) {
      document.getElementById("productModal").style.display = "none";
      loadProducts();
    } else {
      alert("Failed to save product.");
    }
  })
  .catch(function() {
    saveBtn.disabled = false;
    alert("Error connecting to server.");
  });
});
/* === SAVING PRODUCT TO DATABASE END === */

document.getElementById("searchInput").addEventListener("input", function() {
  renderTable(this.value);
});

/* === INITIAL LOAD FROM DATABASE START === */
loadProducts();
/* === INITIAL LOAD FROM DATABASE END === */
