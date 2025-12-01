import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import contactRoutes from "./routes/contacts.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/contacts", contactRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log("Server running on port", PORT));
}

if (process.argv[1].includes("server.js")) {
  start();
}

export default app;
