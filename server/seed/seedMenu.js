require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const users = [
  { name: 'Test Customer', email: 'customer@test.com', password: 'test123', role: 'customer', phone: '+91 9876543210' },
  { name: 'Marco Rossi', email: 'kitchen@test.com', password: 'test123', role: 'kitchen_staff', phone: '+91 9876543211' },
  { name: 'Nonna Lucia', email: 'manager@test.com', password: 'test123', role: 'manager', phone: '+91 9876543212' },
];

const menuItems = [
  // ═══════════════════════ PIZZAS ═══════════════════════
  { name: 'Margherita No. 1', description: 'San Marzano tomatoes, fresh buffalo mozzarella, hand-torn basil, and extra virgin olive oil on our 48-hour fermented sourdough base.', price: 449, category: 'pizzas', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600', is_available: true },
  { name: 'Piccante Diavola No. 4', description: 'Spicy Ventricina salami, nduja, mozzarella, and fermented chili honey drizzle.', price: 599, category: 'pizzas', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600', is_available: true },
  { name: 'The Truffle Hunter', description: 'Black truffle cream, wild forest mushrooms, fior di latte, and shaved parmesan.', price: 749, category: 'pizzas', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600', is_available: true },
  { name: 'Mortadella & Pistachio', description: 'Stracciatella cheese, thinly sliced Mortadella, and crushed Bronte pistachios.', price: 699, category: 'pizzas', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', is_available: true },
  { name: 'Pesto Genovese No. 7', description: 'Basil pesto base, toasted pine nuts, parmigiano reggiano, and fresh cream. Pure Ligurian bliss.', price: 549, category: 'pizzas', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', is_available: true },
  { name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, fontina, and parmigiano reggiano with a touch of honey.', price: 649, category: 'pizzas', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=600', is_available: true },
  { name: 'Prosciutto e Rucola', description: 'San Daniele prosciutto, wild rocket, shaved parmesan, and balsamic reduction.', price: 699, category: 'pizzas', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600', is_available: true },
  { name: 'Nduja & Burrata', description: 'Spicy nduja spread, creamy burrata, semi-dried cherry tomatoes, and basil.', price: 749, category: 'pizzas', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600', is_available: true },

  // ═══════════════════════ PANUOZZOS ═══════════════════════
  { name: 'Classico Panuozzo', description: 'Prosciutto cotto, mozzarella, and roasted peppers in a crispy sourdough shell.', price: 449, category: 'panuozzos', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600', is_available: true },
  { name: 'Vegetariano Panuozzo', description: 'Sautéed wild mushrooms, charred bell peppers, provolone cheese, and a spread of truffle mayo.', price: 399, category: 'panuozzos', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600', is_available: true },
  { name: 'Pollo Panuozzo', description: 'Herb-marinated grilled chicken, sun-dried tomatoes, mozzarella, and pesto aioli.', price: 479, category: 'panuozzos', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600', is_available: true },

  // ═══════════════════════ BITES ═══════════════════════
  { name: 'Garlic Sourdough', description: 'Confit garlic, parsley salt, and extra virgin olive oil on our house sourdough.', price: 249, category: 'bites', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600', is_available: true },
  { name: 'Bruschetta Trio', description: 'Classic tomato & basil, ricotta & honey, and nduja & stracciatella on toasted sourdough.', price: 349, category: 'bites', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600', is_available: true },
  { name: 'Olives & Focaccia', description: 'Castelvetrano olives, rosemary focaccia, and whipped lemon ricotta.', price: 299, category: 'bites', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600', is_available: true },

  // ═══════════════════════ FRIED ═══════════════════════
  { name: 'Arancini', description: 'Crispy saffron risotto balls stuffed with mozzarella and ragù. Served with marinara.', price: 349, category: 'fried', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600', is_available: true },
  { name: 'Fritto Misto', description: 'Lightly fried calamari, prawns, and zucchini with lemon aioli.', price: 499, category: 'fried', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600', is_available: true },

  // ═══════════════════════ SALADS ═══════════════════════
  { name: 'Insalata Verde', description: 'A rustic mix of leafy greens, heirloom cherry tomatoes, toasted walnuts, and our signature balsamic reduction.', price: 349, category: 'salads', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', is_available: true },
  { name: 'Burrata Caprese', description: 'Fresh burrata, heirloom tomatoes, basil, aged balsamic, and EVOO.', price: 449, category: 'salads', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600', is_available: true },

  // ═══════════════════════ DIPS ═══════════════════════
  { name: 'Truffle Hummus', description: 'Chickpea hummus infused with black truffle oil and served with sourdough crisps.', price: 249, category: 'dips', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1637361973-1d4abeb9a7e9?w=600', is_available: true },
  { name: 'Nduja Dip', description: 'Spicy Calabrian nduja blended with cream cheese and served warm.', price: 279, category: 'dips', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?w=600', is_available: true },

  // ═══════════════════════ DESSERTS ═══════════════════════
  { name: 'Tiramisu Artisanal', description: 'Traditional recipe with Marsala wine, mascarpone cream, and espresso-soaked ladyfingers.', price: 399, category: 'desserts', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600', is_available: true },
  { name: 'Panna Cotta', description: 'Vanilla bean panna cotta with seasonal berry compote and crispy amaretti crumble.', price: 349, category: 'desserts', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', is_available: true },
  { name: 'Cannoli Siciliani', description: 'Crispy shells filled with sweet ricotta, candied orange, and dark chocolate chips.', price: 299, category: 'desserts', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600', is_available: true },

  // ═══════════════════════ COFFEE ═══════════════════════
  { name: 'Espresso', description: 'Double-shot Italian espresso using our house-roasted blend.', price: 149, category: 'coffee', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600', is_available: true },
  { name: 'Cappuccino', description: 'Creamy, frothy perfection with our signature espresso.', price: 199, category: 'coffee', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600', is_available: true },
  { name: 'Affogato', description: 'Vanilla gelato drowned in a shot of hot espresso. Simple perfection.', price: 249, category: 'coffee', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=600', is_available: true },

  // ═══════════════════════ BEER & WINE ═══════════════════════
  { name: 'Peroni Nastro Azzurro', description: 'The crisp and refreshing Italian classic. Perfectly paired with sourdough.', price: 399, category: 'beer_wine', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600', is_available: true },
  { name: 'Sangiovese House Red', description: 'Medium-bodied with notes of cherry and herbs. Elegant and structural.', price: 499, category: 'beer_wine', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600', is_available: true },
  { name: 'Pinot Grigio', description: 'Light, crisp white wine with citrus notes. Perfect with seafood and salads.', price: 449, category: 'beer_wine', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600', is_available: true },

  // ═══════════════════════ SOFT DRINKS ═══════════════════════
  { name: 'San Pellegrino', description: 'Sparkling natural mineral water from the Italian Alps.', price: 149, category: 'soft_drinks', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600', is_available: true },
  { name: 'Limonata', description: 'Sicilian lemon sparkling drink. Sweet, tart, and refreshing.', price: 179, category: 'soft_drinks', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600', is_available: true },

  // ═══════════════════════ GELATOS ═══════════════════════
  { name: 'Pistachio Gelato', description: 'Made with real Bronte pistachios. Rich, nutty, and utterly authentic.', price: 249, category: 'gelatos', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600', is_available: true },
  { name: 'Stracciatella Gelato', description: 'Creamy fior di latte with shards of dark chocolate throughout.', price: 249, category: 'gelatos', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600', is_available: true },
  { name: 'Limone Sorbetto', description: 'Intensely refreshing lemon sorbet. Dairy-free and zesty.', price: 199, category: 'gelatos', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600', is_available: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Seed users (password hashed by pre-save hook)
    for (const u of users) {
      await User.create(u);
    }
    console.log(`Seeded ${users.length} users`);

    // Seed menu items
    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items`);

    console.log('\n✅ Seed complete!');
    console.log('Test logins:');
    console.log('  Customer: customer@test.com / test123');
    console.log('  Kitchen:  kitchen@test.com  / test123');
    console.log('  Manager:  manager@test.com  / test123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
