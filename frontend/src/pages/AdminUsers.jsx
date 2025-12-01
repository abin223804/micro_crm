import { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    if (!isAdmin) {
      navigate("/contacts");
      return;
    }

    async function load() {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      }
    }
    load();
  }, [isAuthenticated, isAdmin, navigate]);

  async function createUser(e) {
    e.preventDefault();
    try {
      await api.post("/admin/users", { email, role });
      setEmail("");
      setRole("member");
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  }

  async function deleteUser(id) {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Users (Admin)</h2>

      <form onSubmit={createUser}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.email} — {u.role}
            <button onClick={() => deleteUser(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
