import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import { path } from "framer-motion/client";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Cars ", path: "/admin/cars" },
    { name: "Bookings ", path: "/admin/bookings" },
    { name: "Users ", path: "/admin/users" },
    { name: "Agencies ", path: "/admin/agencies" },
    { name: "Messages", path: "/admin/messages" },
    { name: "Profile", path: "/admin/profile" },
  ];

  return (
    <div
      className={`${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex`}
    >
      {/* SIDEBAR (FULL HEIGHT FROM TOP) */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-black text-white p-4 transition-all duration-300 flex flex-col justify-between h-screen fixed left-0 top-0`}
      >
        {/* TOP */}
        <div>
          <div className="flex justify-between items-center mb-6">
            {!collapsed && (
              <h1 className="text-xl font-bold ">
                Rent<span className="text-blue-400">MyRide</span>
              </h1>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              ☰
            </button>
          </div>

          {menu.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-3 mb-2 rounded cursor-pointer transition
              ${
                location.pathname === item.path
                  ? "bg-blue-500"
                  : "hover:bg-gray-700"
              }`}
            >
              {collapsed ? item.name[0] : item.name}
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div>
          {/* <button
            onClick={() => setDark(!dark)}
            className="w-full mb-3 bg-gray-700 py-2 rounded"
          >
            {dark ? " Light" : " Dark"}
          </button> */}

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/*  RIGHT SIDE (Navbar + Content) */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/*  NAVBAR (START AFTER SIDEBAR) */}
        <div className="sticky top-0 z-40">
          <AdminNavbar />
        </div>

        {/*  CONTENT */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
