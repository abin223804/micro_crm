import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Organization from "./models/Organization.js";
import User from "./models/User.js";
import Contact from "./models/Contact.js";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");

  await Organization.deleteMany({});
  await User.deleteMany({});
  await Contact.deleteMany({});

  const orgA = await Organization.create({ name: "Org A" });
  const orgB = await Organization.create({ name: "Org B" });

  const adminPass = await bcrypt.hash("Password123!", 10);
  const memberPass = await bcrypt.hash("Member123!", 10);

  await User.create([
    {
      email: "adminA@example.com",
      passwordHash: adminPass,
      role: "admin",
      organizationId: orgA._id,
    },
    {
      email: "memberA@example.com",
      passwordHash: memberPass,
      role: "member",
      organizationId: orgA._id,
    },
    {
      email: "adminB@example.com",
      passwordHash: adminPass,
      role: "admin",
      organizationId: orgB._id,
    },
    {
      email: "memberB@example.com",
      passwordHash: memberPass,
      role: "member",
      organizationId: orgB._id,
    },
  ]);

  await Contact.create([
    {
      name: "Alice A",
      email: "aliceA@example.com",
      phone: "111111",
      organizationId: orgA._id,
    },
    {
      name: "Bob A",
      email: "bobA@example.com",
      phone: "222222",
      organizationId: orgA._id,
    },
    {
      name: "Alice B",
      email: "aliceB@example.com",
      phone: "333333",
      organizationId: orgB._id,
    },
    {
      name: "Bob B",
      email: "bobB@example.com",
      phone: "444444",
      organizationId: orgB._id,
    },
  ]);

  console.log("Seed completed.");
  await mongoose.disconnect();
  process.exit(0);
}

run();
