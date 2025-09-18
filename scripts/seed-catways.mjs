
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises';
import mongoose from 'mongoose';
import Catway from '../src/models/Catway.js';

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/port_plaisance';
  await mongoose.connect(uri, { autoIndex: true });

  const raw = await fs.readFile(new URL('../catways.json', import.meta.url), 'utf-8');
  const items = JSON.parse(raw);

  // Upsert par catwayNumber (évite les doublons si relancé)
  const ops = items.map(doc => ({
    updateOne: {
      filter: { catwayNumber: doc.catwayNumber },
      update: { $set: doc },
      upsert: true
    }
  }));

  const res = await Catway.bulkWrite(ops);
  console.log('Catways upserted/modified:', res.nUpserted + res.nModified);

  const count = await Catway.countDocuments();
  console.log('Total catways in DB:', count);

  await mongoose.connection.close();
};

run().catch(e => {
  console.error('Seed catways failed:', e);
  process.exit(1);
});
