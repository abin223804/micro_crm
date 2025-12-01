import { useContext } from "react";
import { AuthContext } from "./auth-context.jsx";


export function useAuth() {
  return useContext(AuthContext);
}
