import { generateUUID } from '../utils/idGenerator.js';

export class Order {
  constructor(cart, customer) {
    this.id = generateUUID();
    this.customer = customer; // Simplified: { email: "test@example.com" }
    this.items = [...cart.listItems()]; // Deep copy or ensure OrderItem is immutable if needed
    this.total = cart.getTotal();
    this.payment = null; // To be filled by PaymentProcessor
    this.shipment = null; // To be filled by Shipment module
    this.invoice = null; // To be filled by Invoice module
    this.status = 'pending'; // e.g., pending, confirmed, failed
  }

  // Method to set payment details
  setPayment(paymentResult) {
    this.payment = paymentResult;
    this.status = paymentResult.success ? 'confirmed' : 'payment_failed';
  }

  // Method to set shipment details
  setShipment(shipmentDetails) {
    this.shipment = shipmentDetails;
  }

  // Method to set invoice details
  setInvoice(invoiceDetails) {
    this.invoice = invoiceDetails;
  }

  toString() {
    return `Order ID: ${this.id}\nCustomer: ${this.customer.email}\nStatus: ${this.status}\nTotal: $${this.total}\nItems:\n${this.items.map(item => `  - ${item.toString()}`).join('\n')}\nPayment: ${this.payment ? JSON.stringify(this.payment) : 'N/A'}\nShipment: ${this.shipment ? JSON.stringify(this.shipment) : 'N/A'}\nInvoice: ${this.invoice ? JSON.stringify(this.invoice) : 'N/A'}`;
  }
} 