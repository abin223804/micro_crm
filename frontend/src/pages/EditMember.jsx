import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";

export default function EditMember() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    if (!isAdmin) {
      alert("You are not allowed to edit members.");
      navigate("/contacts");
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    async function loadMember() {
      try {
        const res = await api.get("/users");
        const member = res.data.find((m) => m._id === id);

        if (!member) {
          alert("Member not found");
          navigate("/contacts");
          return;
        }

        setEmail(member.email);
        setRole(member.role);
      } catch (err) {
        console.error(err);
        alert("Unable to load member.");
      }
    }

    loadMember();
  }, [id, navigate]);

  async function handleUpdate(e) {
    e.preventDefault();

    const payload = { email, role };
    if (password.trim() !== "") payload.password = password;

    try {
      await api.put(`/users/${id}`, payload);
      alert("Member updated!");
      navigate("/contacts");
    } catch (err) {
      alert("Failed to update member");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Member</h2>

      <form onSubmit={handleUpdate}>
        <input
          value={email}
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <br />
        <br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
