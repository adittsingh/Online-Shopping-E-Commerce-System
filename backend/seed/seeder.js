const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    phone: '9876543210',
    address: '123 Admin Street, Delhi',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    phone: '9123456780',
    address: '456 Customer Road, Mumbai',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    phone: '9988776655',
    address: '789 Shopper Lane, Bengaluru',
  },
];

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops, gadgets and more',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Furniture, appliances and kitchen essentials',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600',
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Fitness equipment and sporting goods',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, cosmetics and personal care',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
  },
];

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 4149,
    description:
      'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life and deep bass sound.',
    countInStock: 25,
    featured: true,
  },
  {
    name: 'Smartphone 5G 128GB',
    price: 33999,
    description:
      '6.5 inch AMOLED display smartphone with 128GB storage, 8GB RAM and a powerful 48MP triple camera system.',
    countInStock: 12,
    featured: true,
  },
  {
    name: 'Laptop 15.6 inch - 16GB RAM',
    price: 74999,
    description:
      'Lightweight laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD and a full HD anti-glare display.',
    countInStock: 8,
    featured: true,
  },
  {
    name: 'Smart Watch Series',
    price: 10999,
    description:
      'Fitness smart watch with heart-rate monitor, GPS, sleep tracking and 7-day battery life.',
    countInStock: 30,
    featured: false,
  },
  {
    name: 'Men Casual Cotton T-Shirt',
    price: 1699,
    description:
      'Comfortable 100% cotton crew neck t-shirt, available in multiple colors. Machine washable.',
    countInStock: 100,
    featured: true,
  },
  {
    name: 'Sneakers Running Shoes',
    price: 5999,
    description:
      'Lightweight breathable running sneakers with cushioned sole for everyday comfort.',
    countInStock: 45,
    featured: false,
  },
  {
    name: 'Denim Jacket',
    price: 4999,
    description:
      'Classic denim jacket with button closure and multiple pockets. Durable and stylish.',
    countInStock: 20,
    featured: false,
  },
  {
    name: 'Non-Stick Cookware Set',
    price: 7499,
    description:
      '10-piece non-stick cookware set with pots, pans and lids. Heat-resistant handles and dishwasher safe.',
    countInStock: 15,
    featured: false,
  },
  {
    name: 'Coffee Maker Machine',
    price: 12499,
    description:
      'Automatic drip coffee maker with programmable timer, 12-cup capacity and reusable filter.',
    countInStock: 10,
    featured: true,
  },
  {
    name: 'Yoga Mat Premium',
    price: 2099,
    description:
      'Extra thick non-slip yoga mat with carrying strap. Perfect for yoga, pilates and workouts.',
    countInStock: 60,
    featured: false,
  },
  {
    name: 'Dumbbell Set 20kg',
    price: 6499,
    description:
      'Adjustable dumbbell set with 8 weight plates and connectors. Great for home workouts.',
    countInStock: 18,
    featured: false,
  },
  {
    name: 'Skincare Vitamin C Serum',
    price: 2499,
    description:
      'Vitamin C facial serum for brightening and anti-aging. Dermatologist tested, suitable for all skin types.',
    countInStock: 40,
    featured: false,
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Order.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      User.deleteMany(),
    ]);

    const createdUsers = await User.insertMany(
      await Promise.all(
        users.map(async (u) => {
          const salt = await bcrypt.genSalt(10);
          return { ...u, password: await bcrypt.hash(u.password, salt) };
        })
      )
    );
    const adminUser = createdUsers[0]._id;

    const createdCategories = await Category.insertMany(categories);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    const categoryAssignment = [
      'Electronics',
      'Electronics',
      'Electronics',
      'Electronics',
      'Fashion',
      'Fashion',
      'Fashion',
      'Home & Kitchen',
      'Home & Kitchen',
      'Sports',
      'Sports',
      'Beauty',
    ];

    const images = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600',
      'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=600',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    ];

    const productDocs = products.map((p, i) => ({
      ...p,
      category: catMap[categoryAssignment[i]],
      image: images[i],
      user: adminUser,
      rating: Math.round(((i % 5) + 4) * 10) / 10,
      numReviews: i % 3,
    }));

    await Product.insertMany(productDocs);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Promise.all([
      Order.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      User.deleteMany(),
    ]);
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

