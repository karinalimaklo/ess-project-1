import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  musicId: { type: String, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  duration: { type: String, required: true },
  url: { type: String, required: true },
  platforms: [{ type: String, required: true }],
  cover: { type: String, required: true },
}, {
  timestamps: true,
});

const Music = mongoose.model('Music', musicSchema);

export default Music;
