const mongoose = require('mongoose');

const paletteSchema = new mongoose.Schema({
  paletteId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: String,
  colors: {
    primary: String,
    secondary: String,
    accent: String,
    background: String,
  },
}, { _id: false });

const characterSchema = new mongoose.Schema({
  personalityType: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  baseImage: String, // URL to blurred image
  unlockedImage: String, // URL to clear image
  basePalettes: [paletteSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Character', characterSchema);
