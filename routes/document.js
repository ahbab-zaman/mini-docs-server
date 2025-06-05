// routes/document.js
const express = require("express");
const router = express.Router();
const Document = require("../models/documents");

// routes/document.js
router.get("/:docId", async (req, res) => {
  const { docId } = req.params;

  try {
    let doc = await Document.findById(docId);
    if (!doc) {
      doc = await Document.create({ _id: docId, content: "" });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to get or create document" });
  }
});

router.post("/:docId", async (req, res) => {
  const { docId } = req.params;
  const { content } = req.body;

  try {
    await Document.findByIdAndUpdate(
      docId,
      { content },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save content" });
  }
});

module.exports = router;
