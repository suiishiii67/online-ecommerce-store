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
if ($stock > 10)    { $stock_label = "In Stock";         $stock_color = "#2e7d32"; }
elseif ($stock > 0) { $stock_label = "Only $stock left"; $stock_color = "#e65100"; }
else                { $stock_label = "Out of Stock";      $stock_color = "#c62828"; }

$specs_raw  = trim($product['specs'] ?? '');
$spec_rows  = [];
if ($specs_raw !== '') {
    foreach (explode("\n", $specs_raw) as $line) {
        $line = trim($line);
        if ($line === '') continue;
        $idx  = strpos($line, ':');
        $key  = $idx !== false ? trim(substr($line, 0, $idx))      : $line;
        $val  = $idx !== false ? trim(substr($line, $idx + 1))     : '';
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
    body { background: #f7f7f7; }
    .pd-wrap { max-width: 820px; margin: 30px auto; padding: 0 20px 40px; }
    .back-link { display:inline-block; margin-bottom:18px; font-size:13px; color:#0071e3; text-decoration:none; }
    .back-link:hover { text-decoration:underline; }

    .pd-card { background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:28px; display:flex; gap:30px; flex-wrap:wrap; }
    .pd-image { flex:0 0 260px; background:#f5f5f5; border:1px solid #e8e8e8; border-radius:6px; min-height:220px; display:flex; align-items:center; justify-content:center; color:#bbb; font-size:13px; }
    .pd-info  { flex:1; min-width:200px; }
    .pd-cat   { font-size:11px; text-transform:uppercase; letter-spacing:0.6px; color:#888; margin-bottom:6px; }
    .pd-name  { font-size:22px; font-weight:700; margin-bottom:10px; }
    .pd-price { font-size:26px; font-weight:700; color:#0071e3; margin-bottom:6px; }
    .pd-stock { font-size:13px; font-weight:600; margin-bottom:14px; }
    .pd-desc  { font-size:14px; color:#555; line-height:1.65; margin-bottom:22px; border-top:1px solid #f0f0f0; padding-top:14px; }
    .pd-btns  { display:flex; gap:10px; flex-wrap:wrap; }
    .btn-cart    { background:#0071e3; color:#fff; border:none; padding:11px 26px; font-size:14px; border-radius:6px; cursor:pointer; }
    .btn-cart:hover { background:#005ac1; }
    .btn-back    { background:#fff; color:#333; border:1px solid #ccc; padding:11px 20px; font-size:14px; border-radius:6px; cursor:pointer; }
    .btn-back:hover { background:#f0f0f0; }

    .specs-card { background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:24px; margin-top:20px; }
    .specs-card h2 { font-size:15px; font-weight:700; margin-bottom:14px; }
    .spec-table { width:100%; border-collapse:collapse; font-size:13px; }
    .spec-table tr:nth-child(even) td { background:#fafafa; }
    .spec-table td { padding:9px 14px; border:1px solid #e8e8e8; }
    .spec-table td:first-child { font-weight:600; width:36%; background:#f5f5f5; }
    .no-specs { font-size:13px; color:#aaa; }
  </style>
</head>
<body>

<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div>NexGear</a>
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

  <a href="products.php" class="back-link">&larr; Back to Products</a>

  <div class="pd-card">
    <div class="pd-image">No Image</div>
    <div class="pd-info">
      <p class="pd-cat"><?php echo htmlspecialchars($product['category']); ?></p>
      <h1 class="pd-name"><?php echo htmlspecialchars($product['name']); ?></h1>
      <p class="pd-price">&#8377;<?php echo number_format((float)$product['price']); ?></p>
      <p class="pd-stock" style="color:<?php echo $stock_color; ?>;"><?php echo $stock_label; ?></p>
      <p class="pd-desc"><?php echo htmlspecialchars($product['description']); ?></p>
      <div class="pd-btns">
        <button class="btn-cart" onclick="addToCartDetail(<?php echo $product['id']; ?>,'<?php echo addslashes($product['name']); ?>','<?php echo addslashes($product['description']); ?>',<?php echo (int)$product['price']; ?>)">
          + Add to Cart
        </button>
        <button class="btn-back" onclick="window.history.back()">Go Back</button>
      </div>
    </div>
  </div>

  <div class="specs-card">
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
      <p class="no-specs">No specifications added yet.</p>
    <?php endif; ?>
  </div>

</div>

<footer><p>&copy; 2025 NexGear. All rights reserved.</p></footer>
<div id="toast-msg"></div>
<script src="cart.js"></script>
<script src="ui.js"></script>
<script>
function addToCartDetail(pid, name, desc, price) {
  if (typeof addToCart === "function") addToCart(pid, name, desc, price, "");
}
</script>

</body>
</html>
