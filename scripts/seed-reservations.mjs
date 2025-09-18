
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises';
import mongoose from 'mongoose';
import Reservation from '../src/models/Reservation.js';
import Catway from '../src/models/Catway.js';

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/port_plaisance';
    await mongoose.connect(uri, { autoIndex: true });
    console.log('MongoDB connected');

    
    const raw = await fs.readFile(new URL('../reservations.json', import.meta.url), 'utf-8');
    const items = JSON.parse(raw);

    let inserted = 0;
    for (const item of items) {
      const catway = await Catway.findOne({ catwayNumber: item.catwayNumber });
      if (!catway) {
        console.warn(`⚠️ Catway ${item.catwayNumber} introuvable. Réservation ignorée.`);
        continue;
      }

      const reservation = {
        ...item,
        catwayId: catway._id,
      };

      // Vérifie si une réservation identique existe déjà
      const exists = await Reservation.findOne({
        catwayNumber: reservation.catwayNumber,
        clientName: reservation.clientName,
        boatName: reservation.boatName,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut
      });

      if (!exists) {
        await Reservation.create(reservation);
        inserted++;
        console.log(`✅ Réservation ajoutée pour catway ${item.catwayNumber} (${item.clientName})`);
      } else {
        console.log(`↪️ Réservation déjà existante pour ${item.clientName} sur catway ${item.catwayNumber}`);
      }
    }

    const count = await Reservation.countDocuments();
    console.log(`Total réservations en base: ${count} (ajoutées: ${inserted})`);

    await mongoose.connection.close();
  } catch (e) {
    console.error('Seed reservations failed:', e);
    process.exit(1);
  }
};

run();
