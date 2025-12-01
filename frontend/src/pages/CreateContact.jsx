import { useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";

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
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <button>Create</button>
      </form>
    </div>
  );
}
