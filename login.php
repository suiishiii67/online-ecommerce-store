<?php
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");
$error        = "";
$success      = "";
$redirect_url = "home.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email    = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    if ($email == "") {
        $error = "Please enter your email address.";
    } elseif ($password == "") {
        $error = "Please enter your password.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif ($email == "admin@gmail.com" && $password == "123") {
        $success      = "Welcome, Admin! Redirecting to admin panel...";
        $redirect_url = "admin.php";
    } else {
        $result = pg_query_params($conn, "SELECT * FROM users WHERE email = $1", array($email));
        $user   = pg_fetch_assoc($result);

        if ($user && password_verify($password, $user["password"])) {
            $success = "Welcome back, " . $user["name"] . ". Redirecting to home page...";
        } else {
            $error = "Incorrect email or password.";
        }
    }
}
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["email"]) && isset($_GET["password"])) {
    $email    = trim($_GET["email"]);
    $password = trim($_GET["password"]);
    if ($email == "") {
        $error = "Please enter your email address.";
    } elseif ($password == "") {
        $error = "Please enter your password.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif ($email == "admin@gmail.com" && $password == "123") {
        $success      = "Welcome, Admin! Redirecting to admin panel...";
        $redirect_url = "admin.php";
    } else {
        $result = pg_query_params($conn, "SELECT * FROM users WHERE email = $1", array($email));
        $user   = pg_fetch_assoc($result);

        if ($user && password_verify($password, $user["password"])) {
            $success = "Welcome back, " . $user["name"] . ". Redirecting to home page...";
        } else {
            $error = "Incorrect email or password.";
        }
    }
}

if (isset($_REQUEST["email"]) && isset($_REQUEST["password"])) {
    $email    = trim($_REQUEST["email"]);
    $password = trim($_REQUEST["password"]);
    if ($email == "") {
        $error = "Please enter your email address.";
    } elseif ($password == "") {
        $error = "Please enter your password.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif ($email == "admin@gmail.com" && $password == "123") {
        $success      = "Welcome, Admin! Redirecting to admin panel...";
        $redirect_url = "admin.php";
    } else {
        $result = pg_query_params($conn, "SELECT * FROM users WHERE email = $1", array($email));
        $user   = pg_fetch_assoc($result);

        if ($user && password_verify($password, $user["password"])) {
            $success = "Welcome back, " . $user["name"] . " Redirecting to home page...";
        } else {
            $error = "Incorrect email or password.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign In - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="login.css" />
  <?php if ($success != "") { ?>
    <meta http-equiv="refresh" content="2;url=<?php echo $redirect_url; ?>" />
  <?php } ?>
</head>
<body>

  <nav class="navbar">
    <div class="nav-container">
      <a href="home.php" class="nav-logo">
        <div class="logo-icon">N</div>
        NexGear
      </a>
      <ul class="nav-links">
        <li><a href="home.php">Home</a></li>
        <li><a href="products.php">Products</a></li>
        <li><a href="cart.php">Cart</a></li>
        <li><a href="order-tracking.php">Orders</a></li>
        <li><a href="feedback.php">Contact Us</a></li>
      </ul>
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
        <p style="color:#dc3545; font-size:13px; margin-bottom:14px;"><?php echo $error; ?></p>
      <?php } ?>

      <form id="login-form" method="POST" action="login.php">

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" name="email" id="login-email" placeholder="you@example.com" required />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" name="password" id="login-password" placeholder="••••••" required />
        </div>

        <button type="submit" class="login-btn" id="loginBtn">Sign In →</button>
      </form>

      <p class="login-footer">
        Don't have an account? <a href="register.php">Create one →</a>
      </p>

    </div>
  </div>

  <div id="toast-msg"></div>

  <script src="login.js"></script>
  <script src="ui.js"></script>

</body>
</html>
