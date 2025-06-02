const express = require("express");
const router = express.Router();
const Document = require("../Models/document");

// Create a new document
router.post("/documents", async (req, res) => {
  const doc = new Document({
    title: req.body.title,
    author: req.body.author,
    createdAt: new Date(),
  });
  await doc.save();
  res.json(doc);
});

// Get all documents
router.get("/documents", async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents." });
  }
});

// Update a document title
router.put("/documents/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to update document." });
  }
});

// Delete a document
router.delete("/documents/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document." });
  }
});

module.exports = router;
