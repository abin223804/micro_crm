import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
      <Link to="/contacts">Contacts</Link>&nbsp;&nbsp;
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
