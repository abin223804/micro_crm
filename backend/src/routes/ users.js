import express from "express";
import bcrypt from "bcrypt";
import User from "../models/ User";
import Organization from "../models/Organization";

import { authenticate, requireRole } from "../middleware/auth";

const router = express.Router();

router.use(authenticate, requireRole("admin"));

router.post("/", async (req, res) => {
  const { email, password, role, OrganizationId } = req.body;

  const org = await Organization.findById(
    OrganizationId || req.user.OrganizationId
  );

  if (!org) return res.status(400).json({ error: "Organization not found" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
    role: role || "member",
    OrganizationId: org._id,
  });

  res.status(201).json(user);
});

router.get("/", async (req, res) => {
  const users = await User.find({
    OrganizationId: req.user.OrganizationId,
  }).select("-passwordHash");
  res.json(users);
});

export default router;
