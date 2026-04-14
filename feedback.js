// feedback.js
// Handles the contact form submit - no backend, just shows a thank you message

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault(); // stop actual form submission

  var fname   = document.getElementById("cfname").value.trim();
  var email   = document.getElementById("cemail").value.trim();
  var message = document.getElementById("cmessage").value.trim();

  // Basic checks
  if (fname === "") {
    showToast("Please enter your first name.");
    return;
  }
  if (email === "" || !email.includes("@")) {
    showToast("Please enter a valid email address.");
    return;
  }
  if (message === "") {
    showToast("Please write a message before submitting.");
    return;
  }

  // All good! Show a thank you message
  showToast("Message sent! We'll get back to you within 24 hours.");

  // Clear the form
  this.reset();
});
