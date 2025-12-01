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

// UPDATE USER (Admin Only)
router.put("/:id", async (req, res) => {
  try {
    const { email, role, password } = req.body;
    const { id } = req.params;

    // Find user in same organization
    const user = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found in your organization" });
    }

    // Update email
    if (email) user.email = email;

    // Update role (optional)
    if (role) user.role = role;

    // Update password if sent
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE USER (Admin Only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Safety check: req.user must exist
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User missing" });
    }

    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ error: "You cannot delete your own account." });
    }

    const deletedUser = await User.findOneAndDelete({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!deletedUser) {
      return res.status(404).json({
        error: "User not found or does not belong to your organization",
      });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
