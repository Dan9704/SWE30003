import { generateTimestampId } from '../utils/idGenerator.js';

export class Invoice {
  constructor(order) {
    this.invoiceId = generateTimestampId();  // Using timestamp for invoice ID as per PRD
    this.timestamp = new Date().toISOString();
    this.items = order.items.map(item => ({  // Store a snapshot of item details for the invoice
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      pricePerUnit: item.product.price,
      lineTotal: item.lineTotal
    }));
    this.total = order.total;
    this.orderId = order.id;
    this.customerEmail = order.customer.email;
  }

  // Simple string format for display
  format() {
    return `Invoice ID: ${this.invoiceId}\nDate: ${this.timestamp}\nOrder ID: ${this.orderId}\nCustomer: ${this.customerEmail}\n\nItems:\n${this.items.map(i => `  - ${i.name} x${i.quantity} @ $${i.pricePerUnit} = $${i.lineTotal}`).join('\n')}\n\nTotal Amount: $${this.total}`;
  }
} 