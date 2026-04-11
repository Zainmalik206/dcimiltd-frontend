// pages/dashboard/ProtectedDashboard.jsx
import React from "react";
import { useAuth } from "../../context/auth";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const ProtectedDashboard = () => {
  const [auth] = useAuth();

  // Agar token nahi → login page
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // ROLE CHECK: ARRAY MEIN "admin" hai ya nahi?
  const isAdmin = auth.user?.role?.includes("admin") || auth.user?.isAdmin === true;

  return isAdmin ? <AdminDashboard /> : <UserDashboard />; // No TopNavbar or Sidebar here
};

export default ProtectedDashboard;