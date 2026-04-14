// admin.js
// Product inventory management
// TODO: Connect to backend to load and save real product data

var products = []; // will be filled from backend

function saveProducts() {
  // TODO: Send updated products to backend
  // fetch("server.php?action=saveProducts", {
  //   method: "POST",
  //   body: JSON.stringify(products)
  // });
  localStorage.setItem("admin_products", JSON.stringify(products));
}

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
    totalVal += parseInt(products[i].p) * parseInt(products[i].stock);
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
    var combined = (p.n + " " + p.b + " " + p.c).toLowerCase();
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
        "<td><strong>" + (p.icon || "") + " " + p.n + "</strong></td>" +
        "<td>" + p.b + "</td>" +
        "<td>" + p.c + "</td>" +
        "<td>₹" + parseInt(p.p).toLocaleString("en-IN") + "</td>" +
        "<td>" + p.stock + "</td>" +
        "<td><span class='status-badge " + status.cls + "'>" + status.label + "</span></td>" +
        "<td>" +
          "<button class='btn-edit' onclick='openEdit(\"" + p.id + "\")'>Edit</button>" +
          "<button class='btn-delete' onclick='deleteProduct(\"" + p.id + "\")'>Delete</button>" +
        "</td>" +
      "</tr>";
  }

  tbody.innerHTML = html;
  updateStats();
}

function openEdit(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) { product = products[i]; break; }
  }
  if (!product) return;

  document.getElementById("modalTitle").textContent = "Edit Product";
  document.getElementById("prodId").value           = product.id;
  document.getElementById("prodName").value         = product.n;
  document.getElementById("prodBrand").value        = product.b;
  document.getElementById("prodCat").value          = product.c;
  document.getElementById("prodPrice").value        = product.p;
  document.getElementById("prodStock").value        = product.stock;
  document.getElementById("prodIcon").value         = product.icon || "";

  document.getElementById("productModal").style.display = "flex";
}

function deleteProduct(productId) {
  if (!confirm("Delete this product?")) return;

  var newList = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].id !== productId) newList.push(products[i]);
  }
  products = newList;
  saveProducts();
  renderTable(document.getElementById("searchInput").value);
}

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

  var existingId = document.getElementById("prodId").value;
  var name       = document.getElementById("prodName").value.trim();
  var newId      = existingId || name.toLowerCase().replace(/\s+/g, "-");

  var updated = {
    id:    newId,
    n:     name,
    b:     document.getElementById("prodBrand").value.trim(),
    c:     document.getElementById("prodCat").value,
    p:     parseInt(document.getElementById("prodPrice").value),
    stock: parseInt(document.getElementById("prodStock").value),
    icon:  document.getElementById("prodIcon").value.trim() || "📦"
  };

  var found = false;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === newId) { products[i] = updated; found = true; break; }
  }
  if (!found) products.push(updated);

  saveProducts();
  document.getElementById("productModal").style.display = "none";
  renderTable(document.getElementById("searchInput").value);
});

document.getElementById("searchInput").addEventListener("input", function() {
  renderTable(this.value);
});

// TODO: Load products from backend
// fetch("server.php?action=getProducts")
//   .then(function(res) { return res.json(); })
//   .then(function(data) {
//     products = data;
//     renderTable();
//   });

// Load from localStorage if backend not connected yet
var saved = localStorage.getItem("admin_products");
if (saved) products = JSON.parse(saved);
renderTable();
