import { listCatways, getCatway, createCatway, replaceCatway, patchCatway, removeCatway } from '../services/catwayService.js';
export const getCatways = async (_req, res) => res.json(await listCatways());
export const getCatwayById = async (req, res) => {
  const c = await getCatway(req.params.id);
  return c ? res.json(c) : res.status(404).json({ message: 'Not found' });
};
export const postCatway = async (req, res) => res.status(201).json(await createCatway(req.body));
export const putCatway = async (req, res) => res.json(await replaceCatway(req.params.id, req.body));
export const patchCatwayCtrl = async (req, res) => res.json(await patchCatway(req.params.id, req.body));
export const deleteCatway = async (req, res) => { await removeCatway(req.params.id); res.status(204).end(); };
