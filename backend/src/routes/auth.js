import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Organization from "../models/Organization.js";

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || "secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("STEP 1 FAILED: Missing fields");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const org = await Organization.findById(user.organizationId);

    if (!org) {
      return res.status(500).json({ error: "Organization not found" });
    }

    const payload = {
      _id: user._id?.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?.toString(),
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

    return res.json({
      token,
      role: user.role,
      organizationName: org.name,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
