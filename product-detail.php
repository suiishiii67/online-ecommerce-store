<?php
session_start();
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) { header("Location: products.php"); exit; }

$result  = pg_query_params($conn, "SELECT * FROM products WHERE id = $1", array($id));
$product = pg_fetch_assoc($result);
if (!$product) { header("Location: products.php"); exit; }

pg_close($conn);

$stock = (int)$product['stock'];
if ($stock > 10)    { $stock_label = "In Stock";         $stock_color = "green"; }
elseif ($stock > 0) { $stock_label = "Only $stock left"; $stock_color = "orange"; }
else                { $stock_label = "Out of Stock";      $stock_color = "red"; }

$specs_raw = trim($product['specs'] ?? '');
$spec_rows = [];
if ($specs_raw != '') {
    foreach (explode("\n", $specs_raw) as $line) {
        $line = trim($line);
        if ($line == '') continue;
        $idx = strpos($line, ':');
        $key = $idx !== false ? trim(substr($line, 0, $idx)) : $line;
        $val = $idx !== false ? trim(substr($line, $idx + 1)) : '';
        $spec_rows[] = ['key' => $key, 'val' => $val];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($product['name']); ?> - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    .pd-wrap { max-width: 1000px; margin: 30px auto; padding: 0 20px 50px; }
    .pd-card { background: white; border: 1px solid #ddd; padding: 30px; display: flex; gap: 40px; }
    .pd-image-box { width: 320px; min-height: 280px; background: #f5f5f5; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; color: #aaa; flex-shrink: 0; }
    .pd-info { flex: 1; }
    .pd-category { font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 6px; }
    .pd-name { font-size: 22px; font-weight: bold; margin-bottom: 8px; }
    .pd-price { font-size: 28px; font-weight: bold; color: #0071e3; margin-bottom: 6px; }
    .pd-stock { font-size: 14px; font-weight: bold; margin-bottom: 14px; }
    .pd-desc { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 20px; padding-top: 12px; border-top: 1px solid #eee; }
    .qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .qty-box { display: flex; align-items: center; border: 1px solid #ddd; }
    .qty-box button { width: 32px; height: 32px; border: none; background: #f0f0f0; font-size: 16px; cursor: pointer; }
    .qty-box span { width: 38px; text-align: center; font-size: 15px; font-weight: bold; }
    .btn-add-cart { background: #0071e3; color: white; border: none; padding: 11px 28px; font-size: 14px; font-weight: bold; cursor: pointer; margin-right: 10px; }
    .btn-go-back { background: white; color: #333; border: 1px solid #ccc; padding: 11px 22px; font-size: 14px; cursor: pointer; }
    .specs-box { background: white; border: 1px solid #ddd; padding: 20px; margin-top: 20px; }
    .specs-box h2 { font-size: 15px; font-weight: bold; margin-bottom: 12px; }
    .spec-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .spec-table td { padding: 9px 12px; border: 1px solid #eee; }
    .spec-table td:first-child { font-weight: bold; background: #f8f8f8; width: 35%; }
  </style>
</head>
<body>

<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
    <ul class="nav-links">
      <li><a href="home.php">Home</a></li>
      <li><a href="products.php" class="active">Products</a></li>
      <li><a href="cart.php">Cart</a></li>
      <li><a href="order-tracking.php">Orders</a></li>
      <li><a href="feedback.php">Contact Us</a></li>
    </ul>
    <div class="nav-actions">
      <a href="cart.php" class="cart-icon-wrap">Cart <span class="cart-badge" id="nav-cart-count">0</span></a>
      <a href="login.php" class="btn-primary">Sign In</a>
    </div>
  </div>
</nav>

<div class="pd-wrap">

  <div class="breadcrumb">
    <a href="home.php">Home</a> <span>/</span>
    <a href="products.php">Products</a> <span>/</span>
    <?php echo htmlspecialchars($product['name']); ?>
  </div>

  <div class="pd-card">

    <div class="pd-image-box">No Image</div>

    <div class="pd-info">
      <p class="pd-category"><?php echo htmlspecialchars($product['category']); ?></p>
      <h1 class="pd-name"><?php echo htmlspecialchars($product['name']); ?></h1>
      <p class="pd-price">₹<?php echo number_format((float)$product['price']); ?></p>
      <p class="pd-stock" style="color:<?php echo $stock_color; ?>;"><?php echo $stock_label; ?></p>
      <p class="pd-desc"><?php echo htmlspecialchars($product['description']); ?></p>

      <div class="qty-row">
        <span class="qty-label">Quantity:</span>
        <div class="qty-box">
          <button onclick="changeQty(-1)">-</button>
          <span id="qty-display">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
      </div>

      <button class="btn-add-cart" onclick="addWithQty()">+ Add to Cart</button>
      <button class="btn-go-back" onclick="window.history.back()">Go Back</button>
    </div>

  </div>

  <div class="specs-box">
    <h2>Specifications</h2>
    <?php if (count($spec_rows) > 0): ?>
      <table class="spec-table">
        <?php foreach ($spec_rows as $row): ?>
        <tr>
          <td><?php echo htmlspecialchars($row['key']); ?></td>
          <td><?php echo htmlspecialchars($row['val']); ?></td>
        </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p style="font-size:13px; color:#aaa;">No specifications added yet.</p>
    <?php endif; ?>
  </div>

</div>

<footer><p>© 2025 NexGear. All rights reserved.</p></footer>

<script src="cart.js"></script>
<script>
var qty = 1;

function changeQty(change) {
  qty = qty + change;
  if (qty < 1) qty = 1;
  document.getElementById("qty-display").textContent = qty;
}

function addWithQty() {
  for (var i = 0; i < qty; i++) {
    addToCart(
      <?php echo $product['id']; ?>,
      '<?php echo addslashes($product['name']); ?>',
      '<?php echo addslashes($product['description']); ?>',
      <?php echo (int)$product['price']; ?>,
      ''
    );
  }
}
</script>

</body>
</html>
