import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/useAuth";

export default function CreateMember() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isAuthenticated) return navigate("/");
  if (!isAdmin) {
    alert("You are not allowed to add members.");
    navigate("/contacts");
  }

  async function submit(e) {
    e.preventDefault();

    try {
      await api.post("/users", { email, password, role: "member" });
      alert("Member created!");
      navigate("/contacts");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create member");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Member</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button>Create</button>
      </form>
    </div>
  );
}
