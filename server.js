import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
}).catch((e) => { console.error(e); process.exit(1); });

