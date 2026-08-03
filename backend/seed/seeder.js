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
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Toys, puzzles and games for all ages',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600',
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
      ['Boxing Gloves', 'Classic boxing gloves with wrist support and cushioned padding.', 899, 60],
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
  {
    category: 'Electronics',
    items: [
      ['Electric Scooter', 'Foldable electric scooter with 25km range, LED display and dual brakes.', 24999, 50],
    ],
  },
  {
    category: 'Fashion',
    items: [
      ['Men Cotton Boxers Pack of 3', 'Soft stretch-cotton boxers with elastic waistband, 3-piece value pack.', 699, 60],
      ['Men Pajama Set', 'Comfortable cotton pajama set with full sleeves and relaxed fit.', 1299, 50],
      ['Men Casual Shirt', 'Soft cotton casual shirt with chest pocket, perfect for weekends.', 1099, 55],
      ['Checked Cotton Shirt', 'Classic checked cotton shirt for smart casual and office wear.', 1299, 50],
      ['Printed Graphic T-Shirt', 'Trendy graphic print crew neck t-shirt in breathable cotton.', 599, 60],
      ['Men Kurta Pajama Set', 'Cotton kurta with straight pajama for festive and casual wear.', 2499, 55],
      ['Men Denim Shorts', 'Classic five-pocket denim shorts with durable stitching.', 999, 60],
      ['Cotton Saree', 'Soft breathable cotton saree with contrast border for daily wear.', 1699, 50],
      ['Men Sleeveless Tank Top', 'Soft cotton sleeveless tank top for gym and casual wear.', 499, 50],
    ],
  },
  {
    category: 'Home & Kitchen',
    items: [
      ['Ceramic Vase', 'Handcrafted glazed ceramic vase for flowers and home decor.', 899, 60],
    ],
  },
  {
    category: 'Toys & Games',
    items: [
      ['Building Blocks 500-Piece', 'Colourful interlocking building blocks set for creative play.', 999, 50],
      ['Remote Control Car', 'High-speed RC stunt car with 2.4GHz remote, suitable for all terrains.', 1499, 60],
      ['Teddy Bear Soft Toy', 'Super soft plush teddy bear, 40cm, perfect for gifting.', 799, 50],
      ['Chess Set', 'Wooden chess board with hand-carved pieces, 15 inch.', 1299, 60],
      ['Toy Train Set', 'Battery-operated toy train set with tracks, bridge and station.', 1999, 50],
      ['Jigsaw Puzzle 1000-Piece', 'Premium 1000-piece jigsaw puzzle with matte finish and box.', 599, 60],
    ],
  },
  {
    category: 'Electronics',
    items: [
      ['Smart Door Lock', 'Fingerprint smart door lock with keypad, password and app unlock.', 3999, 50],
      ['CCTV Bullet Camera', 'Full HD bullet security camera with night vision and weatherproof housing.', 2299, 55],
      ['LED Monitor 24 inch', 'Full HD 24 inch LED monitor with slim bezel and flicker-free display.', 7999, 50],
      ['Bluetooth Soundbar', '2.1 channel soundbar with wireless subwoofer and HDMI ARC.', 5999, 55],
      ['VR Headset', 'Immersive VR headset with adjustable straps and built-in stereo sound.', 4999, 60],
      ['Digital Photo Frame', '10 inch digital photo frame with slideshow and USB/SD card support.', 3499, 50],
      ['Wireless Charging Pad', '15W Qi wireless charging pad compatible with all Qi-enabled phones.', 1299, 50],
      ['Video Doorbell', 'Smart video doorbell with HD camera, motion detection and two-way talk.', 4499, 55],
      ['Mini Smart Speaker', 'Compact smart speaker with voice assistant and room-filling sound.', 1999, 50],
    ],
  },
  {
    category: 'Fashion',
    items: [
      ['Men Cotton Kurta', 'Pure cotton kurta with mandarin collar and straight fit.', 1199, 55],
      ['Women Palazzo Pants', 'Flowy palazzo pants with elasticated waistband, 3 sizes available.', 799, 50],
      ['Women Kaftan Dress', 'Breathable kaftan dress with flared sleeves, perfect for summer.', 1499, 60],
      ['Men Casual Shorts', 'Everyday cotton shorts with drawstring waist and side pockets.', 599, 55],
      ['Women Pleated Skirt', 'Flared pleated skirt with soft waistband, midi length.', 999, 50],
      ['Men Slim Chinos', 'Slim-fit cotton chinos with stretch comfort and tapered leg.', 1499, 55],
      ['Silk Scarf', 'Handwoven silk scarf with vibrant prints and soft finish.', 699, 50],
      ['Straw Sun Hat', 'Wide-brim straw sun hat with inner band for UV protection.', 499, 55],
    ],
  },
  {
    category: 'Home & Kitchen',
    items: [
      ['Chef Kitchen Knife', 'Professional chef knife with stainless steel blade and ergonomic handle.', 899, 50],
      ['Food Processor', 'Multi-function food processor with 5 blades and 3 bowls.', 2499, 55],
      ['Sandwich Maker', 'Non-stick sandwich maker with 2-slice capacity and indicator lights.', 999, 50],
      ['Popcorn Maker', 'Hot air popcorn maker with measuring cup and butter tray.', 1499, 60],
      ['Coffee Grinder', 'Electric coffee grinder with 2 stainless steel blades, 12-cup capacity.', 1299, 50],
      ['Thermos Flask 1L', 'Insulated steel thermos flask that keeps drinks hot or cold for 12 hours.', 1099, 55],
      ['Casserole Dish with Lid', 'Oven-safe ceramic casserole dish with glass lid.', 1399, 50],
      ['Water Dispenser', 'Top-load water dispenser for bottled water with easy push taps.', 1599, 55],
      ['Glass Storage Jars Set', 'Airtight glass storage jars in 5 sizes for pantry organization.', 899, 50],
    ],
  },
  {
    category: 'Sports',
    items: [
      ['Punching Bag', 'Heavy punching bag with adjustable straps and durable canvas.', 2499, 55],
      ['Cycling Helmet', 'Ventilated road cycling helmet with adjustable fit system.', 1299, 50],
      ['Table Tennis Racket Set', 'Wooden table tennis bat pair with rubber grips and carry case.', 899, 55],
      ['Weight Bench', 'Adjustable weight bench with foam padding, supports 150kg.', 6999, 50],
      ['Fishing Rod Combo', '6ft fishing rod with reel, line and tackle accessories.', 1799, 55],
    ],
  },
  {
    category: 'Beauty',
    items: [
      ['Aloe Vera Gel', 'Pure aloe vera gel for skin hydration and sunburn relief.', 399, 50],
      ['Coconut Hair Oil', 'Cold-pressed coconut hair oil with jasmine for shine and strength.', 499, 55],
      ['Nail Polish Set', 'Quick-dry nail polish set of 6 glossy shades.', 599, 50],
      ['Lip Balm', 'Moisturizing lip balm with shea butter and SPF protection.', 249, 50],
    ],
  },
  {
    category: 'Toys & Games',
    items: [
      ["Rubik's Cube 3x3", 'Classic 3x3 speed cube with smooth turning and sticker design.', 349, 50],
      ['Water Gun Toy', 'Super soaker style water gun for outdoor summer fun.', 449, 55],
      ['Doll House with Furniture', '2-storey wooden doll house with miniature furniture pieces.', 2999, 50],
      ['Remote Control Drone', 'Foldable RC drone with HD camera and one-key return.', 3999, 55],
    ],
  },
];

