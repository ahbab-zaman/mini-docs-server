const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db.js");

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

app.use("/auth", require("./routes/auth.js"));

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a document room to isolate updates
  socket.on("join-doc", (docId) => {
    socket.join(docId);
    console.log(`Socket ${socket.id} joined document room: ${docId}`);
  });

  // Listen for content changes from a user and broadcast to others in the same room
  socket.on("content-change", ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
