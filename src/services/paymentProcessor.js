import { generateUUID } from '../utils/idGenerator.js';

export class PaymentProcessor {
  // Simulates processing payment for an order
  process(order) {
    // Simulate a 5-10% failure rate
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        transactionId: generateUUID(),
        message: 'Payment successful.',
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        transactionId: null,
        message: 'Payment failed. Please try again or use a different payment method.',
        timestamp: new Date().toISOString()
      };
    }
  }

  // A simple simulate method if needed for direct testing, not used by OrderManager directly
  simulate() {
    return this.process({});
  }
} 