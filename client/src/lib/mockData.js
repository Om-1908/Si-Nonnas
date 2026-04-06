// Centralised mock data for development — used as fallbacks when API calls fail
export const mockMenuItems = [
  { _id: 'm1', name: 'Margherita No. 1', description: 'San Marzano tomatoes, fresh buffalo mozzarella, hand-torn basil, and extra virgin olive oil on our 48-hour fermented sourdough base.', price: 449, category: 'pizzas', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { _id: 'm2', name: 'Piccante Diavola No. 4', description: 'Spicy Ventricina salami, nduja, mozzarella, and fermented chili honey drizzle.', price: 599, category: 'pizzas', isVeg: false, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
  { _id: 'm3', name: 'The Truffle Hunter', description: 'Black truffle cream, wild forest mushrooms, fior di latte, and shaved parmesan.', price: 749, category: 'pizzas', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400' },
  { _id: 'm4', name: 'Mortadella & Pistachio', description: 'Stracciatella cheese, thinly sliced Mortadella, and crushed Bronte pistachios.', price: 699, category: 'pizzas', isVeg: false, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { _id: 'm5', name: 'Pesto Genovese No. 7', description: 'Basil pesto base, toasted pine nuts, parmigiano reggiano, and fresh cream.', price: 549, category: 'pizzas', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { _id: 'm6', name: 'Garlic Sourdough', description: 'Confit garlic, parsley salt, and extra virgin olive oil on our house sourdough.', price: 249, category: 'bites', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400' },
  { _id: 'm7', name: 'Bruschetta Trio', description: 'Classic tomato & basil, ricotta & honey, and nduja & stracciatella on toasted sourdough.', price: 349, category: 'bites', isVeg: false, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400' },
  { _id: 'm8', name: 'Insalata Verde', description: 'Leafy greens, heirloom cherry tomatoes, toasted walnuts, and balsamic reduction.', price: 349, category: 'salads', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
  { _id: 'm9', name: 'Tiramisu Artisanal', description: 'Traditional recipe with Marsala wine, mascarpone cream, and espresso-soaked ladyfingers.', price: 399, category: 'desserts', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
  { _id: 'm10', name: 'Peroni Nastro Azzurro', description: 'The crisp and refreshing Italian classic.', price: 399, category: 'beer_wine', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400' },
  { _id: 'm11', name: 'Espresso', description: 'Double-shot Italian espresso using our house-roasted blend.', price: 149, category: 'coffee', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400' },
  { _id: 'm12', name: 'Pistachio Gelato', description: 'Made with real Bronte pistachios. Rich, nutty, and utterly authentic.', price: 249, category: 'gelatos', isVeg: true, is_available: true, imageUrl: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400' },
];

export const mockOrders = [
  { _id: 'o1', orderNumber: 'SN-1001', tableNumber: '5', orderType: 'dine-in', status: 'new', items: [{ name: 'Margherita No. 1', price: 449, qty: 2 }, { name: 'Garlic Sourdough', price: 249, qty: 4 }], subtotal: 1894, tax: 95, total: 1989, createdAt: new Date(Date.now() - 16 * 60000).toISOString(), user: { name: 'Anika Sharma' } },
  { _id: 'o2', orderNumber: 'SN-1002', tableNumber: '3', orderType: 'dine-in', status: 'preparing', items: [{ name: 'Truffle Hunter', price: 749, qty: 1 }, { name: 'Garlic Sourdough', price: 249, qty: 2 }], subtotal: 1247, tax: 62, total: 1309, createdAt: new Date(Date.now() - 10 * 60000).toISOString(), user: { name: 'Rahul Mehta' } },
  { _id: 'o3', orderNumber: 'SN-1003', tableNumber: '8', orderType: 'dine-in', status: 'new', items: [{ name: 'Margherita No. 1', price: 449, qty: 2 }, { name: 'Pesto Chicken Panuozzo', price: 479, qty: 1 }], subtotal: 1377, tax: 69, total: 1446, createdAt: new Date(Date.now() - 2 * 60000).toISOString(), user: { name: 'Priya Iyer' } },
  { _id: 'o4', orderNumber: 'SN-1004', tableNumber: '1', orderType: 'dine-in', status: 'ready', items: [{ name: 'Diavola No. 4', price: 599, qty: 1 }, { name: 'Tiramisu Artisanal', price: 399, qty: 1 }], subtotal: 998, tax: 50, total: 1048, createdAt: new Date(Date.now() - 18 * 60000).toISOString(), user: { name: 'Vikram Singh' } },
  { _id: 'o5', orderNumber: 'SN-1005', tableNumber: '12', orderType: 'takeaway', status: 'ready', items: [{ name: 'Burrata Special', price: 449, qty: 3 }], subtotal: 1347, tax: 67, total: 1414, createdAt: new Date(Date.now() - 24 * 60000).toISOString(), user: { name: 'Meera Patel' } },
];

export const mockReservations = [
  { _id: 'r1', name: 'Neha Kapoor', phone: '+91 9876543210', date: new Date(Date.now() + 86400000).toISOString(), time: '19:00', guests: 4, status: 'pending', email: 'neha@example.com' },
  { _id: 'r2', name: 'Arjun Reddy', phone: '+91 9876543211', date: new Date(Date.now() + 86400000).toISOString(), time: '20:30', guests: 2, status: 'confirmed', email: 'arjun@example.com' },
  { _id: 'r3', name: 'Sanya Malhotra', phone: '+91 9876543212', date: new Date(Date.now() + 172800000).toISOString(), time: '13:00', guests: 6, status: 'pending', email: 'sanya@example.com' },
];

export const mockReviews = [
  { _id: 'rv1', rating: 5, comment: 'Best sourdough in Mumbai! The crust was perfectly charred and the atmosphere feels like an authentic Roman corner.', user: { name: 'Anika S.' }, order: { orderNumber: 'SN-1001' }, createdAt: new Date(Date.now() - 86400000).toISOString(), reply: '' },
  { _id: 'rv2', rating: 4, comment: 'The Diavola is truly spicy and flavorful. Staff was extremely attentive during the rush.', user: { name: 'Rahul M.' }, order: { orderNumber: 'SN-1002' }, createdAt: new Date(Date.now() - 172800000).toISOString(), reply: 'Thank you Rahul! Glad you enjoyed the heat 🌶️' },
  { _id: 'rv3', rating: 5, comment: 'Tiramisu was heavenly. Best Italian dessert outside Italy!', user: { name: 'Priya I.' }, order: { orderNumber: 'SN-1003' }, createdAt: new Date(Date.now() - 259200000).toISOString(), reply: '' },
];

export const mockPayments = [
  { _id: 'p1', order: { orderNumber: 'SN-1001', total: 1989 }, razorpayOrderId: 'order_abc123', razorpayPaymentId: 'pay_xyz789', amount: 1989, currency: 'INR', status: 'captured', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'p2', order: { orderNumber: 'SN-1002', total: 1309 }, razorpayOrderId: 'order_def456', razorpayPaymentId: 'pay_uvw321', amount: 1309, currency: 'INR', status: 'captured', createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export const mockAnalyticsSummary = {
  todayRevenue: 142500,
  activeOrders: 12,
  avgOrderValue: 1245,
  totalOrdersToday: 22,
  completedToday: 19,
  pendingReservations: 8,
  lowStockAlerts: 3,
};

export const mockRevenueData = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
  revenue: Math.floor(15000 + Math.random() * 20000),
  orders: Math.floor(10 + Math.random() * 25),
}));

export const mockTopItems = [
  { name: 'Margherita No. 1', qty: 142, revenue: 63758 },
  { name: 'Piccante Diavola', qty: 98, revenue: 58602 },
  { name: 'Garlic Sourdough', qty: 87, revenue: 21663 },
  { name: 'Truffle Hunter', qty: 65, revenue: 48685 },
  { name: 'Tiramisu Artisanal', qty: 58, revenue: 23142 },
];

export const mockOrdersByHour = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  count: i >= 11 && i <= 22 ? Math.floor(2 + Math.random() * 12) : Math.floor(Math.random() * 2),
}));

export const mockSlots = {
  slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
};

export const CATEGORY_LABELS = {
  pizzas: 'Sourdough Pizzas',
  panzerotto: 'Panzerottos',
  panuozzos: 'Panuozzos',
  bites: 'Bites to Start',
  fried: 'Fried',
  salads: 'Salads',
  dips: 'Homemade Dips',
  desserts: 'Desserts',
  coffee: 'Coffee & More',
  beer_wine: 'Beer & Wine',
  beverages: 'Beverages',
  soft_drinks: 'Soft Drinks',
  gelatos: 'Gelatos',
  sides: 'Sides',
};
