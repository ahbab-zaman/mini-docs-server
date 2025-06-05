const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String, // Accept UUIDs
    required: true,
  },
  content: { type: String, default: "" },
});

module.exports = mongoose.model("document", DocumentSchema);
