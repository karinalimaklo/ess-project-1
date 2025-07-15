import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  musica: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  artista: { type: String, required: true },
  texto: { type: String, required: true },
  isHidden: { type: Boolean, default: false },

}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;