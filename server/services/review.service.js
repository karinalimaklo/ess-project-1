import Review from '../models/review.model.js';

const ReviewService = {
  async createReview(userId, musica, artista, texto, rating) {
    if (!texto || texto.trim() === '') {
      throw new Error('Escreva algo para fazer o review!');
    }
    if (rating === undefined || rating === null || rating === 0) {
      throw new Error('Selecione uma avaliação para continuar');
    }
    return await Review.create({ userId, musica, artista, texto, rating });
  },

  async deleteReview(id, requesterId) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review não encontrada');
    }

    if (review.userId !== requesterId) {
      const err = new Error('Não autorizado');
      err.status = 403;
      throw err;
    }

    await Review.findByIdAndDelete(id);
    return review;
  },

  async updateReview(id, update) {
    const review = await Review.findByIdAndUpdate(id, update, { new: true });
    if (!review) {
      const err = new Error('Review não encontrada');
      err.status = 404;
      throw err;
    }
    return review;
  },

  async getReview(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review não encontrada');
    }
    return review;
  },

  async hideReview(reviewId) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isHidden: true },
      { new: true }
    );
    if (!review) {
      throw new Error('Review não encontrada');
    }
    return review;
  }
};

export default ReviewService;
