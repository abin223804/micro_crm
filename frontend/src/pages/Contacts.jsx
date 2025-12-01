import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/useAuth.js";

export default function Contacts() {
  const { isAuthenticated, isAdmin } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  const fetchContacts = useCallback(async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to load contacts.");
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/users");
      setMembers(res.data.filter((u) => u.role === "member"));
    } catch (err) {
      console.error(err);
      alert("Failed to load members.");
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAuthenticated) return navigate("/");

    fetchContacts();
    fetchMembers();
  }, [isAuthenticated, fetchContacts, fetchMembers, navigate]);

  async function deleteContact(id) {
    if (!window.confirm("Delete this contact?")) return;

    try {
      setContacts((prev) => prev.filter((c) => c._id !== id));
      await api.delete(`/contacts/${id}`);
    } catch (err) {
      console.error("Delete contact error:", err);
      alert("Failed to delete contact.");
      fetchContacts();
    }
  }

  async function deleteMember(id) {
    if (!window.confirm("Delete this member?")) return;

    try {
      setMembers((prev) => prev.filter((m) => m._id !== id));
      await api.delete(`/users/${id}`);
    } catch (err) {
      console.error("Delete member error:", err);
      alert("Failed to delete member.");
      fetchMembers();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h3>Contacts</h3>

          <Link
            to="/contacts/new"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            + Add Contact
          </Link>

          <ul style={{ listStyleType: "none", padding: 0 }}>
            {contacts.map((c) => (
              <li
                key={c._id}
                style={{
                  marginBottom: 15,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 8,
                }}
              >
                <strong>{c.name}</strong> ({c.email})
                <br />
                {c.phone && (
                  <>
                    <small>Phone: {c.phone}</small>
                    <br />
                  </>
                )}
                {c.notes && (
                  <>
                    <small>Notes: {c.notes}</small>
                    <br />
                  </>
                )}
                {isAdmin && (
                  <div style={{ marginTop: 6 }}>
                    <Link
                      to={`/contacts/${c._id}/edit`}
                      style={{ marginRight: 10 }}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteContact(c._id)}
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {isAdmin && (
          <div style={{ flex: 1 }}>
            <h3>Members</h3>

            <Link
              to="/members/new"
              style={{ textDecoration: "none", fontWeight: "bold" }}
            >
              + Add Member
            </Link>

            <ul style={{ listStyleType: "none", padding: 0 }}>
              {members.map((m) => (
                <li
                  key={m._id}
                  style={{
                    marginBottom: 15,
                    borderBottom: "1px solid #eee",
                    paddingBottom: 5,
                  }}
                >
                  <strong>{m.email}</strong> ({m.role})
                  <br />
                  <div style={{ marginTop: 5 }}>
                    <Link
                      to={`/members/${m._id}/edit`}
                      style={{ marginRight: 10 }}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteMember(m._id)}
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
