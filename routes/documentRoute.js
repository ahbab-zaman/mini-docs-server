const express = require("express");
const router = express.Router();
const Document = require("../Models/document.js");

// Create a new document
router.post("/documents", async (req, res) => {
  try {
    const doc = new Document({ title: req.body.title });
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all documents
router.get("/documents", async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a document
router.put("/documents/:id", async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
router.delete("/documents/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
