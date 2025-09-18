import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
const r = Router();
r.post('/login', login);
r.post('/logout', logout);
export default r;
