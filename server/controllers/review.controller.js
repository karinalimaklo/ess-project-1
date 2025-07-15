import ReviewService from '../services/review.service.js';

export const createReview = async (req, res) => {
  try {
    const review = await ReviewService.createReview(req.body);
    res.status(201).json({ message: 'Review criada com sucesso!', review });
  } catch (error) {
    if (error.message.includes('vazio') || error.message.includes('obrigatória')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao criar review.', error: error.message });
  }
};

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