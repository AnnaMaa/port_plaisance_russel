import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import catwayRoutes from './catwayRoutes.js';
import { getReservations } from '../controllers/reservationController.js';
import { requireAuth } from '../middlewares/auth.js';

const r = Router();
r.use('/auth', authRoutes);
r.use('/users', userRoutes);
r.use('/catways', catwayRoutes);
r.get('/reservations', requireAuth, getReservations);
export default r;
