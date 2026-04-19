var products = [];

// send data to server and get back a response
function sendRequest(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    callback(JSON.parse(xhr.responseText));
  };
  xhr.send(JSON.stringify(data));
}

// load all products from the database
function loadProducts() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "admin.php?action=list");
  xhr.onload = function() {
    products = JSON.parse(xhr.responseText);
    renderTable("");
  };
  xhr.send();
}

// return stock status label and css class
function getStatus(stock) {
  stock = parseInt(stock);
  if (stock == 0) return { label: "Out of Stock", cls: "status-out" };
  if (stock < 10) return { label: "Low Stock",    cls: "status-low" };
  return              { label: "In Stock",     cls: "status-in"  };
}

// update the 3 stat boxes at the top of the page
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

// show products in the table, filtered by search text
function renderTable(searchText) {
  var tbody    = document.getElementById("tableBody");
  var emptyMsg = document.getElementById("emptyMsg");
  var html     = "";

  searchText = searchText.toLowerCase();

  for (var i = 0; i < products.length; i++) {
    var p    = products[i];
    var text = (p.name + " " + p.description + " " + p.category).toLowerCase();

    if (text.indexOf(searchText) == -1) continue;

    var s = getStatus(p.stock);
    html += "<tr>";
    html += "<td><strong>" + p.name + "</strong></td>";
    html += "<td>" + (p.description || "") + "</td>";
    html += "<td>" + p.category + "</td>";
    html += "<td>₹" + parseFloat(p.price).toLocaleString("en-IN") + "</td>";
    html += "<td>" + p.stock + "</td>";
    html += "<td><span class='status-badge " + s.cls + "'>" + s.label + "</span></td>";
    html += "<td>";
    html += "<button class='btn-edit'   onclick='openEdit("   + p.id + ")'>Edit</button> ";
    html += "<button class='btn-spec'   onclick='openSpec("   + p.id + ")'>Spec</button> ";
    html += "<button class='btn-delete' onclick='deleteProduct(" + p.id + ")'>Delete</button>";
    html += "</td></tr>";
  }

  if (html == "") {
    tbody.innerHTML = "";
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
    tbody.innerHTML = html;
  }

  updateStats();
}

// open edit modal and fill in the product details
function openEdit(productId) {
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) == productId) {
      var p = products[i];
      document.getElementById("modalTitle").textContent = "Edit Product";
      document.getElementById("prodId").value           = p.id;
      document.getElementById("prodName").value         = p.name;
      document.getElementById("prodDesc").value         = p.description || "";
      document.getElementById("prodCat").value          = p.category;
      document.getElementById("prodPrice").value        = p.price;
      document.getElementById("prodStock").value        = p.stock;
      document.getElementById("prodImage").value        = p.image_url || "";
      document.getElementById("productModal").style.display = "flex";
      break;
    }
  }
}

// delete a product after confirmation
function deleteProduct(productId) {
  if (!confirm("Delete this product?")) return;

  sendRequest("admin.php?action=delete", { id: productId }, function(result) {
    if (result.success) loadProducts();
    else alert("Failed to delete.");
  });
}

// save product when form is submitted (add or update)
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

// open add product modal
document.getElementById("addBtn").addEventListener("click", function() {
  document.getElementById("modalTitle").textContent = "Add Product";
  document.getElementById("productForm").reset();
  document.getElementById("prodId").value = "";
  document.getElementById("productModal").style.display = "flex";
});

// close product modal
document.getElementById("cancelModalBtn").addEventListener("click", function() {
  document.getElementById("productModal").style.display = "none";
});

// search box
document.getElementById("searchInput").addEventListener("input", function() {
  renderTable(this.value);
});

// open spec modal and load existing specs into textarea
function openSpec(productId) {
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) == productId) {
      document.getElementById("specProductId").value   = productId;
      document.getElementById("specTextarea").value    = products[i].specs || "";
      document.getElementById("specModal").style.display = "flex";
      break;
    }
  }
}

// close spec modal
function closeSpecModal() {
  document.getElementById("specModal").style.display = "none";
}

// save specs from textarea
function saveSpecs() {
  var productId = document.getElementById("specProductId").value;
  var specsText = document.getElementById("specTextarea").value.trim();

  sendRequest("admin.php?action=update_specs", { id: productId, specs: specsText }, function(result) {
    if (result.success) { closeSpecModal(); loadProducts(); }
    else alert("Failed to save specs.");
  });
}

// load products when page opens
loadProducts();
