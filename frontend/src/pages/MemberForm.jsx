import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/useAuth";

export default function AddMemberForm({ onSuccess, onCancel }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isAuthenticated || !isAdmin) return null;

  async function submit(e) {
    e.preventDefault();

    try {
      await api.post("/users", { email, password, role: "member" });
      onSuccess(); 
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create member");
    }
  }

  return (
    <div style={{ padding: 20, border: "1px solid #ddd", marginTop: 10 }}>
      <h3>Create Member</h3>

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
        <button>Create</button>{" "}
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
