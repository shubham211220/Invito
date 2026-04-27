require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/modules/user/user.model.js');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.updateOne({ email: 'study10.shubh@gmail.com' }, { $set: { role: 'admin' } });
  console.log('Updated user to admin');
  process.exit(0);
});
