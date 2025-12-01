
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      {isAuthenticated ? (
        <>
          
          {isAdmin && <Link to="/users/">Manage Members</Link>}&nbsp;&nbsp;
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : null}
    </nav>
  );
}
