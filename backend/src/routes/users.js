import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Organization from "../models/Organization.js";

import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, requireRole("admin"));

router.post("/", async (req, res) => {
  try {
    const { email, password, role, organizationId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const org = await Organization.findById(
      organizationId || req.user.organizationId
    );

    if (!org) {
      return res.status(400).json({ error: "Organization not found" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role: role || "member",
      organizationId: org._id,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({
      organizationId: req.user.organizationId,
    }).select("-passwordHash");

    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
