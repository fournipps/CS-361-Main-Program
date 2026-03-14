import products from "./vinyl-products.js";
import cart from "./cart.js";

let idProduct = new URLSearchParams(window.location.search).get('id');
let info = products.filter((value) => value.id == idProduct)[0];
if(!info){
  window.location.href= '01-home-page.html';
}
const checkOutBtn = document.querySelector(".checkOut");
let detail = document.querySelector('.detail');
detail.querySelector('.image img').src = info.image;
detail.querySelector('.name').innerText = info.name;
detail.querySelector('.price').innerText = '$'+ info.price;
detail.querySelector('.tracklist').innerText = info.tracklist;
detail.querySelector('.addCart').dataset.id = idProduct;

const listProduct = document.querySelector(".listProduct");
function renderProducts(items) {
  listProduct.innerHTML = "";

  if (!items || items.length === 0) {
    listProduct.innerHTML = "<p>No albums found.</p>";
    return;
  }

  items.filter((value) => value.id != idProduct).forEach(product => {
    const newProduct = document.createElement("div");
    newProduct.classList.add("item");

    newProduct.innerHTML = `

      <h2>${product.name}</h2>
      <a href="/detail.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name} cover"/>
      </a>
      <h3>${product.artist}</h3>
      <div class="price">$${product.price}</div>
      <button class="addCart"
        data-id="${product.id}">
        Add to Cart
      </button>
    `;

    listProduct.appendChild(newProduct);
  });
}

// Show all products on initial page load
renderProducts(products);

if (checkOutBtn) {
  checkOutBtn.addEventListener("click", () => {
    window.location.href = "checkout-page.html";
  });
}