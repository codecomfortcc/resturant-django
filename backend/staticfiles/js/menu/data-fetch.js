
 const getMenu = async () => {
  const response = await fetch(`/api/menu/`);
  console.log(response);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log(data);
  return data;
};

let state = {
  searchTerm: "",
  sortBy: "name",
  products: [],
};

async function initMenu() {
  await fetchMenu();
  const urlParams = new URLSearchParams(window.location.search);
  state.searchTerm = urlParams.get('search') || "";
  state.sortBy = urlParams.get('sortBy') || "name";
  
  updateURL();
  focusSearchInput();
  document.addEventListener('change', handleSelectChange);
  document.addEventListener('click', handleSearchIconClick);
  document.addEventListener('keydown', handleEnterKeyPress);
  document.addEventListener('click', handleProductClick);
}

async function fetchMenu() {
  const data = await getMenu();
  state.products = data;
  render();
}

function handleEnterKeyPress(e) {
  if (e.key === 'Enter' && document.activeElement.classList.contains('search-input')) {
    e.preventDefault();
    handleSearch();
  }
}

function updateURL() {
  const url = `/menu?search=${encodeURIComponent(state.searchTerm)}&sortBy=${encodeURIComponent(state.sortBy)}`;
  window.history.replaceState(null, '', url);
}

function handleSearchIconClick(e) {
  if (e.target.classList.contains('search-icon')) {
    const searchInput = document.querySelector('.search-input');
    state.searchTerm = searchInput.value;
    updateURL();
    render();
  }
}

function handleSelectChange(e) {
  if (e.target.classList.contains('sort-select')) {
    state.sortBy = e.target.value;
    updateURL();
    render();
  }
}

function handleProductClick(e) {
  if (e.target.closest('.product-card')) {
    const productId = e.target.closest('.product-card').dataset.productId;
    window.location.href = `/menu/${productId}`; 
  }
}


function render() {
  const filteredProducts = state.products.filter((product) =>
    product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (state.sortBy === "name") return a.name.localeCompare(b.name);
    if (state.sortBy === "price") return a.price - b.price;
    return 0;
  });

  const productCards = filteredProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h2 class="product-name">${product.name}</h2>
      <p class="product-description">${product.description}</p>
      <p class="product-price">
        <ion-icon name="pricetag-outline"></ion-icon>
        ₹${product.price}
      </p>
    </div>
  `).join("");

  document.querySelector('.product-grid').innerHTML = productCards;
}


function focusSearchInput() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.focus();
  }
}

document.addEventListener("DOMContentLoaded", initMenu);
