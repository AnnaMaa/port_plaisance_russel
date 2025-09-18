// src/app.js
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// --- middlewares globaux (ORDRE IMPORTANT) ---
app.use(helmet());
app.use(cors({ credentials: true, origin: true }));
app.use(morgan('dev'));
app.use(express.json());            // ✅ doit être AVANT app.use('/api', routes)
app.use(cookieParser());

// --- statiques ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const docsDir   = path.join(__dirname, '..', 'docs');

app.use(express.static(publicDir));
app.use('/docs', express.static(docsDir));

// --- API ---
app.use('/api', routes);

// --- Page d’accueil ---
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

export default app;
