const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: { type: String },
  password: { type: String },
  isAdmin: { type: Boolean },
  avatar: { type: String },
  favoriteRecipes: { type: [String] },
  cookedRecipes: { type: [String] }
});

module.exports = { User };