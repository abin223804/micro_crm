import express from "express";
import Contact from "../models/Contact.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({
      organizationId: req.user.organizationId,
    });

    res.json(contacts);
  } catch (err) {
    console.error("Get Contacts Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      organizationId: req.user.organizationId,
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error("Create Contact Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", requireRole("admin"), async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId,
      },
      req.body,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error("Update Contact Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireRole("admin"), async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Delete Contact Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
