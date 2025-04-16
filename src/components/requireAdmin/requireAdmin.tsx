import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../../services/authService";
import { toast } from "react-toastify";

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const role = getUserRole();

  if (role !== "admin") {
    toast.error("No tienes acceso");
    return <Navigate to="/home" />;
  }

  return children;
};

export default RequireAdmin;
