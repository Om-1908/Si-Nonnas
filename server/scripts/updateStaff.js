require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to Atlas');

  // Lazy-load model to avoid re-compile errors if run alongside server
  const User = require('../models/User');

  const staff = [
    {
      name: 'Pranjal Bhamare',
      email: 'ppbhamare@gmail.com',
      password: 'sino@manager9',
      role: 'manager',
      phone: '+91 9000000001',
    },
    {
      name: 'Prathamesh Shevkar',
      email: 'pratham1@gmail.com',
      password: 'sino@chef9',
      role: 'kitchen_staff',
      phone: '+91 9000000002',
    },
  ];

  for (const s of staff) {
    const hash = await bcrypt.hash(s.password, 12);
    const result = await User.findOneAndUpdate(
      { email: s.email },
      { name: s.name, email: s.email, password: hash, role: s.role, phone: s.phone },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ ${result.role.padEnd(14)} ${result.name} <${result.email}>`);
  }

  console.log('\nDone! You can now log in with:');
  console.log('  Manager : ppbhamare@gmail.com  / sino@manager9');
  console.log('  Kitchen : pratham1@gmail.com   / sino@chef9');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
