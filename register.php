<?php
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");

$error   = "";
$success = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name     = trim($_POST["name"]);
    $email    = trim($_POST["email"]);
    $phone    = trim($_POST["phone"]);
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
        $check = pg_query_params($conn, "SELECT id FROM users WHERE email = $1", array($email));

        if (pg_num_rows($check) > 0) {
            $error = "This email is already registered.";
        } else {
            $hashed = password_hash($password, PASSWORD_DEFAULT);

            $insert = pg_query_params($conn,
                "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4)",
                array($name, $email, $phone, $hashed)
            );

            if ($insert) {
                $success = "Account created successfully! You can now sign in.";
            } else {
                $error = "Something went wrong. Please try again.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Register - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="login.css" />
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
      <h1 class="login-title">Create Account</h1>
      <p class="login-sub">Join NexGear today</p>

      <?php if ($success != "") { ?>
        <p style="color:green; font-size:13px; margin-bottom:14px;"><?php echo $success; ?></p>
      <?php } ?>

      <?php if ($error != "") { ?>
        <p style="color:#dc3545; font-size:13px; margin-bottom:14px;"><?php echo $error; ?></p>
      <?php } ?>

      <form id="register-form" method="POST" action="register.php">

        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" name="name" id="reg-name" placeholder="Full Name" required />
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" name="email" id="reg-email" placeholder="you@example.com" required />
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" class="form-input" name="phone" id="reg-phone" placeholder="Phone Number" required />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" name="password" id="reg-password" placeholder="Min. 6 characters" required />
        </div>

        <button type="submit" class="login-btn">Create Account →</button>
      </form>

      <p class="login-footer">
        Already have an account? <a href="login.php">Sign In →</a>
      </p>

    </div>
  </div>

  <div id="toast-msg"></div>

  <script src="register.js"></script>
  <script src="ui.js"></script>

</body>
</html>
