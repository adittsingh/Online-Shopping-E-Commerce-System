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

const offerProducts = [
  {
    category: 'Electronics',
    items: [
      ['Wireless Bluetooth Speaker 20W', 'Portable 20W speaker with deep bass, IPX7 waterproof rating and 12-hour playtime.', 1499, 50],
      ['True Wireless Earbuds Pro', 'TWS earbuds with ANC, touch controls, fast charging and low-latency gaming mode.', 999, 60],
      ['Smart Band Fitness Tracker', 'Fitness tracker with heart-rate monitor, SpO2, sleep tracking and 7-day battery.', 1499, 50],
      ['Fast Charger 65W GaN', 'Compact 65W GaN charger with dual USB-C and USB-A ports for laptops and phones.', 1199, 50],
      ['Power Bank 20000mAh', '22.5W fast-charge power bank with dual output and USB-C input.', 1799, 60],
      ['Wireless Mouse', '2.4GHz wireless mouse with silent clicks and adjustable DPI up to 2400.', 599, 50],
      ['RGB Mechanical Keyboard', 'RGB backlit mechanical keyboard with hot-swappable switches and metal frame.', 2499, 60],
      ['HD Webcam 1080p', 'Full HD webcam with built-in mic, auto light correction and privacy cover.', 1299, 50],
      ['Smart LED Bulb 9W', 'Wi-Fi smart bulb with 16 million colors, works with Alexa and Google Home.', 499, 50],
      ['Smart Security Camera 2K', '2K Wi-Fi security camera with night vision, motion alerts and two-way audio.', 2499, 60],
      ['Android Tablet 10.1 inch', '10.1 inch HD tablet with 4GB RAM, 64GB storage and 4G calling support.', 9999, 50],
      ['Wireless Gaming Controller', 'Bluetooth gamepad with turbo function, ergonomic grip and 15-hour battery.', 1999, 60],
      ['Portable SSD 1TB', 'Pocket-sized 1TB SSD with 1050MB/s read speed and shock resistance.', 5999, 50],
      ['Bluetooth Neckband', 'Magnetic neckband earphones with 24-hour battery and deep bass sound.', 799, 60],
      ['Wi-Fi 6 Router', 'Dual-band AX3000 router with mesh support and easy app setup.', 3299, 50],
      ['Action Camera 4K', '4K action camera with EIS stabilization, waterproof case and touch screen.', 7999, 60],
      ['Mini Projector HD', 'Portable LED projector with 1080p support, built-in speaker and HDMI input.', 8999, 50],
      ['Smart Speaker with Alexa', 'Smart speaker with Alexa voice control, powerful bass and multi-room audio.', 2999, 60],
      ['Electric Beard Trimmer', 'Waterproof trimmer with 13 length settings and precision blades.', 899, 50],
      ['Car Dash Cam Full HD', 'Dash camera with night vision, loop recording and G-sensor parking mode.', 2499, 60],
    ],
  },
  {
    category: 'Fashion',
    items: [
      ['Men Polo T-Shirt', 'Cotton-blend polo with ribbed collar and moisture-wicking fabric.', 999, 50],
      ['Women Kurta Set', 'Elegant cotton kurta with dupatta, festive embroidery and comfortable fit.', 1499, 60],
      ['Men Slim Fit Jeans', 'Stretchable slim-fit jeans with 5-pocket styling and durable denim.', 1299, 50],
      ['Women Anarkali Dress', 'Flowing floor-length anarkali with churidar, perfect for festive occasions.', 1999, 60],
      ['Men Running Shoes', 'Breathable mesh running shoes with cushioned foam midsole.', 1999, 50],
      ['Leather Bifold Wallet', 'Genuine leather wallet with RFID blocking and 6 card slots.', 699, 60],
      ['Men Formal Shirt', 'Wrinkle-free formal shirt with slim fit and spread collar.', 1099, 50],
      ['Women Leather Handbag', 'Stylish handbag with shoulder strap, zipper pockets and premium finish.', 1599, 60],
      ['Aviator Sunglasses', 'Polarized aviator sunglasses with UV400 protection and metal frame.', 899, 50],
      ['Analog Watch for Men', 'Premium analog watch with stainless steel strap and water resistance.', 2499, 60],
      ['Men Track Pants', 'Comfortable joggers with elastic waistband and side pockets.', 799, 50],
      ['Banarasi Silk Saree', 'Handwoven silk saree with gold zari border and blouse piece.', 2999, 60],
      ['Canvas Sneakers', 'Classic low-top canvas sneakers available in multiple colors.', 1299, 50],
      ['Cotton Baseball Cap', 'Adjustable cotton cap with embroidered front and breathable mesh back.', 399, 60],
      ['Men Winter Jacket', 'Insulated hooded jacket with water-resistant shell and fleece lining.', 2499, 50],
      ['Cotton Printed Kurti', 'Regular-fit printed kurti with side slits and three-quarter sleeves.', 899, 60],
      ['Casual Laptop Backpack', 'Water-resistant backpack with padded laptop sleeve and USB port.', 1499, 50],
      ['Men Casual Slippers', 'Soft EVA slippers with anti-slip sole for everyday comfort.', 499, 60],
      ['Women High-Waist Leggings', 'Squat-proof stretch leggings with high-waist support.', 599, 50],
      ['Men Pullover Hoodie', 'Fleece-lined pullover hoodie with kangaroo pocket.', 1799, 60],
    ],
  },
  {
    category: 'Home & Kitchen',
    items: [
      ['Air Fryer 4.5L', '4.5L digital air fryer with 8 presets, 360 degree hot air circulation and recipe book.', 3999, 50],
      ['Mixer Grinder 750W', '750W mixer grinder with 3 jars, turbo mode and rust-proof blades.', 2499, 60],
      ['Induction Cooktop', '1800W induction cooktop with 8 cooking menus and auto shut-off.', 1799, 50],
      ['Electric Kettle 1.5L', '1.5L stainless steel kettle with auto shut-off and boil-dry protection.', 899, 60],
      ['Rice Cooker 1.8L', '1.8L rice cooker with non-stick inner pot and keep-warm function.', 1299, 50],
      ['Microwave Oven 20L', '20L solo microwave with 5 power levels and easy defrost.', 6499, 60],
      ['Vacuum Cleaner 1800W', 'High-power bagless vacuum with HEPA filter and 3-in-1 mode.', 3299, 50],
      ['Room Heater 2000W', 'PTC fan room heater with thermostat, tilt protection and 2 heat settings.', 1999, 60],
      ['Ceiling Fan 1200mm', 'Energy-efficient 5-star ceiling fan with powerful airflow.', 2499, 50],
      ['LED Table Lamp', 'Eye-care LED table lamp with 3 color modes and USB charging port.', 999, 60],
      ['Dinner Set 32-Piece', 'Melamine dinner set for 8 with bowls, plates and serving dishes.', 2999, 50],
      ['Stainless Steel Tiffin', '3-tier stainless steel lunch box with leak-proof containers.', 599, 60],
      ['RO Water Purifier', '7-stage RO+UV water purifier with 10L storage tank.', 5999, 50],
      ['Non-Stick Cookware 5-Piece', 'Granite-coated cookware set with lids, suitable for all stoves.', 1999, 60],
      ['Storage Containers Set', 'Airtight kitchen storage containers in 6 sizes with stackable design.', 799, 50],
      ['Anti-Skid Bathroom Mats', 'Quick-dry anti-slip mat set for bathroom and kitchen.', 499, 60],
      ['Power Blender 1000W', '1000W blender for smoothies and shakes with 1.5L jar.', 1499, 50],
      ['2-Slice Toaster', 'Stainless steel toaster with 6 browning levels and removable crumb tray.', 999, 60],
      ['Kitchen Chimney 60cm', '60cm chimney with auto-clean and high suction power.', 4999, 50],
      ['Dinner Plates 12-Piece', 'Bone china dinner plate set with elegant border design.', 1299, 60],
    ],
  },
  {
    category: 'Sports',
    items: [
      ['Cricket Bat English Willow', 'Full-size English willow cricket bat with anti-scuff tape.', 1499, 50],
      ['Football Size 5', 'Synthetic leather football with PU coating for match play.', 999, 60],
      ['Basketball Indoor/Outdoor', 'Durable rubber basketball with deep channels for grip.', 899, 50],
      ['Badminton Racquet Set', 'Full aluminum badminton set with 2 racquets, 3 shuttles and bag.', 1299, 60],
      ['Folding Treadmill', '2HP motorized treadmill with incline, Bluetooth and foldable frame.', 19999, 50],
      ['Exercise Cycle', '8-level resistance magnetic exercise bike with LCD display.', 8999, 60],
      ['Adjustable Skipping Rope', 'Tangle-free skipping rope with speed ball bearings.', 299, 50],
      ['Kettlebell 12kg', 'Cast iron kettlebell with comfortable grip.', 2499, 60],
      ['Resistance Bands Set', '5-band pull-up assist set with handles, ankle straps and door anchor.', 699, 50],
      ['Gym Gloves', 'Padded lifting gloves with wrist support and breathable back.', 499, 60],
      ['Yoga Block & Strap Set', 'High-density EVA yoga blocks with carrying strap.', 599, 50],
      ['Tennis Racket', 'Lightweight tennis racket with aluminum frame, pre-strung.', 1799, 60],
      ['Sports Water Bottle 1L', 'BPA-free insulated sports bottle with flip lid.', 399, 50],
      ['MTB Cycle 26 inch', '21-speed mountain bike with front suspension and disc brakes.', 12999, 60],
      ['Jump Rope with Counter', 'Digital counter skipping rope for calorie tracking.', 349, 50],
      ['Push Up Board', 'Multifunctional push-up board with 16 positions and wrist grips.', 899, 60],
      ['Adjustable Hand Gripper', 'Resistance hand grip strengthener from 10-60kg.', 299, 50],
      ['Swimming Goggles', 'Anti-fog swimming goggles with UV protection and adjustable strap.', 599, 60],
      ['Fitness Smart Band', 'Waterproof fitness band with heart rate and sleep monitoring.', 1299, 50],
      ['Basketball Hoop Ring', 'Adjustable basketball ring with net for wall mounting.', 2499, 60],
    ],
  },
  {
    category: 'Beauty',
    items: [
      ['Vitamin C Face Wash', 'Brightening face wash with vitamin C and aloe vera for all skin types.', 499, 50],
      ['Retinol Face Serum', 'Anti-aging retinol serum with hyaluronic acid and niacinamide.', 899, 60],
      ['Sunscreen SPF 50 PA+++', 'Broad-spectrum sunscreen with no white cast, water resistant.', 699, 50],
      ['Hair Dryer 2000W', '2000W ionic hair dryer with 3 heat settings and concentrator nozzle.', 1499, 60],
      ['Ceramic Hair Straightener', 'Ceramic plate straightener with adjustable temperature and auto shut-off.', 1299, 50],
      ['Eau de Parfum 100ml', 'Long-lasting floral fragrance with woody base notes.', 1999, 60],
      ['Matte Lipstick Set of 5', 'Highly pigmented matte lipsticks in 5 trending shades.', 999, 50],
      ['Eyeshadow Palette 18 Shades', '18-shade pigmented eyeshadow palette with matte and shimmer finish.', 1499, 60],
      ['Face Mask Sheet Pack of 10', 'Hydrating sheet masks with hyaluronic acid and vitamin E.', 599, 50],
      ['Deep Moisture Body Lotion', '24-hour moisturizing body lotion with shea butter.', 499, 60],
      ['Sulphate-Free Shampoo', 'Nourishing shampoo for damaged hair, paraben and sulphate free.', 699, 50],
      ['Beard Grooming Kit', 'Complete beard kit with trimmer, oil, balm and comb.', 999, 60],
      ['Manicure Nail Kit 24-Piece', 'Professional manicure and pedicure set in a travel case.', 799, 50],
      ['Facial Roller & Gua Sha', 'Jade roller and gua sha set for facial massage and skincare routine.', 499, 60],
      ['Facial Cleansing Brush', 'Silicone cleansing brush with 3 speed levels, waterproof.', 1299, 50],
      ['Argan Oil Hair Serum', 'Frizz-control argan oil hair serum with heat protection.', 599, 60],
      ['Makeup Brush Set 12-Piece', 'Complete 12-piece makeup brush set with travel pouch.', 999, 50],
      ['Under Eye Cream', 'Caffeine-infused eye cream for dark circles and puffiness.', 799, 60],
      ['Body Mist 250ml', 'Refreshing body mist with long-lasting fragrance.', 599, 50],
      ['Electric Face Cleanser', 'Waterproof electric facial cleansing brush with silicone head.', 1499, 60],
    ],
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

    let offerIdx = 0;
    offerProducts.forEach((group) => {
      group.items.forEach(([name, description, price, discount]) => {
        offerIdx += 1;
        const originalPrice = Math.round(price / (1 - discount / 100));
        productDocs.push({
          name,
          description,
          price,
          originalPrice,
          discount,
          category: catMap[group.category],
          image: `https://picsum.photos/seed/stockedup${offerIdx}/600/600`,
          user: adminUser,
          countInStock: 10 + ((offerIdx * 7) % 41),
          rating: Math.round(((offerIdx % 5) + 4) * 10) / 10,
          numReviews: offerIdx % 4,
        });
      });
    });

    await Product.insertMany(productDocs);

    console.log(`Imported ${productDocs.length} products successfully!`);
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

