const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchased_pdfs: [{ type: String }], // Store PDF names as strings in the array
});

const User = mongoose.model('User', userSchema);
module.exports = User;