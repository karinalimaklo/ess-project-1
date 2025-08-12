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

  async toggleReviewVisibility(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review não encontrada.');
    }
    review.isHidden = !review.isHidden; 
    await review.save();
    return review;
  },

  async listReviews() {
    return await Review.find();
  },

  async listReviewsWithUserName() {
    return await Review.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
  },

  async listReviewsByUser(userId) {
    return await Review.find({ userId });
  },
  
  async listReviewsByMusic(musica, artista) {
    const musicaRegex = new RegExp(musica, 'i');
    const artistaRegex = new RegExp(artista, 'i');

    return await Review.find({ 
        musica: musicaRegex, 
        artista: artistaRegex,
        isHidden: false
      })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
  }
};

export default ReviewService;