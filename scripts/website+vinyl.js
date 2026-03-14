import products from "./vinyl-products.js";
import "./cart.js";

const listProduct = document.querySelector(".contentTab");
const genreSelect = document.getElementById("genreSelect");
const filterBtn = document.getElementById("filterBtn");
const showAllBtn = document.getElementById("showAllBtn");
const sortSelect = document.getElementById("sortSelect");
const sortBtn = document.getElementById("sortBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

/* Open when someone clicks on the hamburger icon */
window.openNav = function () {
  document.getElementById("myNav").style.width = "50%";
}

/* Close when someone clicks on the "x" symbol inside nav overlay */
window.closeNav = function () {
  document.getElementById("myNav").style.width = "0%";
}

let currentProducts = [...products];

// Renders any list of albums to the page
function renderProducts(items) {
  listProduct.innerHTML = "";

  if (!items || items.length === 0) {
    listProduct.innerHTML = "<p>No albums found.</p>";
    return;
  }

  items.forEach(product => {
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

// Ask backend to filter through the microservice
async function filterProductsByGenre(genre) {
  try {
    const response = await fetch("http://localhost:3000/api/filter-albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: products,
        genre: genre
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Filtering failed");
    }

    renderProducts(data.filteredItems);
  } catch (error) {
    console.error("Error filtering albums:", error);
    listProduct.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function sortProducts(sortOption) {
  try {
    const response = await fetch("http://localhost:3000/api/sort-albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: currentProducts,
        sortOption
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Sorting failed");
    }

    currentProducts = data.sortedItems;
    renderProducts(currentProducts);
  } catch (error) {
    console.error("Error sorting albums:", error);
    listProduct.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function searchProducts(searchTerm) {
  try {
    const response = await fetch("http://localhost:3000/api/search-albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: currentProducts,
        searchTerm
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Search failed");
    }

    currentProducts = data.searchedItems;
    renderProducts(currentProducts);
  } catch (error) {
    console.error("Error searching albums:", error);
    listProduct.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Filter button click
filterBtn.addEventListener("click", () => {
  const selectedGenre = genreSelect.value;

  if (!selectedGenre) {
    listProduct.innerHTML = "<p>Please select a genre.</p>";
    return;
  }

  filterProductsByGenre(selectedGenre);
});

// Show all products again
showAllBtn.addEventListener("click", () => {
  renderProducts(products);
});

sortBtn.addEventListener("click", () => {
  const selectedSort = sortSelect.value;

  if (!selectedSort) {
    listProduct.innerHTML = "<p>Please select a sort option.</p>";
    return;
  }

  sortProducts(selectedSort);
});

searchBtn.addEventListener("click", () => {
  const term = searchInput.value.trim();

  if (!term) {
    listProduct.innerHTML = "<p>Please enter an album or artist name.</p>";
    return;
  }

  searchProducts(term);
});

resetBtn.addEventListener("click", () => {
  genreSelect.value = "";
  sortSelect.value = "";
  searchInput.value = "";
  currentProducts = [...products];
  renderProducts(currentProducts);
});

renderProducts(currentProducts);