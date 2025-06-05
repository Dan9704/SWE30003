import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PaymentProcessor } from './paymentProcessor.js';
import { Order } from '../models/order.js';
import { Shipment } from '../models/shipment.js';
import { Invoice } from '../models/invoice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ORDERS_FILE_PATH = join(__dirname, '../../src/data/orders.json');
const DATA_DIR = join(__dirname, '../../src/data');

export class OrderService {
  constructor() {
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

  saveOrders() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(this.orders, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving orders:', error);
      return false;
    }
  }

  async getAllOrders() {
    return this.orders;
  }

  async getOrderById(id) {
    return this.orders.find(order => order.id === id);
  }

  async createOrder(cart, customer) {
    try {
      const order = new Order(cart, customer);
      
      // Process payment
      let paymentResult = await this.paymentProcessor.process(order);
      
      // Retry payment once if failed
      if (!paymentResult.success) {
        console.log('Initial payment failed. Retrying...');
        paymentResult = await this.paymentProcessor.process(order);
      }

      order.setPayment(paymentResult);

      if (!paymentResult.success) {
        return {
          success: false,
          message: `Payment failed after retry: ${paymentResult.message}`,
          order
        };
      }

      // Create shipment and invoice
      const shipment = new Shipment(order);
      order.setShipment(shipment);

      const invoice = new Invoice(order);
      order.setInvoice(invoice);

      // Save order
      this.orders.push(order);
      this.saveOrders();

      return {
        success: true,
        message: 'Order successfully placed!',
        order
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message
      };
    }
  }

  async updateOrderStatus(id, newStatus) {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return {
        success: false,
        message: `Order with ID ${id} not found`
      };
    }

    this.orders[orderIndex].status = newStatus;
    this.saveOrders();

    return {
      success: true,
      message: 'Order status updated successfully',
      order: this.orders[orderIndex]
    };
  }
} 