const offerImages = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg/960px-JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Yamaha_TW-E3A_Earbuds_Customize%2C_Japan%3B_April_2021_%2801%29.jpg/960px-Yamaha_TW-E3A_Earbuds_Customize%2C_Japan%3B_April_2021_%2801%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Samsung_Galaxy_Fit.jpg/960px-Samsung_Galaxy_Fit.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Silicon_vs_GaN_30W_USB-C_chargers.jpg/960px-Silicon_vs_GaN_30W_USB-C_chargers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/SAMSUNG_BATTERY_PACK_%28POWER_BANK%29_EB-P4520_%282%29.jpg/960px-SAMSUNG_BATTERY_PACK_%28POWER_BANK%29_EB-P4520_%282%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Wireless_computer_keyboard_with_mouse_an_USB_receiver.jpg/960px-Wireless_computer_keyboard_with_mouse_an_USB_receiver.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mechanical_Keyboard_Exhibition.jpg/960px-Mechanical_Keyboard_Exhibition.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Asus_Zenbook_UX32V_-_webcam_module-9649.jpg/960px-Asus_Zenbook_UX32V_-_webcam_module-9649.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Yeelight_gu10_smart_bulb_W1_dimmable_YLDP004_1527_4.8w.jpg/960px-Yeelight_gu10_smart_bulb_W1_dimmable_YLDP004_1527_4.8w.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lorex_easy_connect_ip_camera.jpg/960px-Lorex_easy_connect_ip_camera.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Tablet_computer.jpeg/960px-Tablet_computer.jpeg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/InclusiveGameLab_Xbox-Adaptive-Controller_4_CC-BY-SA_01.jpg/960px-InclusiveGameLab_Xbox-Adaptive-Controller_4_CC-BY-SA_01.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Portable_SSD_T5%2C_Oosterflank%2C_Rotterdam_%282020%29.jpg/960px-Samsung_Portable_SSD_T5%2C_Oosterflank%2C_Rotterdam_%282020%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Wireless_neckband.jpg/960px-Wireless_neckband.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/ASUS_Wi-Fi_ROUTER_TUF_6500_%282%29.jpg/960px-ASUS_Wi-Fi_ROUTER_TUF_6500_%282%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/GoPro_Hero_8_Black_and_Hero_11_Black.JPG/960px-GoPro_Hero_8_Black_and_Hero_11_Black.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/2024-02-14_AOK_Niedersachsen_im_Aufhof_Hannover_Beamer_ausrichten.jpg/960px-2024-02-14_AOK_Niedersachsen_im_Aufhof_Hannover_Beamer_ausrichten.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sonos_PLAY_1_wireless_speaker.jpg/960px-Sonos_PLAY_1_wireless_speaker.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2023_Trymer.jpg/960px-2023_Trymer.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Car_dvr_in_my_car.JPG/960px-Car_dvr_in_my_car.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Various_colors_of_polo_shirt_at_JCPenney.jpg/960px-Various_colors_of_polo_shirt_at_JCPenney.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/04/Girl_in_salwar_kameez.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Jeans_mexicanos.jpg/960px-Jeans_mexicanos.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Indian_woman_wearing_choli_and_lehenga%2C_Oct._2019.jpg/960px-Indian_woman_wearing_choli_and_lehenga%2C_Oct._2019.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Mizuno_Wave_Ibuki_2.jpg/960px-Mizuno_Wave_Ibuki_2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Leather_Wallet_with_a_Strap_Closure_-_DPLA_-_01e1cfae03bc0ce9106a5a7d5e4a9981_%28page_1%29.jpg/960px-Leather_Wallet_with_a_Strap_Closure_-_DPLA_-_01e1cfae03bc0ce9106a5a7d5e4a9981_%28page_1%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Shirt%2C_dress_%28AM_1967.118-2%29.jpg/960px-Shirt%2C_dress_%28AM_1967.118-2%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Leather_handbag_by_Les_cuirs_d%27Agathe_%28DSC07738%29.jpg/960px-Leather_handbag_by_Les_cuirs_d%27Agathe_%28DSC07738%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/American_Optical_Original_Pilot_Aviator_sunglasses.jpg/960px-American_Optical_Original_Pilot_Aviator_sunglasses.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Four_analog_wristwatches_with_watch_straps_from_stainless_steel_-_image_1.jpg/960px-Four_analog_wristwatches_with_watch_straps_from_stainless_steel_-_image_1.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Corteiz_Alcatraz_Joggers.jpg/960px-Corteiz_Alcatraz_Joggers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Green_brocade_silk_saree.jpg/960px-Green_brocade_silk_saree.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Converse_Jack_Purcell_sneakers_on_white_canvas.jpg/960px-Converse_Jack_Purcell_sneakers_on_white_canvas.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/eb/Baseball_cap.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Polo_Ralph_Lauren_winter_jacket%2C_red_and_black_plaid.jpg/960px-Polo_Ralph_Lauren_winter_jacket%2C_red_and_black_plaid.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tunic%2C_dress_%28AM_1964.46-2%29.jpg/960px-Tunic%2C_dress_%28AM_1964.46-2%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Laptop_backpacks_from_Mr._DIY_at_Ayala_Center_Cebu_%282025-02-24%29.jpg/960px-Laptop_backpacks_from_Mr._DIY_at_Ayala_Center_Cebu_%282025-02-24%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Zombies_flip_flops.jpg/960px-Zombies_flip_flops.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Women_in_Sport_Bra_and_Leggings_2%2C_by_Andrea_Piacquadio.jpg/960px-Women_in_Sport_Bra_and_Leggings_2%2C_by_Andrea_Piacquadio.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/WP_hoodie_FRONTcBack_Merchandise_shots-36.jpg/960px-WP_hoodie_FRONTcBack_Merchandise_shots-36.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Airfryer_Convert.jpg/960px-Airfryer_Convert.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/A_table-top_mixer-grinder_or_mixie.jpg/960px-A_table-top_mixer-grinder_or_mixie.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Induktionsh%C3%A4ll.JPG/960px-Induktionsh%C3%A4ll.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/General_electric_-_electric_water_kettle.jpg/960px-General_electric_-_electric_water_kettle.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Panasonic_RICE_COOKER_SR-DQ102-N.jpg/960px-Panasonic_RICE_COOKER_SR-DQ102-N.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Panasonic_MICROWAVE_OVEN_NN-GM333W_%282%29.jpg/960px-Panasonic_MICROWAVE_OVEN_NN-GM333W_%282%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Dyson-dc14-origin-upright-vacuum-cleaner-refurbished.jpg/960px-Dyson-dc14-origin-upright-vacuum-cleaner-refurbished.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Electric_Ceramic_Space_Heater_%2832569563908%29.jpg/960px-Electric_Ceramic_Space_Heater_%2832569563908%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/02_Rotating_Ceiling_fan_at_320th_of_a_second.JPG/960px-02_Rotating_Ceiling_fan_at_320th_of_a_second.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Bookstand_with_desk_lamp.jpg/960px-Bookstand_with_desk_lamp.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dinner_plates.jpg/960px-Dinner_plates.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Tiffin_box.jpg/960px-Tiffin_box.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/02/Eureka_Forbes_RO_water_purifier.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Hahn_Stainless_Pan_Range.jpg/960px-Hahn_Stainless_Pan_Range.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Container_storage_at_a_kitchen_pantry_with_different_types_of_food_items_in_jars_and_bottles_at_home.jpg/960px-Container_storage_at_a_kitchen_pantry_with_different_types_of_food_items_in_jars_and_bottles_at_home.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bathroomcarpet.jpg/960px-Bathroomcarpet.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Pink_portable_blender.jpg/960px-Pink_portable_blender.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hoteltoaster_01_%28sk%29.jpg/960px-Hoteltoaster_01_%28sk%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Exhaust_hood_%2829272990684%29.jpg/960px-Exhaust_hood_%2829272990684%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Dinner_Plate_%2848708574133%29.jpg/960px-Dinner_Plate_%2848708574133%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/GandM_Flare_DXM_bat-Purist_156g_ball.jpg/960px-GandM_Flare_DXM_bat-Purist_156g_ball.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Just_a_soccer_ball_%2834782492153%29.jpg/960px-Just_a_soccer_ball_%2834782492153%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Deus_Basketball_Ball.png/960px-Deus_Basketball_Ball.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Rachet%C4%83_de_badminton_%C5%9Fi_flutura%C5%9F.jpg/960px-Rachet%C4%83_de_badminton_%C5%9Fi_flutura%C5%9F.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Exercise_Treadmill_Convey_Motion.jpg/960px-Exercise_Treadmill_Convey_Motion.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Stationary_bicycle.jpg/960px-Stationary_bicycle.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Ghanaian_kid_%28skipping_rope%29_01.jpg/960px-Ghanaian_kid_%28skipping_rope%29_01.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kettlebell_Dead_Snatch_Squat_2_-_Pull.jpg/960px-Kettlebell_Dead_Snatch_Squat_2_-_Pull.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Resistance_band.jpg/960px-Resistance_band.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Boxing_gloves_at_Black_Panter_Gym_at_Jamestown_Accra_Ghana.jpg/960px-Boxing_gloves_at_Black_Panter_Gym_at_Jamestown_Accra_Ghana.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cork_yoga_blocks.jpg/960px-Cork_yoga_blocks.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tennis_Racket_and_Balls.jpg/960px-Tennis_Racket_and_Balls.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/MVP-sports-snacks-water-bottle_%2815093546478%29.jpg/960px-MVP-sports-snacks-water-bottle_%2815093546478%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bulls_Wild_Cup_1_%28Modell_2010%29_20100814.jpg/960px-Bulls_Wild_Cup_1_%28Modell_2010%29_20100814.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Ghanaian_kid_%28skipping_rope%29_02.jpg/960px-Ghanaian_kid_%28skipping_rope%29_02.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Push_Up_Bars-01.jpg/960px-Push_Up_Bars-01.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/2021082701_Handmuskeltrainer-Paar_2021.jpg/960px-2021082701_Handmuskeltrainer-Paar_2021.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Swimming_goggles.JPG/960px-Swimming_goggles.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Samsung_Galaxy_Fit_E.jpg/960px-Samsung_Galaxy_Fit_E.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Basketball_Hoop_%2845655562422%29.jpg/960px-Basketball_Hoop_%2845655562422%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Woman_washes_her_face_at_a_bathroom_sink.jpg/960px-Woman_washes_her_face_at_a_bathroom_sink.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Woman_applying_serum_on_her_face_closeup.jpg/960px-Woman_applying_serum_on_her_face_closeup.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Regla_de_los_dos_dedos.jpg/960px-Regla_de_los_dos_dedos.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Hair_dresser_blowing_client%27s_hair_using_hair_dryer.jpg/960px-Hair_dresser_blowing_client%27s_hair_using_hair_dryer.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Hair_straighteners_%283%29.JPG/960px-Hair_straighteners_%283%29.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Czech_Glass_Perfume_Bottle-2.jpg/960px-Czech_Glass_Perfume_Bottle-2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Lipstick_%28product%29.jpg/960px-Lipstick_%28product%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Be_a_natural_Eyeshadow_nude_palette_%28HEMA%29%2C_Hillegersberg%2C_Rotterdam_%282023%29_01.jpg/960px-Be_a_natural_Eyeshadow_nude_palette_%28HEMA%29%2C_Hillegersberg%2C_Rotterdam_%282023%29_01.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Facial_mask.jpg/960px-Facial_mask.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Aveeno_products_on_shelf.jpg/960px-Aveeno_products_on_shelf.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Shampoo.png/960px-Shampoo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Shaving_Brush_and_Beard_Oil_%282015-03-26_13.29.30_by_Nan_Palmer%29.jpg/960px-Shaving_Brush_and_Beard_Oil_%282015-03-26_13.29.30_by_Nan_Palmer%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Antique_manicure_set_%2811081763643%29.jpg/960px-Antique_manicure_set_%2811081763643%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Jade_roller_%26_Gua_Sha_%28Dirk_van_den_Broek%29%2C_Hillegersberg%2C_Rotterdam_%282023%29_02.jpg/960px-Jade_roller_%26_Gua_Sha_%28Dirk_van_den_Broek%29%2C_Hillegersberg%2C_Rotterdam_%282023%29_02.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Konjac_sponge.jpg/960px-Konjac_sponge.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Argan_oil_02.jpg/960px-Argan_oil_02.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Makeup-brush-tips.jpg/960px-Makeup-brush-tips.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/f/fc/Under_eye_cream.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3e/Bench_i_sport_body_spray.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Electric_Bath-Brush_-_DPLA_-_464c54b95eb10cf7fe36d8d0f25f3e0d_%28page_1%29.jpg/960px-Electric_Bath-Brush_-_DPLA_-_464c54b95eb10cf7fe36d8d0f25f3e0d_%28page_1%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Seattle_%28WA%2C_USA%29%2C_Pike_Street%2C_E-Scooter_--_2022_--_1462.jpg/960px-Seattle_%28WA%2C_USA%29%2C_Pike_Street%2C_E-Scooter_--_2022_--_1462.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Male_boxer_shorts.jpg/960px-Male_boxer_shorts.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Pajamas_MET_1979.119a.jpg/960px-Pajamas_MET_1979.119a.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Maya_Late_Classic_Polychrome_Ceramic_Vase%2C_13cm.jpg/960px-Maya_Late_Classic_Polychrome_Ceramic_Vase%2C_13cm.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Building_blocks_design-2.jpg/960px-Building_blocks_design-2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Nintendo_labo_rc_car.jpeg/960px-Nintendo_labo_rc_car.jpeg',
  'https://upload.wikimedia.org/wikipedia/commons/c/cf/Teddy_bear_soft_toy.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Chess_game_Staunton_No._6_perfil_view_8.jpg/960px-Chess_game_Staunton_No._6_perfil_view_8.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Rosenberg_RailRoad_Museum_model_train_set.jpg/960px-Rosenberg_RailRoad_Museum_model_train_set.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Trefl_Puzzles_1000_pieces.jpg/960px-Trefl_Puzzles_1000_pieces.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Stack_of_men%27s_casual_shirts.jpg/960px-Stack_of_men%27s_casual_shirts.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Man_in_checked_yellow_shirt.jpg/960px-Man_in_checked_yellow_shirt.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Printed_tshirt.jpg/960px-Printed_tshirt.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Kurta_pajamas_for_men_Indian_Dress.jpg/960px-Kurta_pajamas_for_men_Indian_Dress.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Young_man_wearing_jorts_%28denim_shorts%29.jpg/960px-Young_man_wearing_jorts_%28denim_shorts%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Mulmul_cotton_Saree.jpg/960px-Mulmul_cotton_Saree.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/HK_white_clothing_tank_top_Flexer8_brand_man_October_2025_N13P.jpg/960px-HK_white_clothing_tank_top_Flexer8_brand_man_October_2025_N13P.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Welock_Touch41_fingerprint_lock_on_door.png/960px-Welock_Touch41_fingerprint_lock_on_door.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/UC_Syd%2C_CCTV_camera.jpg/960px-UC_Syd%2C_CCTV_camera.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Computer_monitor_remix_transparent.png/960px-Computer_monitor_remix_transparent.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/SAMSUNG_SOUNDBAR_HW-J250.jpg/960px-SAMSUNG_SOUNDBAR_HW-J250.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Virtuality_1000CS_VR_Headset.jpg/960px-Virtuality_1000CS_VR_Headset.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Digital_photo_frame_with_picture.jpg/960px-Digital_photo_frame_with_picture.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Wireless_Charging_Pad.jpg/960px-Wireless_Charging_Pad.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Ring_Video_Doorbell_2.jpg/960px-Ring_Video_Doorbell_2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_home_Mini.jpg/960px-Google_home_Mini.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Traditional_Kurta_Indian_Style.jpg/960px-Traditional_Kurta_Indian_Style.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Golden_hour_to_sunset_-_2019-08-27_19-22a_-_modelled_by_Marina_Daschner.jpg/960px-Golden_hour_to_sunset_-_2019-08-27_19-22a_-_modelled_by_Marina_Daschner.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Maxim_Sakaschansky_Kaftan_1930.jpg/960px-Maxim_Sakaschansky_Kaftan_1930.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/69/Chiemsee_shorts.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Pleated_skirt_with_black_opaque_tights.jpg/960px-Pleated_skirt_with_black_opaque_tights.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Levi_Strauss_Plaza%2C_khaki_trousers_-_panoramio.jpg/960px-Levi_Strauss_Plaza%2C_khaki_trousers_-_panoramio.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Colored_silk_scarf_from_India_04.jpg/960px-Colored_silk_scarf_from_India_04.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Traditional_Sun_Hat.jpg/960px-Traditional_Sun_Hat.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3d/Kitchen_Knife_Deba.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Hamilton_Beach_Food_Processor.jpg/960px-Hamilton_Beach_Food_Processor.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/40/Sandwich_toaster_closed.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/POPCORN_MACHINE_MAKER_POPPER.jpg/960px-POPCORN_MACHINE_MAKER_POPPER.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Coffee_grinder_2.jpg/960px-Coffee_grinder_2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Thermos_flask_Termoverken.jpg/960px-Thermos_flask_Termoverken.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Casserole_with_cover_MET_155276.jpg/960px-Casserole_with_cover_MET_155276.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/94/Mexican_water_dispenser.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Glass_jars%2C_glass_bottles_in_the_kitchen%2C_Rostov-on-Don%2C_Russia.jpg/960px-Glass_jars%2C_glass_bottles_in_the_kitchen%2C_Rostov-on-Don%2C_Russia.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Punching_Bag.jpg/960px-Punching_Bag.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Van_Rysel%2C_Cycling_World_Europe_2025%2C_Meerbusch_%28P1045127%29.jpg/960px-Van_Rysel%2C_Cycling_World_Europe_2025%2C_Meerbusch_%28P1045127%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Yasaka_Rising_Dragon2.jpg/960px-Yasaka_Rising_Dragon2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bench_press.png/960px-Bench_press.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Fishing_rod_bells.jpg/960px-Fishing_rod_bells.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Aloe_vera_gel_%2820241107%29.jpg/960px-Aloe_vera_gel_%2820241107%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Baroy_Lanao_Hair_conditioner_serum_Jasminum_essential_virgin_coconut_oil1.jpg/960px-Baroy_Lanao_Hair_conditioner_serum_Jasminum_essential_virgin_coconut_oil1.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/37/Color-options-for-nail-gel-polish-gel-lac-by-diamond-nails.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e8/Chapstick.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/0/09/Rubik-cube-1980-no-logo.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Daisy_No_72_Double_Barreled_Squirt-O-Matic-NMAH-AHB2015q031613.jpg/960px-Daisy_No_72_Double_Barreled_Squirt-O-Matic-NMAH-AHB2015q031613.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Annaberg-Buchholz_toys_museum_doll_house_old.jpg/960px-Annaberg-Buchholz_toys_museum_doll_house_old.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Uavtek_Bug_FX_Nano_UAS_Quadcopter_1A.jpg/960px-Uavtek_Bug_FX_Nano_UAS_Quadcopter_1A.jpg',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Denim_jacket_details.jpg/960px-Denim_jacket_details.jpg',
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
          image: offerImages[offerIdx - 1],
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

