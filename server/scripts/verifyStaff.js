require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('../models/User');
  const users = await User.find({ role: { $in: ['manager', 'kitchen_staff'] } }).select('name email role');
  if (users.length === 0) {
    console.log('❌ No manager/kitchen users found in Atlas');
  } else {
    users.forEach(u => console.log(`✅ ${u.role.padEnd(14)} ${u.name} <${u.email}>`));
  }
  process.exit(0);
}).catch(e => { console.error('Connection error:', e.message); process.exit(1); });
