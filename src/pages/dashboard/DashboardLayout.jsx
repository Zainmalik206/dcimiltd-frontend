// pages/dashboard/DashboardLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "../../layouts/TopNavbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { LayoutGrid, User, ShoppingBag, MapPin, Heart, Box, Users, Tag } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const [auth] = useAuth();

  // Determine menu items based on role
  const isAdmin = auth?.user?.role?.includes("admin") || auth?.user?.isAdmin;

  const userMenu = [
    { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Orders", icon: ShoppingBag, path: "/orders" },
    { name: "Wishlist", icon: Heart, path: "/wishlist" },
  ];

  const adminMenu = [
    { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { name: "My Profile", icon: Box, path: "/profile" },
    { name: "View Products", icon: Box, path: "/view-products" },
    { name: "All Users", icon: Users, path: "/all-users" },
    { name: "User Orders", icon: Tag, path: "/orders" },
    { name: "Admin Panel", icon: ShoppingBag, path: "/admin-orders" },
  ];

  const menuItems = isAdmin ? adminMenu : userMenu;

  // Dark mode state (simple version from localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // PK Time (simple version)
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const pktTime = formatInTimeZone(currentTime, "Asia/Karachi", "hh:mm a");

  return (
    <>
      <TopNavbar setOpen={setOpen} />

      <div className={`min-h-screen flex ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Sidebar
          menuItems={menuItems}
          open={open}
          setOpen={setOpen}
          darkMode={darkMode}
          pktTime={pktTime}
          country="PK"
        />

        <main className={`flex-1 pt-20 transition-all duration-300 ${open ? "lg:ml-64" : "lg:ml-20"}`}>
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet /> {/* Yahan sab child pages render honge */}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;