import User from '../models/User.js';
export const createUser = (data) => User.create(data);
export const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUser = (id) => User.findByIdAndDelete(id);
export const findUserByEmail = (email) => User.findOne({ email });
export const getUser = (id) => User.findById(id);
