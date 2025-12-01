import { useEffect, useState } from "react";
import api from "../api.js";
import { Link } from "react-router-dom";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await api.get("/contacts");
        setContacts(res.data);
      } catch (err) {
        console.error("Error loading contacts:", err);
      }
    }

    fetchContacts();
  }, []);

  async function deleteContact(id) {
    await api.delete(`/contacts/${id}`);
    setContacts((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Contacts</h2>
      <Link to="/contacts/new">+ Add Contact</Link>

      <ul>
        {contacts.map((c) => (
          <li key={c._id}>
            <strong>{c.name}</strong> — {c.email}
            <br />
            <button onClick={() => deleteContact(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
