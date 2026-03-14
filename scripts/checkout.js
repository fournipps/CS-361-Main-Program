import products from "./vinyl-products.js";

const checkoutItems = document.getElementById("checkoutItems");
const checkoutItemCount = document.getElementById("checkoutItemCount");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const backToCartBtn = document.getElementById("backToCartBtn");

let cart = [];

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
}

function renderCheckoutItems() {
  if (!checkoutItems || !checkoutItemCount || !checkoutTotal) return;

  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your cart is empty.</p>";
    checkoutItemCount.textContent = "0";
    checkoutTotal.textContent = "$0";
    return;
  }

  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id == item.product_id);

    if (!product) return;

    const itemTotal = product.price * item.quantity;
    totalQuantity += item.quantity;
    totalPrice += itemTotal;

    const itemRow = document.createElement("div");
    itemRow.classList.add("checkoutItem");

    itemRow.innerHTML = `
      <div class="checkoutItemInfo">
        <img src="${product.image}" alt="${product.name}" width="60" />
        <div>
          <p><strong>${product.name}</strong></p>
          <p>${product.artist}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="checkoutItemPrice">
          $${itemTotal}.00
        </div>
      </div>
      
    `;

    checkoutItems.appendChild(itemRow);
  });

  checkoutItemCount.textContent = totalQuantity;
  checkoutTotal.textContent = `$${totalPrice}.00`;
}

if (backToCartBtn) {
  backToCartBtn.addEventListener("click", () => {
    window.location.href = "01-home-page.html"; 
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("Order placed!");

    localStorage.removeItem("cart");
    window.location.href = "index.html";
  });
}

renderCheckoutItems();