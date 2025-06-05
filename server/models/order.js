import { generateUUID } from '../utils/idGenerator.js';

export class Order {
  constructor(cart, customer) {
    this.id = generateUUID();
    this.customer = customer;
    // Support both cart object with methods and plain object from API
    if (typeof cart.listItems === 'function' && typeof cart.getTotal === 'function') {
      this.items = cart.listItems();
      this.total = cart.getTotal().toFixed(2);
    } else {
      this.items = cart.items || [];
      this.total = (cart.total !== undefined ? cart.total : this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)).toFixed(2);
    }
    this.status = 'pending';
    this.payment = null;
    this.shipment = null;
    this.invoice = null;
  }

  setPayment(paymentResult) {
    this.payment = paymentResult;
    if (paymentResult.success) {
      this.status = 'confirmed';
    } else {
      this.status = 'payment_failed';
    }
  }

  setShipment(shipment) {
    this.shipment = shipment;
  }

  setInvoice(invoice) {
    this.invoice = invoice;
  }
} 