document.getElementById('checkoutForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const checkoutInfo = {
    name: form.get('name'),
    address: form.get('address'),
    email: form.get('email'),
    paymentMethod: form.get('paymentMethod'),
  };

  const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');
  if (!cartData.length) {
    alert('Your cart is empty.');
    return;
  }

  // Prepare cart and customer for backend
  const cart = {
    items: cartData.map(item => ({
      product: item.product,
      quantity: item.quantity
    })),
    total: cartData.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  };
  const customer = {
    name: checkoutInfo.name,
    address: checkoutInfo.address,
    email: checkoutInfo.email
  };

  // Send to backend
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, customer })
    });
    const result = await response.json();
    if (!result.success) {
      alert(result.message || 'Order failed.');
      return;
    }
    // Save order info for confirmation page
    localStorage.setItem('checkoutInfo', JSON.stringify({
      ...checkoutInfo,
      orderId: result.order.id,
      status: result.order.status
    }));
    localStorage.setItem('orderCartData', JSON.stringify({
      items: result.order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      total: parseFloat(result.order.total)
    }));
    localStorage.removeItem('cartData');
    window.location.href = 'confirmation.html';
  } catch (err) {
    alert('Failed to place order. Please try again.');
    console.error(err);
  }
});
