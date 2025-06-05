import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  const { fullName, email, password, avatarUrl } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      avatar: avatarUrl || null,
    });

    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /auth/google
router.post("/google", async (req, res) => {
  try {
    const { fullName, email, avatar } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email });

    if (user) {
      let updated = false;
      if (user.fullName !== fullName) {
        user.fullName = fullName;
        updated = true;
      }
      if (user.avatar !== avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = new User({ fullName, email, avatar });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in /auth/google:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
