const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db.js");
const Document = require("./Models/Document.js"); // 👈 Import Document model

connectDB();

const app = express();

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://mini-docs-client.vercel.app"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://mini-docs-client.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/auth", require("./routes/auth.js"));
app.use("/documents", require("./routes/document.js")); // 👈 Add this route

io.on("connection", (socket) => {
  socket.on("join-doc", async (docId) => {
    socket.join(docId);

    const doc = await Document.findById(docId);
    if (doc) {
      socket.emit("load-document", doc); // Send initial content
    }
  });

  socket.on("content-change", async ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", { content, source: socket.id });
    await Document.findByIdAndUpdate(docId, { content });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
