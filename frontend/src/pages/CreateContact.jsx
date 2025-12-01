import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function CreateContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    await api.post("/contacts", { name, email });
    navigate("/contacts");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Contact</h2>

      <form onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" /><br/><br/>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br/><br/>
        <button>Create</button>
      </form>
    </div>
  );
}
