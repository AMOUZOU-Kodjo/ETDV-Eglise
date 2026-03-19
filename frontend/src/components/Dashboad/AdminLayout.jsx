// src/components/Dashboard/AdminLayout.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Image, 
  Calendar,
  Users,
  Settings,
  LogOut,
  Bell,
  Church,
  Users2
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboardadmin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/galleryadmin", icon: Image, label: "Galerie" },
    { path: "/eventsadmin", icon: Calendar, label: "Événements" },
    { path: "/admin/users", icon: Users, label: "Utilisateurs" },
    { path: "/community-dashboard", icon: Users2, label: "Communauté" },
    { path: "/admin/visiteurs", icon: Church, label: "Visiteurs" },
    { path: "/admin/settings", icon: Settings, label: "Paramètres" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 80 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-white dark:bg-gray-800 shadow-xl fixed h-full z-30 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between border-b dark:border-gray-700">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold text-accent">Admin ETDV</h1>
            ) : (
              <h1 className="text-xl font-bold text-accent mx-auto">A</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-xl
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-accent text-white shadow-lg' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <Icon size={20} />
                      {sidebarOpen && <span>{item.label}</span>}
                      {isActive && sidebarOpen && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-3 w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-xl font-semibold">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  AD
                </div>
                <div className="hidden md:block">
                  <p className="font-medium">Admin</p>
                  <p className="text-sm text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;