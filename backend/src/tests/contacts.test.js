import request from "supertest";
import app from "../server.js";
import { connect, closeDatabase, clearDatabase } from "./setup.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "secret";

let orgA, orgB, adminA, adminB, tokenA, tokenB;

beforeAll(async () => {
  await connect();

  orgA = await Organization.create({ name: "Org A" });
  orgB = await Organization.create({ name: "Org B" });

  adminA = await User.create({
    email: "adminA@x",
    passwordHash: await bcrypt.hash("pwA", 10),
    role: "admin",
    organizationId: orgA._id
  });

  adminB = await User.create({
    email: "adminB@x",
    passwordHash: await bcrypt.hash("pwB", 10),
    role: "admin",
    organizationId: orgB._id
  });

  tokenA = jwt.sign({
    id: adminA._id.toString(),
    email: adminA.email,
    role: adminA.role,
    organizationId: orgA._id.toString()
  }, jwtSecret);

  tokenB = jwt.sign({
    id: adminB._id.toString(),
    email: adminB.email,
    role: adminB.role,
    organizationId: orgB._id.toString()
  }, jwtSecret);
});

afterAll(async () => {
  await closeDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

test("tenant isolation: Org A should not see Org B contacts", async () => {
  await Contact.create({ name: "A1", email: "a1@x", organizationId: orgA._id });
  await Contact.create({ name: "B1", email: "b1@x", organizationId: orgB._id });

  const resA = await request(app)
    .get("/contacts")
    .set("authorization", `Bearer ${tokenA}`)
    .expect(200);

  expect(resA.body.length).toBe(1);
  expect(resA.body[0].email).toBe("a1@x");

  const resB = await request(app)
    .get("/contacts")
    .set("authorization", `Bearer ${tokenB}`)
    .expect(200);

  expect(resB.body.length).toBe(1);
  expect(resB.body[0].email).toBe("b1@x");
});

test("CRUD operations inside tenant", async () => {
  const create = await request(app)
    .post("/contacts")
    .set("authorization", `Bearer ${tokenA}`)
    .send({ name: "New A", email: "a@new" })
    
    .expect(201);

  const id = create.body._id;

  const update = await request(app)
    .put(`/contacts/${id}`)
    .set("authorization", `Bearer ${tokenA}`)
    .send({ name: "Updated A" })
    .expect(200);

  expect(update.body.name).toBe("Updated A");

  await request(app)
    .delete(`/contacts/${id}`)
    .set("authorization", `Bearer ${tokenA}`)
    .expect(200);

  const list = await request(app)
    .get("/contacts")
    .set("authorization", `Bearer ${tokenA}`)
    .expect(200);

  expect(list.body.length).toBe(0);
});
