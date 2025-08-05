import express from 'express'; // Default

// Import "user" controller functions
import { createUser, getUsers, getUserById } from '../controllers/user.controller.js';

const router = express.Router(); // Default

// Define routes for "user" operations
router.post('/', createUser); 
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router; // Default
