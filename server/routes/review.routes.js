import { Router } from 'express';
import { createReview } from '../controllers/review.controller.js';

const router = Router();

router.post('/', createReview);
router.get('/:id', getReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
