document.getElementById('checkoutForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const orderData = {
    name: form.get('name'),
    address: form.get('address'),
    email: form.get('email'),
    paymentMethod: form.get('paymentMethod')
  };

  // Get cart data from localStorage
  const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');
  
  // Format cart items for the order
  const orderItems = cartData.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    total: item.product.price * item.quantity
  }));

  // Calculate total
  const total = orderItems.reduce((sum, item) => sum + item.total, 0);

  // Save order data and cart data temporarily in localStorage
  localStorage.setItem('checkoutInfo', JSON.stringify(orderData));
  localStorage.setItem('orderCartData', JSON.stringify({
    total: total,
    items: orderItems
  }));

  // Redirect to confirmation page
  window.location.href = 'confirmation.html';
});
