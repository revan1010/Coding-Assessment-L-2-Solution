function openCategory(evt, categoryName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(categoryName.toLowerCase()).style.display = "flex";
  evt.currentTarget.className += " active";
}

function fetchProductsAndDisplayDefaultCategory() {
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
  )
    .then((response) => response.json())
    .then((data) => {
      data.categories.forEach((category) => {
        const categoryName = category.category_name.toLowerCase();
        const categoryContainer = document.getElementById(categoryName);
        category.category_products.forEach((product) => {
          const productCard = `
            <div class="product-card">
            ${
              product.badge_text
                ? `<span class="product-badge">${product.badge_text}</span>`
                : ""
            }
              <img src="${product.image}" alt="${product.title}">
              <div class="product-details">
                <div class="title-vendor">
                  <h3>${truncateString(product.title, 20)}</h3>
                  <p class="vendor">${product.vendor}</p>
                </div>
                <div class="price-details">
                  <p class="price">$${product.price}</p>
                  <p class="compare-price">$${product.compare_at_price}</p>
                  <p class="discount">${calculateDiscount(
                    product.price,
                    product.compare_at_price
                  )}% off</p>
                </div>
              </div>
              <button>Add to Cart</button>
            </div>
          `;
          categoryContainer.insertAdjacentHTML("beforeend", productCard);
        });
      });
      // Show initial category (Men) by default
      openCategory(
        {
          currentTarget: document.querySelector(
            '.tab button[data-category="men"]'
          ),
        },
        "men"
      );
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Call the function to fetch products and display the default category
fetchProductsAndDisplayDefaultCategory();

function calculateDiscount(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) {
    return 0;
  }
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(discount);
}

function truncateString(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
}
