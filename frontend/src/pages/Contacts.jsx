import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";

export default function Contacts() {
  const { isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    async function fetchData() {
      const res = await api.get("/contacts");
      setContacts(res.data); // tenant isolation is backend-only
    }

    fetchData();
  }, [isAuthenticated]);

  async function deleteContact(id) {
    await api.delete(`/contacts/${id}`);
    setContacts(prev => prev.filter(c => c._id !== id));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Contacts</h2>

      <Link to="/contacts/new">+ Add Contact</Link>

      <ul>
        {contacts.map(c => (
          <li key={c._id}>
            {c.name} - {c.email} <br/>
            <Link to={`/contacts/${c._id}/edit`}>Edit</Link>
            &nbsp;
            <button onClick={() => deleteContact(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
