import { Router } from 'express';
import {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  hideReview
} from '../controllers/review.controller.js';

const router = Router();

router.post('/', createReview);
router.get('/:id', getReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:reviewId/ocultar', hideReview);

export default router;
