const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/admin/all', protect, admin, getAllOrders); 
router.get('/:id', protect, getOrder);                 
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;