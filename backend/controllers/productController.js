const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: 'i' },
      }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};

  const priceFilter = {};
  if (req.query.minPrice) priceFilter.price = { $gte: Number(req.query.minPrice) };
  if (req.query.maxPrice) {
    priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };
  }

  const offerFilter = req.query.offer === '1' || req.query.offer === 'true'
    ? { discount: { $gt: 0 } }
    : {};

  const query = { ...keyword, ...categoryFilter, ...priceFilter, ...offerFilter };

  const sortOptions = {};
  if (req.query.sort) {
    const [field, order] = req.query.sort.split(':');
    sortOptions[field] = order === 'desc' ? -1 : 1;
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOptions)
    .populate('category', 'name slug')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true })
    .populate('category', 'name slug')
    .limit(4);
  res.json(products);
});

const getOfferProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ discount: { $gt: 0 } })
    .sort({ discount: -1, createdAt: -1 })
    .populate('category', 'name slug')
    .limit(Number(req.query.limit) || 100);
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'category',
    'name slug'
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    discount,
    category,
    image,
    countInStock,
    featured,
  } = req.body;

  if (!name || !description || !price || !category || !image) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    description,
    price: Number(price),
    originalPrice: originalPrice !== undefined ? Number(originalPrice) : 0,
    discount: discount !== undefined ? Number(discount) : 0,
    category,
    image,
    countInStock: Number(countInStock) || 0,
    featured: featured === true || featured === 'true',
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    description,
    price,
    originalPrice,
    discount,
    category,
    image,
    countInStock,
    featured,
  } = req.body;

  product.name = name !== undefined ? name : product.name;
  product.description =
    description !== undefined ? description : product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.originalPrice =
    originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
  product.discount =
    discount !== undefined ? Number(discount) : product.discount;
  product.category = category !== undefined ? category : product.category;
  product.image = image !== undefined ? image : product.image;
  product.countInStock =
    countInStock !== undefined ? Number(countInStock) : product.countInStock;
  product.featured =
    featured !== undefined ? featured === true || featured === 'true' : product.featured;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide rating and comment');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getOfferProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
