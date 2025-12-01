import React,{ useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";

export default function EditContact() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    if (!isAdmin) {
      alert("You are not allowed to edit contacts.");
      navigate("/contacts");
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await api.get("/contacts");
        const contact = res.data.find((c) => c._id === id);
        if (!contact) {
          alert("Contact not found");
          navigate("/contacts");
          return;
        }
        setName(contact.name);
        setEmail(contact.email);
      } catch (err) {
        console.error(err);
        alert("Unable to load contact.");
      }
    }
    if (isAdmin) loadContact();
  }, [id, isAdmin, navigate]);

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put(`/contacts/${id}`, { name, email });
      alert("Contact updated successfully!");
      navigate("/contacts");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update contact.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Contact</h2>
      <form onSubmit={handleUpdate}>
        <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} /><br /><br />
        <input value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
