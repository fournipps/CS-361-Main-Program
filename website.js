/* Open when someone clicks on the hamburger icon */
function openNav() {
  document.getElementById("myNav").style.width = "50%";
}

/* Open when someone clicks on the cart icon */
function openCart () {
  document.getElementById("myCart").style.width = "50%";
}

/* Close when someone clicks on the "x" symbol inside nav overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

/* Close when someone clicks on the "x" symbol inside cart overlay */
function closeCart() {
  document.getElementById("myCart").style.width = "0%";
}

function goBack() {
  window.history.back();
}

