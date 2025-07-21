import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reviewId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review', 
    required: true 
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  motivo: { 
    type: String, 
    required: true 
  },
}, { 
  timestamps: true 
});

const Report = mongoose.model('Report', reportSchema);

export default Report;