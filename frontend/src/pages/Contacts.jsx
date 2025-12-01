import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";

export default function Contacts() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

 
  const fetchContacts = useCallback(async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      
      const message = err.response?.data?.error || "Failed to load contacts.";
      alert(message);
    }
  }, []); 

  useEffect(() => {
   
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Call the memoized fetch function
    fetchContacts();
  }, [isAuthenticated, navigate, fetchContacts]); // 2. Add fetchContacts to dependencies


  async function deleteContact(id) {
    try {
     
      setContacts((prev) => prev.filter((c) => c._id !== id)); 
      
      await api.delete(`/contacts/${id}`);
     

    } catch (err) {
      console.error("Delete Error:", err);
     
      const message = err.response?.data?.error || "You are not allowed to delete contacts.";
      alert(message);
      
     
      fetchContacts(); 
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Contacts</h2>

      <Link to="/contacts/new" style={{ textDecoration: 'none', fontWeight: 'bold' }}>+ Add Contact</Link>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {contacts.map((c) => (
          <li key={c._id} style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 5 }}>
            <strong>{c.name}</strong> ({c.email})
            <br />
           
            {isAdmin && (
              <div style={{ marginTop: 5 }}>
                <Link to={`/contacts/${c._id}/edit`} style={{ marginRight: 10 }}>Edit</Link>
                
                <button 
                  onClick={() => deleteContact(c._id)} 
                  style={{ color: 'red', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}