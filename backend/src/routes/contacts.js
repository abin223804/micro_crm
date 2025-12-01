import express from "express";
import Contact from "../models/Contact.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({
      organizationId: req.user.organizationId,
    }).sort({ createdAt: -1 });

    res.json(contacts);
  } catch (err) {
    console.error("Get Contacts Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(contact);
  } catch (err) {
    console.error("Get Contact Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || "",
      notes: notes || "",
      organizationId: req.user.organizationId,
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error("Create Contact Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { name, email, phone: phone || "", notes: notes || "" },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Contact not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update Contact Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!deleted) return res.status(404).json({ error: "Contact not found" });

    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error("Delete Contact Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
