export class OrderItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  get lineTotal() {
    return (this.product.price * this.quantity).toFixed(2);
  }

  toString() {
    return `${this.product.name} x${this.quantity} — $${this.lineTotal}`;
  }
} 