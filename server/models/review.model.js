import mongoose from 'mongoose';

<<<<<<< Updated upstream
const reviewSchema = new mongoose.Schema({    
    // Adicione outros campos conforme necessário
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
=======
const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  musica: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  artista: { type: String, required: true },
  texto: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;


>>>>>>> Stashed changes
