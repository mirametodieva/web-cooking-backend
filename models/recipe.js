const mongoose = require('mongoose');

var Recipe = mongoose.model('Recipe', {
  id: { type: String },
  categories: { type: [String] },
  image: { type: String },
  title: { type: String },
  ingredients: { type: [String] },
  approved: { type: Boolean }
});

module.exports = { Recipe };