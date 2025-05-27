import { generateUUID } from '../utils/idGenerator.js';

export class Shipment {
  constructor(order) {
    this.trackingId = generateUUID();
    this.status = 'created'; // Enum: created, in_transit, delivered
    this.estimatedDelivery = this.calculateEstimatedDelivery();
    this.courier = 'AustExpress'; // Hardcoded as per PRD
    this.orderId = order.id;
  }

  calculateEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 5); // Mock: 5 days from now
    return date.toISOString().split('T')[0];
  }

  toString() {
    return `Shipment Tracking: ${this.trackingId} (${this.courier})\nStatus: ${this.status}\nEstimated Delivery: ${this.estimatedDelivery}`;
  }
} 