<?php
session_start();
$_SESSION = array();
session_destroy();
if (isset($_COOKIE['remember_user'])) setcookie("remember_user", "", time() - 3600, "/");
if (isset($_COOKIE['remember_name']))  setcookie("remember_name",  "", time() - 3600, "/");
header("Location: login.php");
exit;
?>
