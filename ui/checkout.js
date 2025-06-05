document.getElementById('checkoutForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const checkoutInfo = {
    name: form.get('name'),
    address: form.get('address'),
    email: form.get('email'),
    paymentMethod: form.get('paymentMethod'),
    orderId: `AWE-${Date.now()}`,
    status: 'Confirmed'
  };

  const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');
  const orderItems = cartData.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    total: item.product.price * item.quantity
  }));
  const total = orderItems.reduce((sum, item) => sum + item.total, 0);

  localStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
  localStorage.setItem('orderCartData', JSON.stringify({ items: orderItems, total: total }));
  localStorage.removeItem('cartData');

  window.location.href = 'confirmation.html';
});
