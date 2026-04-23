<?php
session_start();
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$action = isset($_GET['action']) ? $_GET['action'] : '';
if ($action != '') {
    header('Content-Type: application/json');
    if ($action == 'list') {
        $result = pg_query($conn, "SELECT * FROM products ORDER BY id ASC");
        $products = [];
        while ($row = pg_fetch_assoc($result)) {
            $products[] = $row;
        }
        echo json_encode($products);
    } elseif ($action == 'add' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) { echo json_encode(['success' => false]); exit; }
        $result = pg_query_params($conn,
            "INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
            array($data['name'], $data['description'], $data['price'], $data['category'], $data['stock'], $data['image_url'])
        );
        echo json_encode(['success' => $result ? true : false]);
    } elseif ($action == 'update' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) { echo json_encode(['success' => false]); exit; }
        $result = pg_query_params($conn,
            "UPDATE products SET name=$1, description=$2, price=$3, category=$4, stock=$5, image_url=$6 WHERE id=$7",
            array($data['name'], $data['description'], $data['price'], $data['category'], $data['stock'], $data['image_url'], $data['id'])
        );
        echo json_encode(['success' => $result ? true : false]);
    } elseif ($action == 'update_specs' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) { echo json_encode(['success' => false]); exit; }
        $result = pg_query_params($conn,
            "UPDATE products SET specs=$1 WHERE id=$2",
            array($data['specs'], $data['id'])
        );
        echo json_encode(['success' => $result ? true : false]);
    } elseif ($action == 'delete' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) { echo json_encode(['success' => false]); exit; }
        $result = pg_query_params($conn, "DELETE FROM products WHERE id=$1", array($data['id']));
        echo json_encode(['success' => $result ? true : false]);
    } elseif ($action == 'feedbacks') {
        $result = pg_query($conn, "SELECT * FROM feedback ORDER BY submitted_at DESC");
        $feedbacks = [];
        while ($row = pg_fetch_assoc($result)) {
            $feedbacks[] = $row;
        }
        echo json_encode($feedbacks);
    } elseif ($action == 'upload_image' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['success' => false, 'error' => 'No file uploaded']);
            exit;
        }
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $mime = mime_content_type($_FILES['image']['tmp_name']);
        if (!in_array($mime, $allowed)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file type']);
            exit;
        }
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = uniqid('product_') . '.' . strtolower($ext);
        $dest = __DIR__ . '/images/products/' . $filename;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
            echo json_encode(['success' => true, 'path' => 'images/products/' . $filename]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to save file']);
        }
    }
    pg_close($conn);
    exit;
}
pg_close($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Panel - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="admin.css" />
</head>
<body>
  <nav class="admin-navbar">
    <div class="admin-nav-inner">
      <div class="admin-brand">NexGear Admin</div>
      <div class="admin-nav-links">
        <a href="home.php">Back to Store</a>
        <a href="#inventory-section">Inventory</a>
        <a href="#feedback-section">Feedback</a>
      </div>
    </div>
  </nav>
  <div class="admin-wrapper">
    <div id="inventory-section">
      <div class="admin-header">
        <h1>Inventory Management</h1>
        <div class="admin-header-actions">
          <input type="text" id="searchInput" class="form-input" placeholder="Search products..." style="width:220px;" />
          <button class="btn-primary" id="addBtn" style="padding:9px 18px; border-radius:8px;">+ Add Product</button>
        </div>
      </div>
      <div class="admin-stats">
        <div class="stat-box">
          <div class="stat-label">Total Products</div>
          <div class="stat-value" id="totalProducts">0</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Inventory Value</div>
          <div class="stat-value" id="totalValue">₹0</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Low Stock Items</div>
          <div class="stat-value" id="lowStock">0</div>
        </div>
      </div>
      <div class="table-box">
        <table class="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
        <div id="emptyMsg" style="display:none; text-align:center; padding:30px; color:#888; font-size:14px;">No products found.</div>
      </div>
    </div>
    <div id="feedback-section" style="margin-top: 40px;">
      <div class="admin-header">
        <h1>Customer Feedback</h1>
        <div class="stat-box" style="padding:8px 16px;">
          Total: <strong id="feedbackCount">0</strong>
        </div>
      </div>
      <div class="table-box">
        <table class="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="feedbackBody"></tbody>
        </table>
        <div id="feedbackEmpty" style="display:none; text-align:center; padding:30px; color:#888; font-size:14px;">No feedback received yet.</div>
      </div>
    </div>
  </div>
  <div id="productModal" class="modal-overlay" style="display:none;">
    <div class="modal-box">
      <h2 id="modalTitle" style="font-size:18px; font-weight:700; margin-bottom:20px;">Add Product</h2>
      <form id="productForm">
        <input type="hidden" id="prodId" />
        <div class="form-group">
          <label class="form-label">Product Name</label>
          <input type="text" class="form-input" id="prodName" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <input type="text" class="form-input" id="prodDesc" required />
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="prodCat">
            <option>Peripherals</option>
            <option>Accessories</option>
            <option>Audio</option>
            <option>Headphones</option>
            <option>Monitors</option>
            <option>Keyboards</option>
            <option>Mouse</option>
            <option>Microphones</option>
            <option>Webcams</option>
            <option>Gaming Chairs</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Price (₹)</label>
          <input type="number" class="form-input" id="prodPrice" required />
        </div>
        <div class="form-group">
          <label class="form-label">Stock</label>
          <input type="number" class="form-input" id="prodStock" required />
        </div>
        <div class="form-group">
          <label class="form-label">Product Image</label>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <input type="text" class="form-input" id="prodImage" placeholder="e.g. images/products/photo.jpg" style="flex:1; min-width:180px;" />
            <label style="cursor:pointer; padding:8px 14px; background:#f0f0f0; border:1px solid #ccc; border-radius:8px; font-size:13px; white-space:nowrap;">
              Upload File
              <input type="file" id="prodImageFile" accept="image/*" style="display:none;" />
            </label>
          </div>
          <div id="imagePreview" style="margin-top:10px; display:none;">
            <img id="previewImg" src="" alt="Preview" style="max-height:120px; max-width:100%; border:1px solid #ddd; border-radius:6px; object-fit:contain;" />
          </div>
          <p id="uploadStatus" style="font-size:12px; color:#888; margin-top:4px;"></p>
        </div>
        <div class="modal-buttons">
          <button type="button" id="cancelModalBtn" style="padding:10px 20px; border:1px solid #ccc; border-radius:8px; background:#fff; font-size:14px; cursor:pointer;">Cancel</button>
          <button type="submit" class="btn-primary" style="padding:10px 20px; border-radius:8px;">Save</button>
        </div>
      </form>
    </div>
  </div>
  <div id="specModal" class="modal-overlay" style="display:none;">
    <div class="modal-box" style="max-width:480px;">
      <h2 style="font-size:18px; font-weight:700; margin-bottom:12px;">Edit Specifications</h2>
      <p style="font-size:13px; color:#888; margin-bottom:12px;">One spec per line. Format: <strong>Name: Value</strong><br>Example: RAM: 16GB</p>
      <input type="hidden" id="specProductId" />
      <textarea id="specTextarea" rows="8" class="form-input" style="width:100%; font-family:monospace; font-size:13px;" placeholder="RAM: 16GB&#10;Storage: 512GB&#10;Color: Black"></textarea>
      <div class="modal-buttons">
        <button type="button" onclick="closeSpecModal()" style="padding:10px 20px; border:1px solid #ccc; border-radius:8px; background:#fff; font-size:14px; cursor:pointer;">Cancel</button>
        <button type="button" onclick="saveSpecs()" class="btn-primary" style="padding:10px 20px; border-radius:8px;">Save</button>
      </div>
    </div>
  </div>
  <script src="admin.js"></script>
</body>
</html>
