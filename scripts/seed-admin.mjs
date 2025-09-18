
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/port_plaisance';
  await mongoose.connect(uri, { autoIndex: true });

  const email = process.env.ADMIN_EMAIL || 'admin@test.com';
  const password = process.env.ADMIN_PASSWORD || 'secret123';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`✔ Admin existe déjà (${email}). Rien à faire.`);
  } else {
    await User.create({ name, email, password });
    console.log(`🎉 Admin créé: ${email} / ${password}`);
  }

  await mongoose.connection.close();
};

run().catch(e => {
  console.error('Seed admin failed:', e);
  process.exit(1);
});
