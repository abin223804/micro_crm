import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div style={{ padding: 15, background: "#fafafa", marginBottom: 20 }}>
      {isAuthenticated ? (
        <>
          <span style={{ marginRight: 20 }}>
            Role: <strong>{isAdmin ? "Admin" : "Member"}</strong>
          </span>

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/">Login</Link>
      )}
    </div>
  );
}
