require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const signatures = [
  {
    name: "Nonna's Famous Tiramisu",
    imageUrl: 'https://sinonnas.com/wp-content/uploads/2024/08/Tiramisu-without-mint-leave-480x436.jpg',
    category: 'desserts',
    description: 'Our legendary Tiramisu — layers of espresso-soaked ladyfingers, mascarpone cream, and a dusting of Valrhona cocoa.',
    price: 349,
    isSignature: true,
    is_available: true,
  },
  {
    name: 'Spicy Chicken & Jalapeño',
    imageUrl: 'https://sinonnas.com/wp-content/uploads/2022/12/Pollo-alla-Diavola.jpg',
    category: 'pizzas',
    description: 'Tender chicken, fresh jalapeños, mozzarella, and our signature diavola sauce on a 24-hour fermented sourdough base.',
    price: 649,
    isVeg: false,
    isSignature: true,
    is_available: true,
  },
  {
    name: 'Eggplant Parmigiana',
    imageUrl: 'https://sinonnas.com/wp-content/uploads/2022/12/DSC00018-1.png',
    category: 'pizzas',
    description: 'Oven-roasted eggplant, San Marzano tomato, fresh basil, and aged Parmigiano Reggiano on a crispy sourdough crust.',
    price: 549,
    isVeg: true,
    isSignature: true,
    is_available: true,
  },
  {
    name: 'No.6 — Chicken N Pesto',
    imageUrl: 'https://sinonnas.com/wp-content/uploads/2022/12/DSC05508.png',
    category: 'pizzas',
    description: 'Grilled chicken, house-made basil pesto, cherry tomatoes, and stracciatella on a golden sourdough base.',
    price: 599,
    isVeg: false,
    isSignature: true,
    is_available: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to Atlas\n');

  // First clear isSignature from any existing items
  await MenuItem.updateMany({ isSignature: true }, { isSignature: false });
  console.log('Cleared old signature flags\n');

  for (const s of signatures) {
    const result = await MenuItem.findOneAndUpdate(
      { name: s.name },
      { $set: s },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ "${result.name}"`);
    console.log(`   id: ${result._id}`);
    console.log(`   img: ${result.imageUrl}\n`);
  }

  console.log('Done! 4 signature items are live on the homepage.');
  process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
