const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  avatar: { type: String }, // Image URL or base64
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
