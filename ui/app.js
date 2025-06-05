document.addEventListener('DOMContentLoaded', () => {
    // Customer view elements
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


    const checkoutView = document.getElementById('checkout-view');
    const checkoutForm = document.getElementById('checkout-form');
    const shippingAddressInput = document.getElementById('shipping-address');
    const paymentMethodInput = document.getElementById('payment-method');
    const cancelCheckoutButton = document.getElementById('cancel-checkout');




    // Admin view elements
    const showAdminLoginLink = document.getElementById('show-admin-login-link');
    const adminLoginView = document.getElementById('admin-login-view');
    const adminLoginForm = document.getElementById('admin-login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const cancelAdminLoginBtn = document.getElementById('cancel-admin-login-btn');
    const adminLoginError = document.getElementById('admin-login-error');
    const adminView = document.getElementById('admin-view');
    const generateSalesReportBtn = document.getElementById('generate-sales-report-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const salesReportContentElement = document.getElementById('sales-report-content');

    // Separators
    const catalogueCartSeparator = document.getElementById('catalogue-cart-separator');
    const cartAdminSeparator = document.getElementById('cart-admin-separator');
    const checkoutConfirmationSeparator = document.getElementById('checkout-confirmation-separator');

    let products = [];
    let cart = []; 
    let isAdminLoggedIn = false;

    // --- Utility Functions ---
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        toast.offsetHeight; 
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { document.body.removeChild(toast); }, 500);
        }, duration);
    }

    function showMainCustomerView() {
        catalogueView.classList.remove('hidden');
        cartView.classList.remove('hidden');
        catalogueCartSeparator.classList.remove('hidden');

        adminLoginView.classList.add('hidden');
        adminView.classList.add('hidden');
        confirmationView.classList.add('hidden');
        cartAdminSeparator.classList.add('hidden');
        checkoutConfirmationSeparator.classList.add('hidden');
        adminLoginError.style.display = 'none';
    }

    function showAdminLoginView() {
        catalogueView.classList.add('hidden');
        cartView.classList.add('hidden');
        confirmationView.classList.add('hidden');
        adminView.classList.add('hidden');
        catalogueCartSeparator.classList.add('hidden');
        cartAdminSeparator.classList.add('hidden');
        checkoutConfirmationSeparator.classList.add('hidden');
        
        adminLoginView.classList.remove('hidden');
        usernameInput.value = 'admin'; // Pre-fill for convenience
        passwordInput.value = 'password';
        adminLoginError.style.display = 'none';
    }

    function showAdminDashboardView() {
        catalogueView.classList.add('hidden');
        cartView.classList.add('hidden');
        confirmationView.classList.add('hidden');
        adminLoginView.classList.add('hidden');
        catalogueCartSeparator.classList.add('hidden');
        checkoutConfirmationSeparator.classList.add('hidden');

        adminView.classList.remove('hidden');
        cartAdminSeparator.classList.remove('hidden'); // Show separator above admin view
        salesReportContentElement.innerHTML = '<p>Click the button above to generate the sales report.</p>';
    }
    
    function showConfirmationView() {
        catalogueView.classList.add('hidden');
        cartView.classList.add('hidden');
        adminLoginView.classList.add('hidden');
        adminView.classList.add('hidden');
        catalogueCartSeparator.classList.add('hidden');
        cartAdminSeparator.classList.add('hidden');

        confirmationView.classList.remove('hidden');
        checkoutConfirmationSeparator.classList.remove('hidden');
    }

    // --- Product Loading & Rendering (existing code from previous step, slightly adapted if needed) ---
    async function fetchProducts() {
        try {
            const response = await fetch('../src/data/products.json'); 
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            productListElement.innerHTML = '<p>Error loading products. Please try refreshing.</p>';
        }
    }

    function renderProducts() {
        productListElement.innerHTML = ''; 
        if (!products || products.length === 0) {
            productListElement.innerHTML = '<p>No products available.</p>';
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
        document.querySelectorAll('.add-to-cart-btn').forEach(button => button.addEventListener('click', handleAddToCart));
    }

    // --- Cart Management (existing code from previous step, slightly adapted if needed) ---
    function handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        const product = products.find(p => p.id === productId);
        if (product && product.stock > 0) {
            const cartItem = cart.find(item => item.product.id === productId);
            const productInCatalogue = products.find(p => p.id === productId);
            const currentStock = productInCatalogue ? productInCatalogue.stock : 0;

            if (cartItem) {
                if (cartItem.quantity < currentStock) {
                    cartItem.quantity++;
                    showToast(`${product.name} quantity updated.`);
                } else {
                    showToast(`Max stock (${currentStock}) reached for ${product.name}.`);
                    return;
                }
            } else {
                cart.push({ product: { ...product }, quantity: 1 });
                showToast(`${product.name} added to cart.`);
            }
            renderCart();
        } else if (product) {
             showToast(`${product.name} is out of stock.`);
        }
    }

    function renderCart() {
        cartItemsElement.innerHTML = ''; 
        if (cart.length === 0) {
            cartItemsElement.appendChild(emptyCartMessage);
            emptyCartMessage.style.display = 'block';
            checkoutButton.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            const table = document.createElement('table');
            table.innerHTML = `<thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Actions</th></tr></thead><tbody></tbody>`;
            const tbody = table.querySelector('tbody');
            cart.forEach(item => {
                const productInCatalogue = products.find(p => p.id === item.product.id);
                const currentStock = productInCatalogue ? productInCatalogue.stock : 0;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.product.name}</td>
                    <td>$${item.product.price.toFixed(2)}</td>
                    <td><input type="number" class="cart-item-qty" value="${item.quantity}" min="1" max="${currentStock}" data-product-id="${item.product.id}"></td>
                    <td>$${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td><button class="btn btn-danger remove-from-cart-btn" data-product-id="${item.product.id}">Remove</button></td>
                `;
                tbody.appendChild(tr);
            });
            cartItemsElement.appendChild(table);
            checkoutButton.disabled = false;
        }
        updateCartTotal();
        document.querySelectorAll('.cart-item-qty').forEach(input => input.addEventListener('change', handleUpdateQuantity));
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => button.addEventListener('click', handleRemoveFromCart));
    }

    function handleUpdateQuantity(event) {
        const productId = event.target.dataset.productId;
        let newQuantity = parseInt(event.target.value);
        const cartItem = cart.find(item => item.product.id === productId);
        const productInCatalogue = products.find(p => p.id === productId);
        const stock = productInCatalogue ? productInCatalogue.stock : 0;

        if (cartItem) {
            if (newQuantity <= 0) {
                newQuantity = 1; 
                event.target.value = 1; 
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
            showToast(`${cart[itemIndex].product.name} removed from cart.`);
            cart.splice(itemIndex, 1);
            renderCart();
        }
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
    }

    // --- Checkout & Confirmation (existing code, adapted for view switching) ---
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty.');
            return;
        }
        for (const item of cart) {
            const productInCatalogue = products.find(p => p.id === item.product.id);
            if (!productInCatalogue || productInCatalogue.stock < item.quantity) {
                showToast(`Error: Insufficient stock for ${item.product.name}. Available: ${productInCatalogue ? productInCatalogue.stock : 0}.`);
                return;
            }
        }
        const mockOrderId = `AWE-GUI-${Date.now()}`;
        cart.forEach(cartItem => {
            const productInStore = products.find(p => p.id === cartItem.product.id);
            if (productInStore) productInStore.stock -= cartItem.quantity;
        });
        renderProducts();
        confOrderId.textContent = mockOrderId;
        confOrderStatus.textContent = 'Confirmed (Simulated)';
        confOrderTotal.textContent = cartTotalElement.textContent;
        confOrderItems.innerHTML = cart.map(item => `<li>${item.product.name} x${item.quantity}</li>`).join('');
        confPaymentStatus.textContent = 'Payment Successful (Simulated)';
        confShipmentTracking.textContent = `TRK-GUI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        showConfirmationView();
        showToast('Order placed successfully!');
        cart = []; 
        renderCart(); 
    });

    newOrderButton.addEventListener('click', () => {
        showMainCustomerView();
    });

    // --- Admin Login Logic ---
    showAdminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAdminLoginView();
    });

    cancelAdminLoginBtn.addEventListener('click', () => {
        showMainCustomerView();
    });

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (username === 'admin' && password === 'password') {
            isAdminLoggedIn = true;
            showAdminDashboardView();
            showToast('Admin login successful!');
            adminLoginError.style.display = 'none';
        } else {
            adminLoginError.textContent = 'Invalid username or password.';
            adminLoginError.style.display = 'block';
            showToast('Admin login failed.', 4000);
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        showMainCustomerView();
        showToast('Admin logged out.');
    });

    // --- Sales Report Logic ---
    async function fetchOrders() {
        try {
            const response = await fetch('../src/data/orders.json');
            if (!response.ok) {
                // If orders.json doesn't exist, it's not an error for reporting, just means no data.
                if (response.status === 404) return []; 
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            showToast('Could not load order data for report.', 4000);
            return [];
        }
    }

    function calculateSalesReportData(ordersData) {
        const confirmedOrders = ordersData.filter(order => order.status === 'confirmed' && order.payment && order.payment.success);
        
        const totalRevenue = confirmedOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const orderCount = confirmedOrders.length;
        
        const productCounts = {};
        confirmedOrders.forEach(order => {
            order.items.forEach(item => {
                const productName = item.product && item.product.name ? item.product.name : `Product ID ${item.product_id || 'Unknown'}`;
                productCounts[productName] = (productCounts[productName] || 0) + item.quantity;
            });
        });
        const topProducts = Object.entries(productCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5) // Top 5 products
            .map(([name, units]) => ({ name, units }));

        const salesByDay = {};
        confirmedOrders.forEach(order => {
            const date = order.payment && order.payment.timestamp ? new Date(order.payment.timestamp).toISOString().split('T')[0] : 'Unknown Date';
            salesByDay[date] = (salesByDay[date] || 0) + parseFloat(order.total);
        });
        for (const date in salesByDay) {
            salesByDay[date] = parseFloat(salesByDay[date].toFixed(2));
        }

        return { totalRevenue, orderCount, topProducts, salesByDay, rawOrderCount: ordersData.length, confirmedOrderCount: confirmedOrders.length };
    }

    function renderSalesReport(reportData) {
        salesReportContentElement.innerHTML = ''; // Clear previous
        const { totalRevenue, orderCount, topProducts, salesByDay, rawOrderCount, confirmedOrderCount } = reportData;

        if (rawOrderCount === 0) {
            salesReportContentElement.innerHTML = '<p>No order data file found or it is empty. Cannot generate report.</p>';
            return;
        }
        if (confirmedOrderCount === 0) {
            salesReportContentElement.innerHTML = '<p>No confirmed sales data available to report.</p>';
            return;
        }

        let html = `<h3>Sales Report (${new Date().toLocaleDateString()})</h3>`;
        html += `<p>Total Confirmed Orders: ${orderCount}</p>`;
        html += `<p>Total Revenue from Confirmed Orders: $${totalRevenue.toFixed(2)}</p>`;
        
        html += '<h4>Top Selling Products (by quantity):</h4>';
        if (topProducts.length > 0) {
            html += '<ul>';
            topProducts.forEach(p => { html += `<li>${p.name} &mdash; ${p.units} units</li>`; });
            html += '</ul>';
        } else {
            html += '<p>No product sales data from confirmed orders.</p>';
        }

        html += '<h4>Revenue by Day (from confirmed orders):</h4>';
        const sortedDays = Object.keys(salesByDay).sort();
        if (sortedDays.length > 0) {
            html += '<ul>';
            sortedDays.forEach(day => { html += `<li>${day}: $${salesByDay[day].toFixed(2)}</li>`; });
            html += '</ul>';
        } else {
            html += '<p>No daily sales data from confirmed orders.</p>';
        }
        salesReportContentElement.innerHTML = html;
    }

    generateSalesReportBtn.addEventListener('click', async () => {
        if (!isAdminLoggedIn) {
            showToast('You must be logged in as admin to generate reports.', 4000);
            showAdminLoginView();
            return;
        }
        salesReportContentElement.innerHTML = '<p><em>Generating sales report...</em></p>';
        const orders = await fetchOrders();
        const reportData = calculateSalesReportData(orders);
        renderSalesReport(reportData);
    });

    // --- Initial Load & View Setup ---
    showMainCustomerView(); // Start with customer view
    fetchProducts();
    renderCart(); 
}); 