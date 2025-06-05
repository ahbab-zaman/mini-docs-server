import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import Document from "./models/documents.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/document.js";

connectDB();

const app = express();
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

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);

// Socket.IO events
const onlineUsers = {}; // { docId: [{ socketId, user }, ...] }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-doc", async (data) => {
    const { docId, user } = data || {};
    socket.join(docId);

    const normalizedUser = {
      _id: user?.email || socket.id,
      fullName: user?.fullName || user?.name || "Unknown User",
      avatarUrl: user?.avatar || user?.avatarUrl || null,
    };

    if (!onlineUsers[docId]) onlineUsers[docId] = [];

    if (!onlineUsers[docId].find((u) => u.socketId === socket.id)) {
      onlineUsers[docId].push({ socketId: socket.id, user: normalizedUser });
    }

    io.to(docId).emit(
      "online-users",
      onlineUsers[docId].map((u) => u.user)
    );
  });

  socket.on("content-change", async ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", { content, source: socket.id });
    await Document.findByIdAndUpdate(docId, { content });
  });

  socket.on("leave-doc", (docId) => {
    socket.leave(docId);
    if (onlineUsers[docId]) {
      onlineUsers[docId] = onlineUsers[docId].filter(
        (u) => u.socketId !== socket.id
      );
      io.to(docId).emit(
        "online-users",
        onlineUsers[docId].map((u) => u.user)
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const docId in onlineUsers) {
      const beforeLength = onlineUsers[docId].length;
      onlineUsers[docId] = onlineUsers[docId].filter(
        (u) => u.socketId !== socket.id
      );
      if (onlineUsers[docId].length !== beforeLength) {
        io.to(docId).emit(
          "online-users",
          onlineUsers[docId].map((u) => u.user)
        );
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
