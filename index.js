const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db.js");

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true,
  })
);
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/auth", require("./routes/auth.js"));
app.use("/", require("./routes/documentRoute.js"));
// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
