import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken, GuardProp } from "../utils/Interface.utils";


export default function Guard({ children, requiredRole }: GuardProp & { requiredRole?: string }) {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        
        if (requiredRole && decoded.role !== requiredRole) {
          return <Navigate to="/" replace />;
        }
        return children;
      } else {
        localStorage.removeItem("token"); // Token expired
      }
    } catch (err) {
      localStorage.removeItem("token"); // Invalid token
    }
  }

  return <Navigate to={`/login?from=${window.location.pathname}`} replace />;
}
