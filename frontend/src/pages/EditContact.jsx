import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      const res = await api.get("/contacts");
      const contact = res.data.find(c => c._id === id);
      if (contact) {
        setName(contact.name);
        setEmail(contact.email);
      }
    }
    load();
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    await api.put(`/contacts/${id}`, { name, email });
    navigate("/contacts");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Contact</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" /><br/><br/>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br/><br/>
        <button>Update</button>
      </form>
    </div>
  );
}
