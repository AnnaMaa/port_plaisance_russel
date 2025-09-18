import { listReservationsForCatway, getReservation, createReservation, removeReservation, listAllReservations } from '../services/reservationService.js';
import { getCatway } from '../services/catwayService.js';

export const getReservations = async (_req, res) => res.json(await listAllReservations());
export const getReservationsForCatway = async (req, res) => {
  const catway = await getCatway(req.params.id);
  if(!catway) return res.status(404).json({ message: 'Catway not found' });
  res.json(await listReservationsForCatway(catway._id));
};
export const getReservationDetail = async (req, res) => {
  const r = await getReservation(req.params.idReservation);
  return r ? res.json(r) : res.status(404).json({ message: 'Not found' });
};
export const postReservation = async (req, res) => {
  const catway = await getCatway(req.params.id);
  if(!catway) return res.status(404).json({ message: 'Catway not found' });
  const payload = { ...req.body, catwayId: catway._id, catwayNumber: catway.catwayNumber };
  res.status(201).json(await createReservation(payload));
};
export const deleteReservationCtrl = async (req, res) => { await removeReservation(req.params.idReservation); res.status(204).end(); };
