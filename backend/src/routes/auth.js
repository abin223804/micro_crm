import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || "secret";

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId.toString(),
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  res.json({ token });
});

export default router;