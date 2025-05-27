import { OrderItem } from '../models/orderItem.js';

export class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addProduct(product, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      console.warn(`CartManager: Invalid quantity (${quantity}) for product ${product.id}. Defaulting to 1.`);
      quantity = 1;
    }
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push(new OrderItem(product, quantity));
    }
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  listItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toFixed(2);
  }

  isEmpty() {
    return this.items.length === 0;
  }
} 