import { OrderService } from '../services/orderService.js';

export class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  getAllOrders = async (req, res, next) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${id} not found`
        });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  createOrder = async (req, res, next) => {
    try {
      const { cart, customer } = req.body;
      
      if (!cart || !customer) {
        return res.status(400).json({
          success: false,
          message: 'Cart and customer information are required'
        });
      }

      const result = await this.orderService.createOrder(cart, customer);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const result = await this.orderService.updateOrderStatus(id, status);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
} 