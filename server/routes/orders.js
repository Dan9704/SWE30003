import express from 'express';
import { OrderController } from '../controllers/orderController.js';

const router = express.Router();
const orderController = new OrderController();

// Get all orders
router.get('/', orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Create a new order
router.post('/', orderController.createOrder);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

export default router; 