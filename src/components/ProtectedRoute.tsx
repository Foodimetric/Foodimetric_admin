import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token =
    localStorage.getItem("authToken")

  // Optional: You can also check if token is valid (not expired)
  const isTokenValid = () => {
    if (!token) return false;

    try {
      // If your token is a JWT, you can decode and check expiration
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        localStorage.removeItem("authToken");
        return false;
      }

      return true;
    } catch (error) {
      // If token is not a valid JWT, just check if it exists
      return Boolean(token);
    }
  };

  // If no valid token, redirect to login
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  // If token exists and is valid, render the protected component
  return <>{children}</>;
};
