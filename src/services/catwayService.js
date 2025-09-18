import Catway from '../models/Catway.js';
export const listCatways = () => Catway.find().sort({ catwayNumber: 1 });
export const getCatway = (id) => Catway.findById(id);
export const createCatway = (data) => Catway.create(data);
export const replaceCatway = (id, data) => Catway.findByIdAndUpdate(id, data, { new: true, overwrite: true });
export const patchCatway = (id, data) => Catway.findByIdAndUpdate(id, data, { new: true });
export const removeCatway = (id) => Catway.findByIdAndDelete(id);
export const getByNumber = (num) => Catway.findOne({ catwayNumber: num });
