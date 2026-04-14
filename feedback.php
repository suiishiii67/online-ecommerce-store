<?php
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");

$success = "";
$error   = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first_name = trim($_POST["first_name"]);
    $last_name  = trim($_POST["last_name"]);
    $email      = trim($_POST["email"]);
    $order_id   = trim($_POST["order_id"]);
    $message    = trim($_POST["message"]);

    if ($first_name == "" || $last_name == "" || $email == "" || $message == "") {
        $error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {
        $insert = pg_query_params($conn,
            "INSERT INTO feedback (first_name, last_name, email, order_id, message) VALUES ($1, $2, $3, $4, $5)",
            array($first_name, $last_name, $email, $order_id, $message)
        );

        if ($insert) {
            $success = "Thank you! Your message has been sent.";
        } else {
            $error = "Something went wrong. Please try again.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Us - NexGear</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="feedback.css" />
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
        <li><a href="feedback.php" class="active">Contact Us</a></li>
      </ul>
      <div class="nav-actions">
        <a href="login.php" class="btn-primary">Sign In</a>
      </div>
    </div>
  </nav>

  <div class="page-wrapper">

    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span> Contact Us
    </div>

    <h1 class="page-title">Get in Touch</h1>
    <p style="color:#6e6e73; font-size:14px; margin-bottom:30px;">We're here to help. Send a message and we'll reply within 24 hours.</p>

    <div class="contact-layout">

      <!-- Contact Form -->
      <div class="contact-form-box">
        <h2 style="font-size:18px; font-weight:700; margin-bottom:20px;">Send a Message</h2>

        <?php if ($success != "") { ?>
          <p style="color:green; font-size:13px; margin-bottom:14px;"><?php echo $success; ?></p>
        <?php } ?>
        <?php if ($error != "") { ?>
          <p style="color:#dc3545; font-size:13px; margin-bottom:14px;"><?php echo $error; ?></p>
        <?php } ?>

        <form id="contact-form" method="POST" action="feedback.php">

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" class="form-input" name="first_name" id="cfname" placeholder="First Name" required />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-input" name="last_name" id="clname" placeholder="Last Name" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" name="email" id="cemail" placeholder="you@example.com" required />
          </div>

          <div class="form-group">
            <label class="form-label">Order ID (optional)</label>
            <input type="text" class="form-input" name="order_id" id="corderid" placeholder="NGR-2025-XXXX" />
          </div>

          <div class="form-group">
            <label class="form-label">Your Message</label>
            <textarea class="form-textarea" name="message" id="cmessage" rows="5" placeholder="How can we help you?" required></textarea>
          </div>

          <button type="submit" class="btn-primary" style="padding:12px 28px; border-radius:8px; font-size:15px;">Submit</button>

        </form>
      </div>

      <!-- Contact Info -->
      <div class="contact-info">
        <div class="info-card">
          <div class="info-icon">📍</div>
          <h3>Our Office</h3>
          <p>42 Tech Park, Whitefield<br>Bengaluru, 560066</p>
        </div>
        <div class="info-card">
          <div class="info-icon">📧</div>
          <h3>Email</h3>
          <p>support@nexgear.in</p>
        </div>
        <div class="info-card">
          <div class="info-icon">📞</div>
          <h3>Phone</h3>
          <p>+91 98765 43210</p>
        </div>
        <div class="info-card">
          <div class="info-icon">🕐</div>
          <h3>Working Hours</h3>
          <p>Mon – Sat: 9 AM to 6 PM</p>
        </div>
      </div>

    </div>
  </div>

  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>

  <div id="toast-msg"></div>

  <script src="feedback.js"></script>
  <script src="ui.js"></script>

</body>
</html>
