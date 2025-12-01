import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      {isAuthenticated && (
        <>
          <Link to="/contacts">Contacts</Link>&nbsp;&nbsp;
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

