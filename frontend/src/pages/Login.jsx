import React, { useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      // FIXED: send token + role + orgName
      login({
        token: res.data.token,
        role: res.data.role,
        organizationName: res.data.organizationName,
      });

      navigate("/contacts");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <br /><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
