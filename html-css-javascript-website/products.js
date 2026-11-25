
// Get HTML elements
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const products = document.querySelectorAll(".product-card");
const noResults = document.getElementById("noResults");
const resultsCount = document.getElementById("resultsCount");

// Search and filter function
function filterProducts() {

    // Get search text
    const searchValue = searchInput.value.toLowerCase().trim();

    // Get selected category
    const selectedCategory = categoryFilter.value;

    let visibleProducts = 0;

    products.forEach(function(product) {

        // Get product information
        const name = product.querySelector("h2").textContent.toLowerCase();
        const description = product.querySelector(".product-description").textContent.toLowerCase();
        const category = product.dataset.category;

        // Check search match
        const matchesSearch =
            name.includes(searchValue) ||
            description.includes(searchValue);

        // Check category match
        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        // Display or hide product
        if (matchesSearch && matchesCategory) {
            product.style.display = "";
            visibleProducts++;
        } else {
            product.style.display = "none";
        }

    });

    // Update results count
    resultsCount.textContent =
        visibleProducts + " product(s) found";

    // Show message if no results
    noResults.style.display =
        visibleProducts === 0 ? "block" : "none";
}

// Listen for user actions
searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

// Display initial products count
filterProducts();
