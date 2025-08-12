import { Router } from 'express';
import {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  toggleReviewVisibility,
  listReviews,
  listReviewsByUser,
  listReviewsByMusic,
  listReviewsWithUserName
} from '../controllers/review.controller.js';

const router = Router();

router.get('/music', listReviewsByMusic);
router.get('/user/:userId', listReviewsByUser);

router.post('/', createReview);
router.get('/get/review-and-username', listReviewsWithUserName);
router.get('/', listReviews);
router.get('/:id', getReview);
router.put('/:id', updateReview); 
router.delete('/:id', deleteReview);
router.patch('/:reviewId/toggle-visibility', toggleReviewVisibility);

export default router;
