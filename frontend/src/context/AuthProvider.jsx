import React, { useState } from "react";
import { AuthContext } from "./auth-context.jsx";
import jwtDecode from "jwt-decode";

export default function AuthProvider({ children }) {
  const load = (key) => {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined" || value === "null") return null;
    return value;
  };

  const [token, setToken] = useState(load("token"));
  const [role, setRole] = useState(load("role"));
  const [organizationName, setOrganizationName] = useState(
    load("organizationName")
  );

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  function login({ token, role, organizationName }) {
    setToken(token);
    setRole(role);
    setOrganizationName(organizationName);

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("organizationName", organizationName);
  }

  function logout() {
    setToken(null);
    setRole(null);
    setOrganizationName(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("organizationName");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAdmin,
        organizationName,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
