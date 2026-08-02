const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    res.status(400);
    throw new Error('Please provide a complete shipping address');
  }

  const hydratedItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400);
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(
          `Not enough stock for "${product.name}" (available: ${product.countInStock})`
        );
      }
      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: Number(item.qty),
      };
    })
  );

  const itemsPrice = hydratedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  const order = await Order.create({
    user: req.user._id,
    items: hydratedItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  for (const item of hydratedItems) {
    const product = await Product.findById(item.product);
    product.countInStock = product.countInStock - item.qty;
    await product.save();
  }

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const { status } = req.body;

  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  order.status = status;

  if (status === 'Delivered' && !order.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  if (status === 'Cancelled' && !order.isPaid) {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = product.countInStock + item.qty;
        await product.save();
      }
    }
  }

  const updated = await order.save();
  res.json(updated);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (
    order.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  if (order.status === 'Pending') {
    order.status = 'Processing';
  }

  const updated = await order.save();
  res.json(updated);
});

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updateOrderToPaid,
};
