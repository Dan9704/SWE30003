import { generateUUID } from '../utils/idGenerator.js';

export class PaymentProcessor {
  async process(order) {
    // Simulate async payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a 10% failure rate
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
} 