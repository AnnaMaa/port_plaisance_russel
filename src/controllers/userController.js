import { createUser, updateUser, deleteUser, getUser } from '../services/userService.js';
export const postUser = async (req, res) => res.status(201).json(await createUser(req.body));
export const putUser = async (req, res) => res.json(await updateUser(req.params.id, req.body));
export const deleteUserCtrl = async (req, res) => { await deleteUser(req.params.id); res.status(204).end(); };
export const getUserCtrl = async (req, res) => res.json(await getUser(req.params.id));
