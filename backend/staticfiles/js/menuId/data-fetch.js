document.addEventListener("DOMContentLoaded", async function () {
  const productId = document.querySelector("#menu-item-container").getAttribute("data-menu-id"); 

  const skeleton = document.getElementById("loading-skeleton");
  const content = document.getElementById("menu-item-page-container");
  const errorContainer = document.getElementById("error-container");

  try {
    skeleton.style.display = "block";
    content.style.display = "none";
    const response = await fetch(`/api/menu/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    
    const product = await response.json();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    skeleton.style.display = "none";
    content.style.display = "block";

    document.getElementById("menu-item-page-title").textContent = product.name;
    document.getElementById("menu-item-page-image").src = product.image;
    document.getElementById("menu-item-page-price").textContent = product.price;
    document.getElementById("menu-item-page-description").textContent = product.description;

 
    const ingredientsList = document.getElementById("menu-item-page-ingredients");
    ingredientsList.innerHTML = product.types.map(type => `<li>${type}</li>`).join("");

    const nutritionContent = product.nutrition.map(nutrient => {
      const key = Object.keys(nutrient)[0];
      const value = nutrient[key];
      console.log(`<span>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</span>`)
      return `<span>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</span>`;
    }).join(", ");
    document.getElementById("menu-item-page-nutrition").innerHTML = nutritionContent;
  } catch (error) {

    skeleton.style.display = "none";
    content.style.display = "none";
    errorContainer.style.display = "block";
    document.getElementById("error-message").textContent = `Error: ${error.message}`;
  }


  document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "/menu";
  });

  document.getElementById("retry-button").addEventListener("click", function () {
    window.location.reload();
  });
});
