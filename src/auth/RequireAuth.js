import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const value = localStorage.getItem("userId");
  
  if (!value) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  if (value ===false || value === null){
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  return children;
};
