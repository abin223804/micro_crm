import request from 'supertest';
import app from '../server.js';
import { connect, closeDatabase, clearDatabase } from "./setup.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

test("login returns token with valid credentials", async () => {
  const org = await Organization.create({ name: "T1" });
  const ph = await bcrypt.hash("pw1", 10);
  await User.create({ email: "u1@test", passwordHash: ph, role: "admin", organizationId: org._id });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: "u1@test", password: "pw1" })
    .expect(200);

  expect(res.body.token).toBeDefined();
});

test("login fails with wrong password", async () => {
  const org = await Organization.create({ name: "T1" });
  const ph = await bcrypt.hash("pw1", 10);
  await User.create({ email: "u1@test", passwordHash: ph, role: "admin", organizationId: org._id });

  await request(app)
    .post("/auth/login")
    .send({ email: "u1@test", password: "wrong" })
    .expect(401);
});
