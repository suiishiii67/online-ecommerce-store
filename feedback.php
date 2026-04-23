<?php
session_start();
if(!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}
$conn = pg_connect("host=localhost dbname=wpl_lab user=postgres password=1234");

$success = "";
$error   = "";

// handle contact form submission and save to database
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = trim($_POST["first_name"]) . " " . trim($_POST["last_name"]);
    $email   = trim($_POST["email"]);
    $message = trim($_POST["message"]);

    if (trim($_POST["first_name"]) == "" || trim($_POST["last_name"]) == "" || $email == "" || $message == "") {
        $error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {
        $insert = pg_query_params($conn,
            "INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)",
            array($name, $email, $message)
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
  <style>
    .contact-layout { display: grid; grid-template-columns: 1fr 240px; gap: 24px; }
    .contact-form-box { border: 1px solid #ddd; border-radius: 8px; padding: 24px; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .contact-info { display: flex; flex-direction: column; gap: 12px; }
    .info-card { border: 1px solid #ddd; border-radius: 8px; padding: 14px; }
    .info-icon { font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; margin-bottom: 6px; }
    .info-card h3 { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
    .info-card p { font-size: 13px; color: #666; line-height: 1.5; }
  </style>
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
      <form class="nav-search" action="products.php" method="get">
        <input type="text" name="search" placeholder="Search products...">
        <button type="submit">Search</button>
      </form>
      <div class="nav-actions">
        <span style="font-size:13px; color:#333;">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?></span>
        <a href="logout.php" class="btn-primary">Sign Out</a>
      </div>
    </div>
  </nav>

  <div class="page-wrapper">

    <div class="breadcrumb">
      <a href="home.php">Home</a> <span>/</span> Contact Us
    </div>

    <h1 class="page-title">Get in Touch</h1>
    <p style="color:#666; font-size:14px; margin-bottom:24px;">We're here to help. Send a message and we'll reply within 24 hours.</p>

    <div class="contact-layout">

      <div class="contact-form-box">
        <h2 style="font-size:17px; font-weight:bold; margin-bottom:18px;">Send a Message</h2>

        <?php if ($success != "") { ?>
          <p style="color:green; font-size:13px; margin-bottom:12px;"><?php echo $success; ?></p>
        <?php } ?>
        <?php if ($error != "") { ?>
          <p style="color:#dc3545; font-size:13px; margin-bottom:12px;"><?php echo $error; ?></p>
        <?php } ?>

        <form method="POST" action="feedback.php" id="feedbackForm">

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" class="form-input" id="fname" name="first_name" placeholder="First Name" required />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-input" name="last_name" placeholder="Last Name" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" id="femail" name="email" placeholder="you@example.com" required />
          </div>

          <div class="form-group">
            <label class="form-label">Order ID (optional)</label>
            <input type="text" class="form-input" name="order_id" placeholder="NGR-2025-XXXX" />
          </div>

          <div class="form-group">
            <label class="form-label">Your Message</label>
            <textarea class="form-textarea" id="fmessage" name="message" rows="5" placeholder="How can we help you?" required></textarea>
          </div>

          <button type="submit" class="btn-primary" style="padding:10px 24px; border-radius:8px; font-size:14px;">Submit</button>

        </form>
      </div>

      <div class="contact-info">
        <div class="info-card">
          <div class="info-icon">Address</div>
          <h3>Our Office</h3>
          <p>42 Tech Park, Whitefield<br>Bengaluru, 560066</p>
        </div>
        <div class="info-card">
          <div class="info-icon">Email</div>
          <h3>Email</h3>
          <p>support@nexgear.in</p>
        </div>
        <div class="info-card">
          <div class="info-icon">Phone</div>
          <h3>Phone</h3>
          <p>+91 98765 43210</p>
        </div>
        <div class="info-card">
          <div class="info-icon">Hours</div>
          <h3>Working Hours</h3>
          <p>Mon – Sat: 9 AM to 6 PM</p>
        </div>
      </div>

    </div>
  </div>

  <footer>
    <p>© 2025 NexGear. All rights reserved.</p>
  </footer>

<script src="feedback.js"></script>
</body>
</html>
