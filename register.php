<?php
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$error = "";
$success = "";

// handle registration form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $password = trim($_POST["password"]);

    if ($name == "") {
        $error = "Please enter your full name.";
    } elseif ($email == "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif (strlen(preg_replace('/\D/', '', $phone)) < 10) {
        $error = "Please enter a valid 10-digit phone number.";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters.";
    } else {
        // don't allow duplicate emails
        $check = pg_query_params($conn, "SELECT id FROM users WHERE email = $1", array($email));
        if (pg_num_rows($check) > 0) {
            $error = "This email is already registered.";
        } else {
            // hash the password so it's never stored as plain text
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $insert = pg_query_params($conn,
                "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4)",
                array($name, $email, $phone, $hashed)
            );
            if ($insert) {
                $success = "Account created! You can now sign in.";
            } else {
                $error = "Something went wrong. Try again.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register - NexGear</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .login-page { min-height: 85vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; padding: 30px 20px; }
    .login-card { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 36px 30px; width: 100%; max-width: 400px; }
    .login-logo { width: 44px; height: 44px; background: #333; color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin: 0 auto 16px; }
    .login-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 6px; }
    .login-sub { font-size: 13px; color: #666; text-align: center; margin-bottom: 22px; }
    .login-btn { width: 100%; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; margin-top: 4px; cursor: pointer; }
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
    <h1 class="login-title">Create Account</h1>
    <p class="login-sub">Join NexGear today</p>

    <?php if ($success != "") { ?>
      <p style="color:green; font-size:13px; margin-bottom:14px;"><?php echo $success; ?></p>
    <?php } ?>
    <?php if ($error != "") { ?>
      <p style="color:red; font-size:13px; margin-bottom:14px;"><?php echo $error; ?></p>
    <?php } ?>

    <form method="POST" action="register.php" id="registerForm">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" class="form-input" id="regName" name="name" placeholder="Full Name" required>
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" id="regEmail" name="email" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input type="tel" class="form-input" id="regPhone" name="phone" placeholder="10-digit number" required>
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" id="regPassword" name="password" placeholder="Min 6 characters" required>
      </div>
      <button type="submit" class="login-btn">Create Account</button>
    </form>

    <p class="login-footer">Already have an account? <a href="login.php">Sign In</a></p>
  </div>
</div>

<script src="register.js"></script>
</body>
</html>