const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: {
      type: String,
      default: "/https://i.ibb.co/bMkvJGsd/google-docs.png",
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Document", DocumentSchema);
