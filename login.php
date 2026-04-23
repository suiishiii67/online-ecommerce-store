<?php
session_start();
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$error = "";
$success = "";
$redirect_url = "home.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    if ($email == "") {
        $error = "Please enter your email.";
    } elseif ($password == "") {
        $error = "Please enter your password.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif ($email == "admin@gmail.com" && $password == "123") {
        $success = "Welcome Admin! Redirecting...";
        $redirect_url = "admin.php";
    } else {
        $result = pg_query_params($conn, "SELECT * FROM users WHERE email = $1", array($email));
        $user = pg_fetch_assoc($result);
        if ($user && password_verify($password, $user["password"])) {
            $_SESSION["user_id"]   = $user["id"];
            $_SESSION["user_name"] = $user["name"];
            $_SESSION["username"]  = $user["name"];
            echo "session variable is   " . $_SESSION["username"];
            echo "<br> Welcome " . $_SESSION["username"] . "<br>";
            $success = "Welcome back, " . $user["name"] . "! Redirecting...";
        } else {
            $error = "Wrong email or password.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - NexGear</title>
  <link rel="stylesheet" href="style.css">
  <?php if ($success != "") { ?>
  <meta http-equiv="refresh" content="2;url=<?php echo $redirect_url; ?>">
  <?php } ?>
  <style>
    .login-page { min-height: 85vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; padding: 30px 20px; }
    .login-card { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 36px 30px; width: 100%; max-width: 400px; }
    .login-logo { width: 44px; height: 44px; background: #333; color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin: 0 auto 16px; }
    .login-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 6px; }
    .login-sub { font-size: 13px; color: #666; text-align: center; margin-bottom: 22px; }
    .login-btn { width: 100%; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; margin-top: 4px; cursor: pointer; }
    .login-btn:hover { background: #555; }
    .login-footer { text-align: center; font-size: 13px; color: #666; margin-top: 16px; }
    .login-footer a { color: #0071e3; }
  </style>
</head>
<body>
<nav class="navbar">
  <div class="nav-container">
    <a href="home.php" class="nav-logo"><div class="logo-icon">N</div> NexGear</a>
    <ul class="nav-links">
      <li><a href="home.php">Home</a></li>
      <li><a href="products.php">Products</a></li>
      <li><a href="cart.php">Cart</a></li>
      <li><a href="order-tracking.php">Orders</a></li>
      <li><a href="feedback.php">Contact Us</a></li>
    </ul>
    <form class="nav-search" action="products.php" method="get">
      <input type="text" name="search" placeholder="Search products...">
      <button type="submit">Search</button>
    </form>
    <div class="nav-actions">
      <a href="login.php" class="btn-primary">Sign In</a>
    </div>
  </div>
</nav>
<div class="login-page">
  <div class="login-card">
    <div class="login-logo">N</div>
    <h1 class="login-title">Welcome Back</h1>
    <p class="login-sub">Sign in to your NexGear account</p>
    <?php if ($success != "") { ?>
      <p style="color:green; font-size:13px; margin-bottom:14px;"><?php echo $success; ?></p>
    <?php } ?>
    <?php if ($error != "") { ?>
      <p style="color:red; font-size:13px; margin-bottom:14px;"><?php echo $error; ?></p>
    <?php } ?>
    <form method="POST" action="login.php" id="loginForm">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="email" name="email" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" id="password" name="password" placeholder="••••••">
      </div>
      <button type="submit" class="login-btn">Sign In</button>
    </form>
    <p class="login-footer">Don't have an account? <a href="register.php">Create one</a></p>
  </div>
</div>
<script src="login.js"></script>
</body>
</html>
