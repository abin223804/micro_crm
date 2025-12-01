import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";

export default function CreateContact() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/contacts", { name, email });
      navigate("/contacts");
    } catch (err) {
      console.error(err);
      alert("Failed to create contact");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Contact</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br/><br/>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/><br/>
        <button>Create</button>
      </form>
    </div>
  );
}
