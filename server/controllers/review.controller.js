import ReviewService from '../services/review.service.js';

export const hideReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await ReviewService.hideReview(reviewId);
    res.status(200).json({ message: 'Review ocultada com sucesso.' });
  } catch (error) {
    if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro interno ao ocultar review.', error: error.message });
  }
};