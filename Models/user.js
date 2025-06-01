const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  avatar: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
