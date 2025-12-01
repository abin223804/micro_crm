import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/contacts" replace />;
  return children;
}
