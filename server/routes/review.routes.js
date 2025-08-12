import { Router } from 'express';
import {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  toggleReviewVisibility,
  listReviews,
  listReviewsByUser
} from '../controllers/review.controller.js';

const router = Router();

router.post('/', createReview);
router.get('/:id', getReview);
router.put('/:id', updateReview); 
router.delete('/:id', deleteReview);
router.patch('/:reviewId/toggle-visibility', toggleReviewVisibility);
router.get('/', listReviews);
router.get('/user/:userId', listReviewsByUser);

export default router;
