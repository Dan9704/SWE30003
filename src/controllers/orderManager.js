import fs from 'fs';
import { Order } from '../models/order.js';
import { PaymentProcessor } from '../services/paymentProcessor.js';
import { Shipment } from '../models/shipment.js';
import { Invoice } from '../models/invoice.js';

const ORDERS_FILE_PATH = './src/data/orders.json';
const DATA_DIR = './src/data';

export class OrderManager {
  constructor(catalogue) {
    this.catalogue = catalogue;
    this.paymentProcessor = new PaymentProcessor();
    this.orders = this.loadOrders();
  }

  loadOrders() {
    try {
      if (fs.existsSync(ORDERS_FILE_PATH)) {
        const raw = fs.readFileSync(ORDERS_FILE_PATH);
        return JSON.parse(raw);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    return [];
  }

  saveOrder(order) {
    this.orders.push(order);
    try {
      if (!fs.existsSync(DATA_DIR)){
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(this.orders, null, 2));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }

  validateCart(cart) {
    if (cart.isEmpty()) {
      return { valid: false, message: 'Cart is empty. Cannot proceed to checkout.' };
    }
    for (const item of cart.listItems()) {
      const productInCatalogue = this.catalogue.products.find(p => p.id === item.product.id);
      if (!productInCatalogue || productInCatalogue.stock < item.quantity) {
        return { valid: false, message: `Insufficient stock for ${item.product.name}. Available: ${productInCatalogue ? productInCatalogue.stock : 0}, Requested: ${item.quantity}.` };
      }
    }
    return { valid: true, message: 'Cart is valid.' };
  }

  createOrder(cart, customer) {
    return new Order(cart, customer);
  }

  triggerPayment(order) {
    return this.paymentProcessor.process(order);
  }

  generateInvoice(order) {
    return new Invoice(order);
  }

  createShipment(order) {
    return new Shipment(order);
  }

  updateStock(order) {
    order.items.forEach(item => {
      const productInCatalogue = this.catalogue.products.find(p => p.id === item.product.id);
      if (productInCatalogue) {
        productInCatalogue.stock -= item.quantity;
        // Note: In a real app, you'd persist catalogue changes too.
        // For this PRD, catalogue.js doesn't have a saveProducts method.
        // We are modifying the in-memory catalogue instance.
      }
    });
  }

  async finalizeOrder(cart, customer) {
    const validation = this.validateCart(cart);
    if (!validation.valid) {
      return { success: false, message: validation.message, order: null };
    }

    const order = this.createOrder(cart, customer);
    let paymentResult = this.triggerPayment(order);

    // Retry payment once if failed
    if (!paymentResult.success) {
      console.log('Initial payment failed. Retrying...');
      paymentResult = this.triggerPayment(order); // Second attempt
    }

    order.setPayment(paymentResult);

    if (!paymentResult.success) {
      return { success: false, message: `Payment failed after retry: ${paymentResult.message}`, order };
    }

    this.updateStock(order);
    const shipment = this.createShipment(order);
    order.setShipment(shipment);

    const invoice = this.generateInvoice(order);
    order.setInvoice(invoice);

    this.saveOrder(order);
    cart.items = []; // Clear the cart after successful order

    return {
      success: true,
      message: 'Order successfully placed!',
      order
    };
  }
} 