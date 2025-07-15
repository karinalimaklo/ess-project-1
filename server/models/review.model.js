import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;