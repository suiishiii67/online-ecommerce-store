var products = [];

// send a POST request with JSON data and call callback with the result
function sendRequest(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    callback(JSON.parse(xhr.responseText));
  };
  xhr.send(JSON.stringify(data));
}

// fetch all products from server and render the table
function loadProducts() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "admin.php?action=list");
  xhr.onload = function() {
    products = JSON.parse(xhr.responseText);
    renderTable("");
  };
  xhr.send();
}

// return stock status label and CSS class based on quantity
function getStatus(stock) {
  stock = parseInt(stock);
  if (stock == 0) return { label: "Out of Stock", cls: "status-out" };
  if (stock < 20) return { label: "Low Stock", cls: "status-low" };
  return { label: "In Stock", cls: "status-in" };
}

// update the stats bar at the top of the admin page
function updateStats() {
  var totalValue = 0;
  var lowCount = 0;

  for (var i = 0; i < products.length; i++) {
    totalValue += parseFloat(products[i].price) * parseInt(products[i].stock);
    if (parseInt(products[i].stock) < 20) lowCount++;
  }

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalValue").textContent = "₹" + totalValue.toLocaleString("en-IN");
  document.getElementById("lowStock").textContent = lowCount;
}

// show products in the table
function renderTable(searchText) {
  var tbody = document.getElementById("tableBody");
  var emptyMsg = document.getElementById("emptyMsg");
  var html = "";

  searchText = searchText.toLowerCase();

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
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
    html += "<button class='btn-edit' onclick='openEdit(" + p.id + ")'>Edit</button> ";
    html += "<button class='btn-spec' onclick='openSpec(" + p.id + ")'>Spec</button> ";
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

// open edit form and fill in product details
function openEdit(productId) {
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) == productId) {
      var p = products[i];
      document.getElementById("modalTitle").textContent = "Edit Product";
      document.getElementById("prodId").value = p.id;
      document.getElementById("prodName").value = p.name;
      document.getElementById("prodDesc").value = p.description || "";
      document.getElementById("prodCat").value = p.category;
      document.getElementById("prodPrice").value = p.price;
      document.getElementById("prodStock").value = p.stock;
      var imgUrl = p.image_url || "";
      document.getElementById("prodImage").value = imgUrl;
      document.getElementById("uploadStatus").textContent = "";
      if (imgUrl) {
        document.getElementById("previewImg").src = imgUrl;
        document.getElementById("imagePreview").style.display = "block";
      } else {
        document.getElementById("imagePreview").style.display = "none";
      }
      document.getElementById("productModal").style.display = "flex";
      break;
    }
  }
}

// delete a product
function deleteProduct(productId) {
  if (!confirm("Delete this product?")) return;

  sendRequest("admin.php?action=delete", { id: productId }, function(result) {
    if (result.success) loadProducts();
    else alert("Failed to delete.");
  });
}

// save product (add or update)
document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();

  var existingId = document.getElementById("prodId").value;
  var action = existingId ? "update" : "add";

  var data = {
    name: document.getElementById("prodName").value.trim(),
    description: document.getElementById("prodDesc").value.trim(),
    category: document.getElementById("prodCat").value,
    price: parseFloat(document.getElementById("prodPrice").value),
    stock: parseInt(document.getElementById("prodStock").value),
    image_url: document.getElementById("prodImage").value.trim()
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

// upload selected image file to server and set the path in the URL field
document.getElementById("prodImageFile").addEventListener("change", function() {
  var file = this.files[0];
  if (!file) return;

  var status = document.getElementById("uploadStatus");
  status.textContent = "Uploading...";

  var formData = new FormData();
  formData.append("image", file);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "admin.php?action=upload_image");
  xhr.onload = function() {
    var res = JSON.parse(xhr.responseText);
    if (res.success) {
      document.getElementById("prodImage").value = res.path;
      document.getElementById("previewImg").src = res.path;
      document.getElementById("imagePreview").style.display = "block";
      status.textContent = "Uploaded: " + res.path;
    } else {
      status.textContent = "Upload failed: " + (res.error || "unknown error");
    }
  };
  xhr.send(formData);
});

// show image preview when a URL is typed manually into the field
document.getElementById("prodImage").addEventListener("input", function() {
  var val = this.value.trim();
  if (val) {
    document.getElementById("previewImg").src = val;
    document.getElementById("imagePreview").style.display = "block";
  } else {
    document.getElementById("imagePreview").style.display = "none";
  }
});

// open add product form
document.getElementById("addBtn").addEventListener("click", function() {
  document.getElementById("modalTitle").textContent = "Add Product";
  document.getElementById("productForm").reset();
  document.getElementById("prodId").value = "";
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("uploadStatus").textContent = "";
  document.getElementById("productModal").style.display = "flex";
});

// close product form
document.getElementById("cancelModalBtn").addEventListener("click", function() {
  document.getElementById("productModal").style.display = "none";
});

// search box filter
document.getElementById("searchInput").addEventListener("input", function() {
  renderTable(this.value);
});

// open spec form
function openSpec(productId) {
  for (var i = 0; i < products.length; i++) {
    if (parseInt(products[i].id) == productId) {
      document.getElementById("specProductId").value = productId;
      document.getElementById("specTextarea").value = products[i].specs || "";
      document.getElementById("specModal").style.display = "flex";
      break;
    }
  }
}

// close spec form
function closeSpecModal() {
  document.getElementById("specModal").style.display = "none";
}

// save specs
function saveSpecs() {
  var productId = document.getElementById("specProductId").value;
  var specsText = document.getElementById("specTextarea").value.trim();

  sendRequest("admin.php?action=update_specs", { id: productId, specs: specsText }, function(result) {
    if (result.success) { closeSpecModal(); loadProducts(); }
    else alert("Failed to save specs.");
  });
}

loadProducts();
loadFeedbacks();

// fetch all feedback from server and show in table
function loadFeedbacks() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "admin.php?action=feedbacks");
  xhr.onload = function() {
    var feedbacks = JSON.parse(xhr.responseText);
    var tbody = document.getElementById("feedbackBody");
    var empty = document.getElementById("feedbackEmpty");
    document.getElementById("feedbackCount").textContent = feedbacks.length;

    if (feedbacks.length == 0) {
      tbody.innerHTML = "";
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";
    var html = "";
    for (var i = 0; i < feedbacks.length; i++) {
      var f = feedbacks[i];
      var date = f.submitted_at ? f.submitted_at.substring(0, 16).replace("T", " ") : "-";
      html += "<tr>";
      html += "<td>" + f.id + "</td>";
      html += "<td>" + f.name + "</td>";
      html += "<td>" + f.email + "</td>";
      html += "<td style='max-width:400px;'>" + f.message + "</td>";
      html += "<td style='white-space:nowrap;'>" + date + "</td>";
      html += "</tr>";
    }
    tbody.innerHTML = html;
  };
  xhr.send();
}
