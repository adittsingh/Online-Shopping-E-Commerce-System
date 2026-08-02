const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  const totalCategories = await Category.countDocuments({});
  const totalOrders = await Order.countDocuments({});
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const recentOrders = await Order.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  const lowStock = await Product.find({ countInStock: { $lte: 5 } }).limit(5);

  res.json({
    totalUsers,
    totalProducts,
    totalCategories,
    totalOrders,
    totalRevenue: totalRevenue.length ? totalRevenue[0].total : 0,
    recentOrders,
    lowStock,
  });
});

module.exports = { getStats };
