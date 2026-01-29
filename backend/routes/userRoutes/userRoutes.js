import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from '../../controllers/userController/userController.js';

const userRoutes = express.Router();

// Public routes
userRoutes.post('/register', createUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUser);

// Protected routes (add authentication middleware later)
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;
