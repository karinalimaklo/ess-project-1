import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({    
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ref to user model, who is following
        required: true,
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //ref to user model, who is being followed
        required: true,
    },
}, {
  timestamps: true,
});

// define a unique index to prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

export default Follow;