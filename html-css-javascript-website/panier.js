// ==========================================
// SWEET DELIGHTS - CART PAGE INTERFACE (A5)
// Uses the Cart functions from cart.js (B4)
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const emptyCart = document.getElementById("emptyCart");
    const cartContent = document.getElementById("cartContent");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCartBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (!emptyCart || !cartContent || !cartItems) {
        console.error("Some required HTML elements are missing.");
        return;
    }

    if (typeof Cart === "undefined") {
        console.error("Cart is not loaded. Check that cart.js loads before panier.js.");
        return;
    }

    // Small helper to create an element safely (no innerHTML)
    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text !== undefined) {
            element.textContent = text;
        }
        return element;
    }

    function formatPrice(value) {
        return Number(value).toFixed(2) + " TND";
    }

    // ======================================
    // BUILD ONE CART ITEM
    // ======================================

    function createCartItem(item) {

        const li = createElement("li", "cart-item");
        li.dataset.id = item.id;

        // Image (or emoji placeholder for customized sweets)
        if (item.image) {
            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            image.className = "cart-item-image";
            image.onerror = function () {
                this.alt = "Product image unavailable";
            };
            li.appendChild(image);
        } else {
            li.appendChild(createElement("div", "cart-item-image cart-item-placeholder", "🍰"));
        }

        // Name, details and unit price
        const info = createElement("div", "cart-item-info");
        info.appendChild(createElement("h3", "", item.name));

        if (item.details) {
            info.appendChild(createElement("p", "cart-item-details", item.details));
        }

        info.appendChild(createElement("p", "cart-item-price", formatPrice(item.price)));
        li.appendChild(info);

        // Quantity controls
        const quantityBox = createElement("div", "cart-qty");

        const minus = createElement("button", "cart-qty-btn", "−");
        minus.type = "button";
        minus.dataset.action = "decrease";
        minus.setAttribute("aria-label", "Decrease quantity of " + item.name);
        minus.disabled = item.quantity <= 1;

        const quantity = createElement("span", "cart-qty-value", String(item.quantity));

        const plus = createElement("button", "cart-qty-btn", "+");
        plus.type = "button";
        plus.dataset.action = "increase";
        plus.setAttribute("aria-label", "Increase quantity of " + item.name);
        plus.disabled = item.quantity >= Cart.MAX_QUANTITY;

        quantityBox.appendChild(minus);
        quantityBox.appendChild(quantity);
        quantityBox.appendChild(plus);
        li.appendChild(quantityBox);

        // Line total
        li.appendChild(
            createElement("p", "cart-line-total", formatPrice(item.price * item.quantity))
        );

        // Remove button
        const remove = createElement("button", "cart-remove", "Remove");
        remove.type = "button";
        remove.dataset.action = "remove";
        remove.setAttribute("aria-label", "Remove " + item.name + " from the cart");
        li.appendChild(remove);

        return li;
    }

    // ======================================
    // DISPLAY THE WHOLE CART
    // ======================================

    function renderCart() {

        const cart = Cart.getCart();

        if (cart.length === 0) {
            emptyCart.hidden = false;
            cartContent.hidden = true;
            return;
        }

        emptyCart.hidden = true;
        cartContent.hidden = false;

        cartItems.innerHTML = "";

        cart.forEach(item => {
            cartItems.appendChild(createCartItem(item));
        });

        cartCount.textContent = Cart.getCount();
        cartTotal.textContent = formatPrice(Cart.getTotal());
    }

    // ======================================
    // BUTTON ACTIONS (+, -, remove)
    // ======================================

    cartItems.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const itemElement = button.closest(".cart-item");
        const id = itemElement.dataset.id;
        const item = Cart.getCart().find(entry => entry.id === id);

        if (!item) {
            return;
        }

        switch (button.dataset.action) {

            case "increase":
                Cart.updateQuantity(id, item.quantity + 1);
                break;

            case "decrease":
                Cart.updateQuantity(id, item.quantity - 1);
                break;

            case "remove":
                Cart.removeFromCart(id);
                break;
        }
    });

    clearCartBtn.addEventListener("click", function () {
        if (confirm("Remove all items from your cart?")) {
            Cart.clearCart();
        }
    });

    checkoutBtn.addEventListener("click", function () {

        const total = formatPrice(Cart.getTotal());

        alert(
            "Thank you for your order! ❤️\n\n" +
            "Total: " + total + "\n\n" +
            "We will start preparing your sweets right away."
        );

        Cart.clearCart();
    });

    // ======================================
    // KEEP THE PAGE UP TO DATE
    // ======================================

    // Fired by Cart.saveCart() after every change
    window.addEventListener("cartUpdated", renderCart);

    // Fired when the cart changes in another browser tab
    window.addEventListener("storage", function (event) {
        if (event.key === "cart") {
            renderCart();
        }
    });

    renderCart();

});