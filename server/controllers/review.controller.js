import ReviewService from '../services/review.service.js';

export const createReview = async (req, res) => {
  try {
    const { userId, musica, artista, texto, rating } = req.body;
    console.log('📥 Dados recebidos:', req.body);

    const review = await ReviewService.createReview(userId, musica, artista, texto, rating);
    res.status(201).json({ message: 'Review criada com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao criar review:', error); // Mostra o stack trace completo
    res.status(500).json({ error: 'Erro ao criar review', details: error.message });
  }
};


export const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewService.getReview(id); // Corrigido aqui
    if (!review) {
      return res.status(404).json({ message: 'Review não encontrada.' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar review.', error: error.message });
  }
};

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
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { requesterId } = req.body; // Corrigido: Service espera requesterId
    const deletedReview = await ReviewService.deleteReview(id, requesterId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review não encontrada.' });
    }
    res.status(200).json({ message: 'Review deletada com sucesso!' });
  } catch (error) {
    if (error.message.includes('não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Não autorizado')) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao deletar review.', error: error.message });
  }
};

export const toggleReviewVisibility = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await ReviewService.toggleReviewVisibility(reviewId);
    res.status(200).json({ 
      message: `Review ${updatedReview.isHidden ? 'ocultada' : 'reexibida'} com sucesso.`,
      review: updatedReview 
    });
  } catch (error) {
    if (error.message.includes('não encontrada')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro interno ao alterar a visibilidade da review.', error: error.message });
  }
};

export const listReviews = async (req, res) => {
  try {
    const reviews = await ReviewService.listReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar reviews.', error: error.message });
  }
};

export const listReviewsWithUserName = async (req, res) => {
  try {
    const reviews = await ReviewService.listReviewsWithUserName();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar reviews.', error: error.message });
  }
};

export const listReviewsByUser = async (req, res) => {
  console.log('userId recebido:', req.params.userId);
  try {
    const { userId } = req.params;
    const reviews = await ReviewService.listReviewsByUser(userId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar reviews do usuário.', error: error.message });
  }
};

export const listReviewsByMusic = async (req, res) => {
  try {
    const { musica, artista } = req.query;
    const reviews = await ReviewService.listReviewsByMusic(musica, artista);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar reviews da música.', error: error.message });
  }
};