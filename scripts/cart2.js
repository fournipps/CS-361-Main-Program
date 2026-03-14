import products from "./cd-products.js";

const iconCart = document.querySelector(".icon-cart");
const closeBtn = document.querySelector(".cartTab .close");
const body = document.querySelector("body");
let cart = [];

const updateCartTotal = async () => {
  const cartTotalHTML = document.getElementById("cartTotal");
  if (!cartTotalHTML) return;

  try {
    const itemsForTotal = cart.map(item => {
      const product = products.find(value => value.id == item.product_id);

      return {
        price: product ? product.price : 0,
        quantity: item.quantity
      };
    });

    const response = await fetch("http://localhost:3000/api/cart-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: itemsForTotal
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to calculate cart total");
    }

    cartTotalHTML.textContent = `$${data.totalPrice}`;
  } catch (error) {
    console.error("Error updating cart total:", error);
    cartTotalHTML.textContent = "Error";
  }
};

const setProductInCart = (idProduct, quantity, position) => {
  if (quantity > 0) {
    if (position < 0) {
      cart.push({
        product_id: idProduct,
        quantity: quantity
      });
    } else {
      cart[position].quantity = quantity;
    }
  } else {
    cart.splice(position, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  refreshCartHTML();
};

const refreshCartHTML = () => {
  const listHTML = document.querySelector(".listCart");
  const totalHTML = document.querySelector(".icon-cart span");

  if (!listHTML || !totalHTML) return;

  let totalQuantity = 0;
  listHTML.innerHTML = "";

  cart.forEach(item => {
    totalQuantity += item.quantity;

    const position = products.findIndex(value => value.id == item.product_id);
    const info = products[position];

    if (!info) return;

    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.innerHTML = `
      <div class="image">
        <img src="${info.image}" />
      </div>
      <div class="name">${info.name}</div>
      <div class="totalPrice">$${info.price * item.quantity}</div>
      <div class="quantity">
        <button class="minus" data-id="${info.id}">-</button>
        <span>${item.quantity}</span>
        <button class="plus" data-id="${info.id}">+</button>
      </div>
    `;

    listHTML.appendChild(newItem);
  });

  totalHTML.innerHTML = totalQuantity;
  updateCartTotal();
};

if (iconCart) {
  iconCart.addEventListener("click", () => {
    body.classList.toggle("activeTabCart");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    body.classList.toggle("activeTabCart");
  });
}

document.addEventListener("click", event => {
  const buttonClick = event.target;
  const idProduct = buttonClick.dataset.id;

  if (!idProduct) return;

  const position = cart.findIndex(value => value.product_id == idProduct);
  let quantity = position < 0 ? 0 : cart[position].quantity;

  if (
    buttonClick.classList.contains("addCart") ||
    buttonClick.classList.contains("plus")
  ) {
    quantity++;
    setProductInCart(idProduct, quantity, position);
  } else if (buttonClick.classList.contains("minus")) {
    quantity--;
    setProductInCart(idProduct, quantity, position);
  }
});

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
}

refreshCartHTML();

export default cart;