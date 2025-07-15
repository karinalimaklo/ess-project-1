import Review from '../models/review.model.js';

class ReviewService {
  static async hideReview(reviewId) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isHidden: true },
      { new: true } 
    );

    if (!review) {
      throw new Error('Review não encontrada.');
    }
    
    return review;
  }
}

export default ReviewService;