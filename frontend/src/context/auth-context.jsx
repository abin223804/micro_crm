import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [organizationName, setOrganizationName] = useState(
    localStorage.getItem("organizationName")
  );

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  function login({ token: newToken, role: newRole, organizationName: newOrg }) {
    setToken(newToken);
    setRole(newRole);
    setOrganizationName(newOrg);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("organizationName", newOrg);
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
        isAuthenticated,
        isAdmin,
        organizationName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
