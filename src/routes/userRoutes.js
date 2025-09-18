import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { postUser, putUser, deleteUserCtrl, getUserCtrl } from '../controllers/userController.js';
const r = Router();
r.post('/', requireAuth, postUser);
r.get('/:id', requireAuth, getUserCtrl);
r.put('/:id', requireAuth, putUser);
r.delete('/:id', requireAuth, deleteUserCtrl);
export default r;
