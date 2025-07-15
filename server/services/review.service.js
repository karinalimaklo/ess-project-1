import Review from '../models/review.model.js';

const ReviewService = {
  async createReview(userId, musica, artista, texto, rating) {
    if (!texto || texto.trim() === '') {
      throw new Error('Escreva algo para fazer o review!');
    }
    if (!rating) {
      throw new Error('Selecione uma avaliação para continuar');
    }
    return await Review.create({ userId, musica, artista, texto, rating });
  },

  async deleteReview(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review não encontrada');
    }
    return await Review.findByIdAndDelete(id);
  },

  async updateReview(id, update) {
    const review = await Review.findById(id);
    
    if (!review) {
      throw new Error('Review não encontrada');
    }
    return await Review.findByIdAndUpdate(id, update, { new: true });
  },

  async getReview(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Review não encontrada');
    }
    return review;
  },
};

export default ReviewService;