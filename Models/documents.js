import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String, // Accept UUIDs
    required: true,
  },
  content: { type: String, default: "" },
});

const Document = mongoose.model("document", DocumentSchema);

export default Document;
