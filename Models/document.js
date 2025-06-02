const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("document", documentSchema);
