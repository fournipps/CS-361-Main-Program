const addBtn = document.getElementById("addBtn");
const itemsEl = document.getElementById("items");
const emptyState = document.getElementById("emptyState");

// Example product data (you can swap this for your own)
const product = {
  img: "pop-album-covers/mayhem-cover.png",
  name: "Lady Gaga - Mayhem",
  price: 29.99
};

function formatUSD(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function createItemRow({ img, name, price }) {
  const row = document.createElement("div");
  row.className = "item";
  row.innerHTML = `
    <img src="${img}" alt="${name}">
    <div class="meta">
      <div class="name">${name}</div>
      <div class="price">${formatUSD(price)}</div>
    </div>
    <div class="qty" aria-label="Quantity controls">
      <button type="button" class="dec" aria-label="Decrease quantity">−</button>
      <span class="count" aria-live="polite">1</span>
      <button type="button" class="inc" aria-label="Increase quantity">+</button>
    </div>
  `;

  // Quantity logic for this row
  const decBtn = row.querySelector(".dec");
  const incBtn = row.querySelector(".inc");
  const countEl = row.querySelector(".count");

  let qty = 1;

  function render() {
    countEl.textContent = String(qty);
  }

  decBtn.addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      counter--;
      updateCartDisplay();
      render();
    } else {
      counter--;
      updateCartDisplay();

      row.remove();

      if (itemsEl.querySelectorAll(".item").length === 0) {
        emptyState.style.display = "block";
      }
    }
  });

  incBtn.addEventListener("click", () => {
    qty++;
    counter++;
    updateCartDisplay();
    render();
  });

  render();
  return row;
}

addBtn.addEventListener("click", () => {
  // hide "No items yet."
  emptyState.style.display = "none";
  openCart();

  // add a new item row at the bottom
  const newRow = createItemRow(product);
  itemsEl.appendChild(newRow);

  // optional: scroll to the newly added item
  newRow.scrollIntoView({ behavior: "smooth", block: "end" });
});

const numberDisplay = document.getElementById('cart-quantity');
const incrementButton = document.getElementById('addBtn');

let counter = 0

function updateCartDisplay() {
  numberDisplay.textContent = counter;
}

incrementButton.addEventListener('click', function() {
  counter++;
  updateCartDisplay();

  emptyState.style.display = "none";
});