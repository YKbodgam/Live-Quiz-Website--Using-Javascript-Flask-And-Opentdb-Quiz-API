const form = document.querySelector("form"),
  statusTxt = form.querySelector(".button-area span");

function handleSubmit() {
  // Displaying a loading message
  statusTxt.style.color = "#0D6EFD";
  statusTxt.style.display = "block";
  statusTxt.innerText = "Sending your message...";

  // Disabling the form during submission
  
  // You can add your form validation logic here if needed

  return false;// Replace "index.html" with the actual homepage URL
  //  Prevents the form from submitting in the traditional way
}

function gohome() {
  window.location.href = "../index.html"; // Replace "index.html" with the actual homepage URL
  return false;
}