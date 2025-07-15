<<<<<<< Updated upstream
import express from 'express'; // Default

// Import "review" controller functions
import { createReview, getReview } from '../controllers/review.controller.js';

const router = express.Router(); // Default

// Define routes for "review" operations
router.post('/', createReview);
router.get('/', getReview);

export default router; // Default
=======
import { Router } from 'express';
import { createReview } from '../controllers/review.controller.js';

const router = Router();

router.post('/', createReview);
router.get('/:id', getReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
>>>>>>> Stashed changes
