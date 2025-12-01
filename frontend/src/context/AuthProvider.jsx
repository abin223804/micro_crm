import React, { useState } from "react";
import { AuthContext } from "./auth-context.js";
import jwtDecode from "jwt-decode";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  });

  const user = token ? jwtDecode(token) : null;
  const role = user?.role || "member";
  const isAdmin = role === "admin";
  const isAuthenticated = !!token;

  function login(t) {
    localStorage.setItem("token", t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, user, role, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
