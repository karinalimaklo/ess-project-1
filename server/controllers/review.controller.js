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

export const getReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await ReviewService.getReviewById(id);
        if (!review) {
        return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar review.', error: error.message });
    }
    }
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await ReviewService.updateReview(id, req.body);
        if (!updatedReview) {
        return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(200).json({ message: 'Review atualizada com sucesso!', review: updatedReview });
    } catch (error) {
        if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao atualizar review.', error: error.message });
    }
    }
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await ReviewService.deleteReview(id);
        if (!deletedReview) {
        return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(200).json({ message: 'Review deletada com sucesso!' });
    } catch (error) {
        if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao deletar review.', error: error.message });
    }
};
