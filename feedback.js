// validate feedback form before submitting
document.getElementById("feedbackForm").addEventListener("submit", function(e) {
  var fname   = document.getElementById("fname").value.trim();
  var email   = document.getElementById("femail").value.trim();
  var message = document.getElementById("fmessage").value.trim();

  if (fname == "") {
    e.preventDefault();
    alert("Please enter your first name.");
    return;
  }

  if (email == "" || !email.includes("@")) {
    e.preventDefault();
    alert("Please enter a valid email address.");
    return;
  }

  if (message == "") {
    e.preventDefault();
    alert("Please write a message before submitting.");
    return;
  }
});
