const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  imageUrl: { 
    type: String, 
    default: 'https://example.com/default-image.png' 
  },
  tags: [{ type: String }],   // NEW → matches frontend `tags.split(",")`
  author: {                   // Comes from req.user._id, not frontend
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
