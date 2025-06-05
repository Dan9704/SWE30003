export class Invoice {
  constructor(order) {
    this.invoiceId = Date.now().toString();
    this.timestamp = new Date().toISOString();
    this.items = order.items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      pricePerUnit: item.product.price,
      lineTotal: (item.quantity * item.product.price).toFixed(2)
    }));
    this.total = order.total;
    this.orderId = order.id;
    this.customerEmail = order.customer.email;
  }
} 