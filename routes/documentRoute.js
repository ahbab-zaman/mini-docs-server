const express = require("express");
const router = express.Router();
const Document = require("../Models/document");

// GET all documents
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

// POST create new document
router.post("/", async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }
  try {
    const newDoc = new Document({ title, author });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: "Failed to create document" });
  }
});

// Create a new document
// router.post("/", async (req, res) => {
//   const doc = new Document({
//     title: req.body.title,
//     author: req.body.author,
//     createdAt: new Date(),
//   });
//   await doc.save();
//   res.json(doc);
// });

// Get single document by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch document." });
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const documents = await Document.find().sort({ createdAt: -1 });
//     res.json(documents);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch documents." });
//   }
// });

// Update a document title
// router.put("/:id", async (req, res) => {
//   try {
//     const { title } = req.body;
//     const doc = await Document.findByIdAndUpdate(
//       req.params.id,
//       { title },
//       { new: true }
//     );
//     res.json(doc);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update document." });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;

    const doc = await Document.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to update document." });
  }
});

// Delete a document
router.delete("/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete document." });
  }
});

module.exports = router;
