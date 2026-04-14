document.getElementById("contact-form").addEventListener("submit", function(e) {
  var fname = document.getElementById("cfname").value.trim();
  var email = document.getElementById("cemail").value.trim();
  var message = document.getElementById("cmessage").value.trim();

  if (fname === "") {
    e.preventDefault();
    showToast("Please enter your first name.");
    return;
  }

  if (email === "" || !email.includes("@")) {
    e.preventDefault();
    showToast("Please enter a valid email address.");
    return;
  }

  if (message === "") {
    e.preventDefault();
    showToast("Please write a message before submitting.");
    return;
  }
});
