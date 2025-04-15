import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Hotel,
  Bed,
  Calendar,
  Users,
  Settings,
  FileText,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  Search,
  BedDouble,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Navigation items
  const navItems = [
    {
      name: "Tableau de bord",
      path: "/admin/dashboard",
      icon: <Home size={20} />,
    },
    { name: "Hôtels", path: "/admin/hotels", icon: <Hotel size={20} /> },
    {
      name: "Chambres",
      path: "/admin/rooms",
      icon: <Bed size={20} />,
    },
    {
      name: "Types de chambres",
      path: "/admin/room-types",
      icon: <BedDouble size={20} />,
    },
    {
      name: "Réservations",
      path: "/admin/bookings",
      icon: <Calendar size={20} />,
    },
    { name: "Clients", path: "/admin/guests", icon: <Users size={20} /> },
    { name: "Rapports", path: "/admin/reports", icon: <FileText size={20} /> },
    {
      name: "Paramètres",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">LesBoxeurs</span>
          </div>
          <button
            onClick={closeSidebar}
            className="text-gray-300 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              ADE
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Francoooo</p>
              <p className="text-xs text-gray-400">franc@leboss.com</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => {
                  // Gestion du cas spécial pour le tableau de bord
                  const isLinkActive =
                    (item.path === "/admin/dashboard" &&
                      location.pathname === "/admin") ||
                    isActive;

                  return `flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    isLinkActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`;
                }}
                onClick={closeSidebar}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="relative hidden md:block">
                <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="ml-2 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">
                          Nouvelle réservation
                        </p>
                        <p className="text-xs text-gray-500">Il y a 3 heures</p>
                      </div>
                      <div className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">Paiement reçu</p>
                        <p className="text-xs text-gray-500">Il y a 5 heures</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">Nouveau message</p>
                        <p className="text-xs text-gray-500">Il y a 1 jour</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-700"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                    AG
                  </div>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg py-1 z-50 border">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate("/admin/profile")}
                    >
                      Profil
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate("/admin/settings")}
                    >
                      Paramètres
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => navigate("/login")}
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
