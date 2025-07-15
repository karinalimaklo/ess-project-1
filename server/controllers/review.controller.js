import Review from '../models/review.model.js';

async function createReview(req, res) {
    const { userId, musica, rating, artista, texto } = req.body;
    if (!texto || texto.trim() === '') {
        return res.status(400).json({ message: 'Escreva algo para fazer o review!' });
    }

    if (!rating) {
        return res.status(400).json({ message: 'Selecione uma avaliação para continuar' });
    }

    try {
        const review = new Review({ userId, musica, artista, texto, rating });
        await review.save();
        res.status(201).json({ message: 'Review cadastrada com sucesso', id: review._id });
    } catch (error) {
        console.error('Erro ao criar review:', error);
        res.status(500).json({ message: 'Erro ao criar review' });
    }   
}

export { createReview };
