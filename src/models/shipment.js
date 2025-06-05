import { generateUUID } from '../utils/idGenerator.js';

export class Shipment {
  constructor(order) {
    this.trackingId = generateUUID();
    this.status = 'created';
    this.estimatedDelivery = this.calculateEstimatedDelivery();
    this.courier = 'AustExpress';
    this.orderId = order.id;
  }

  calculateEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  }

  toString() {
    return `Shipment Tracking: ${this.trackingId} (${this.courier})\nStatus: ${this.status}\nEstimated Delivery: ${this.estimatedDelivery}`;
  }
} 