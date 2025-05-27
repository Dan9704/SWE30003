document.addEventListener('DOMContentLoaded', () => {
    const productListElement = document.getElementById('product-list');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    
    const catalogueView = document.getElementById('catalogue-view');
    const cartView = document.getElementById('cart-view');
    const confirmationView = document.getElementById('confirmation-view');

    const confOrderId = document.getElementById('conf-order-id');
    const confOrderStatus = document.getElementById('conf-order-status');
    const confOrderTotal = document.getElementById('conf-order-total');
    const confOrderItems = document.getElementById('conf-order-items');
    const confPaymentStatus = document.getElementById('conf-payment-status');
    const confShipmentTracking = document.getElementById('conf-shipment-tracking');
    const newOrderButton = document.getElementById('new-order-button');

    let products = [];
    let cart = []; // In-memory cart: [{ product: {}, quantity: N }, ...]

    // --- Utility Functions ---
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        // Trigger reflow to enable CSS transition
        toast.offsetHeight; 
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500); // Wait for fade out transition
        }, 3000); // Show toast for 3 seconds
    }

    // --- Product Loading ---
    async function fetchProducts() {
        try {
            // Adjust the path if your products.json is elsewhere relative to index.html
            const response = await fetch('../src/data/products.json'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            productListElement.innerHTML = '<p>Error loading products. Please try refreshing the page.</p>';
        }
    }

    function renderProducts() {
        productListElement.innerHTML = ''; // Clear existing products
        if (!products || products.length === 0) {
            productListElement.innerHTML = '<p>No products available at the moment.</p>';
            return;
        }
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h4>${product.name}</h4>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Stock: <span id="stock-${product.id}">${product.stock}</span></p>
                <p>Category: ${product.category}</p>
                <button class="btn add-to-cart-btn" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            `;
            productListElement.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    }

    // --- Cart Management ---
    function handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        const product = products.find(p => p.id === productId);

        if (product && product.stock > 0) {
            const cartItem = cart.find(item => item.product.id === productId);
            if (cartItem) {
                if (cartItem.quantity < product.stock) {
                    cartItem.quantity++;
                    showToast(`${product.name} quantity updated in cart.`);
                } else {
                    showToast(`Max stock reached for ${product.name}.`);
                    return;
                }
            } else {
                cart.push({ product: { ...product, stock: product.stock }, quantity: 1 }); // Store a copy of product data
                showToast(`${product.name} added to cart.`);
            }
            renderCart();
        } else if (product && product.stock === 0) {
             showToast(`${product.name} is out of stock.`);
        }
    }

    function renderCart() {
        cartItemsElement.innerHTML = ''; // Clear existing cart items
        if (cart.length === 0) {
            cartItemsElement.appendChild(emptyCartMessage);
            emptyCartMessage.style.display = 'block';
            checkoutButton.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');
            cart.forEach(item => {
                const productInCatalogue = products.find(p => p.id === item.product.id);
                const currentStock = productInCatalogue ? productInCatalogue.stock : 0;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.product.name}</td>
                    <td>$${item.product.price.toFixed(2)}</td>
                    <td>
                        <input type="number" class="cart-item-qty" value="${item.quantity}" 
                               min="1" max="${currentStock}" data-product-id="${item.product.id}">
                    </td>
                    <td>$${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td><button class="btn btn-danger remove-from-cart-btn" data-product-id="${item.product.id}">Remove</button></td>
                `;
                tbody.appendChild(tr);
            });
            cartItemsElement.appendChild(table);
            checkoutButton.disabled = false;
        }
        updateCartTotal();

        document.querySelectorAll('.cart-item-qty').forEach(input => {
            input.addEventListener('change', handleUpdateQuantity);
            // Also listen for 'input' for more real-time feedback if desired, but 'change' is usually sufficient
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', handleRemoveFromCart);
        });
    }

    function handleUpdateQuantity(event) {
        const productId = event.target.dataset.productId;
        let newQuantity = parseInt(event.target.value);
        const cartItem = cart.find(item => item.product.id === productId);
        const productInCatalogue = products.find(p => p.id === productId);
        const stock = productInCatalogue ? productInCatalogue.stock : 0;

        if (cartItem) {
            if (newQuantity <= 0) {
                // PRD: "Allow 0 (interpreted as remove)"
                // For simplicity in GUI, let's treat 0 as remove, or enforce min 1 and use remove button
                // Here, if user types 0, we set to 1 or remove. Let's enforce min 1 in input, and use remove button.
                newQuantity = 1; 
                event.target.value = 1; // Correct input field
                showToast('Quantity must be at least 1. Use Remove button to delete.');
            }
            if (newQuantity > stock) {
                newQuantity = stock;
                event.target.value = stock;
                showToast(`Cannot exceed available stock (${stock}) for ${cartItem.product.name}.`);
            }
            cartItem.quantity = newQuantity;
            showToast(`${cartItem.product.name} quantity updated.`);
            renderCart(); 
        }
    }

    function handleRemoveFromCart(event) {
        const productId = event.target.dataset.productId;
        const itemIndex = cart.findIndex(item => item.product.id === productId);
        if (itemIndex > -1) {
            const removedItemName = cart[itemIndex].product.name;
            cart.splice(itemIndex, 1);
            showToast(`${removedItemName} removed from cart.`);
            renderCart();
        }
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
    }

    // --- Checkout & Confirmation ---
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty. Add items before checking out.');
            return;
        }

        // Simulate stock validation
        for (const item of cart) {
            const productInCatalogue = products.find(p => p.id === item.product.id);
            if (!productInCatalogue || productInCatalogue.stock < item.quantity) {
                showToast(`Error: Insufficient stock for ${item.product.name}. Available: ${productInCatalogue ? productInCatalogue.stock : 0}. Please update your cart.`);
                // Highlight the problematic item in cart (optional advanced feature)
                return; // Stop checkout
            }
        }

        // Simulate successful checkout & order creation (no backend connection)
        const mockOrderId = `AWE-GUI-${Date.now()}`;
        const mockPaymentStatus = 'Payment Successful (Simulated)';
        const mockShipmentTracking = `TRK-GUI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Update stock in the frontend `products` array and re-render catalogue
        cart.forEach(cartItem => {
            const productInStore = products.find(p => p.id === cartItem.product.id);
            if (productInStore) {
                productInStore.stock -= cartItem.quantity;
            }
        });
        renderProducts(); // Re-render to show updated stock

        // Populate confirmation screen
        confOrderId.textContent = mockOrderId;
        confOrderStatus.textContent = 'Confirmed';
        confOrderTotal.textContent = cartTotalElement.textContent;
        confOrderItems.innerHTML = cart.map(item => `<li>${item.product.name} x${item.quantity}</li>`).join('');
        confPaymentStatus.textContent = mockPaymentStatus;
        confShipmentTracking.textContent = mockShipmentTracking;

        // Switch views
        catalogueView.classList.add('hidden');
        cartView.classList.add('hidden');
        confirmationView.classList.remove('hidden');
        
        showToast('Order placed successfully!');
        cart = []; // Clear cart
        renderCart(); // Update cart display (should be empty)
    });

    newOrderButton.addEventListener('click', () => {
        confirmationView.classList.add('hidden');
        catalogueView.classList.remove('hidden');
        cartView.classList.remove('hidden');
        // Products should have been re-rendered with updated stock already
    });

    // --- Initial Load ---
    fetchProducts();
    renderCart(); // Initial render for empty cart message
}); 