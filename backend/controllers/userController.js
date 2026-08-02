const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
  user.address = req.body.address !== undefined ? req.body.address : user.address;
  user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    address: updated.address,
    isAdmin: updated.isAdmin,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isAdmin && (await User.countDocuments({ isAdmin: true })) === 1) {
    res.status(400);
    throw new Error('Cannot delete the last admin user');
  }

  const orderCount = await Order.countDocuments({ user: user._id });
  if (orderCount > 0) {
    res.status(400);
    throw new Error(
      'Cannot delete a user with existing orders. Deactivate instead.'
    );
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
});

module.exports = { getUsers, getUserById, updateUser, deleteUser };
