
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';

// Utilise une base dédiée aux tests
const TEST_URI =
  process.env.MONGO_URI_TEST ||
  process.env.MONGO_URI?.replace('port_plaisance', 'port_plaisance_test') ||
  'mongodb://localhost:27017/port_plaisance_test';

export let agent;      // supertest agent
export let token;      // JWT admin

export async function connectTestDB() {
  await mongoose.connect(TEST_URI, { autoIndex: true });
}

export async function clearDB() {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    // évite de dropper system indexes
    if (!c.collectionName.startsWith('system.')) await c.deleteMany({});
  }
}

export async function closeDB() {
  await mongoose.connection.close();
}


export async function ensureAdminAndLogin() {
  agent = request.agent(app);

 
  const adminPayload = {
    name: 'AdminTest',
    email: process.env.ADMIN_EMAIL || 'admin@test.com',
    password: process.env.ADMIN_PASSWORD || 'secret123'
  };


  const resLogin = await agent
    .post('/api/auth/login')
    .send({ email: adminPayload.email, password: adminPayload.password });

  
  if (resLogin.status !== 200) {
    
    const { default: User } = await import('../src/models/User.js');
    const u = new User(adminPayload);
    await u.save();

    
    const res2 = await agent
      .post('/api/auth/login')
      .send({ email: adminPayload.email, password: adminPayload.password });

    if (res2.status !== 200) {
      throw new Error('Impossible de se connecter en admin pour les tests');
    }
    token = res2.body.token;
  } else {
    token = resLogin.body.token;
  }
}
