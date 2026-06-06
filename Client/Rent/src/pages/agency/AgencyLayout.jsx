import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function AgencyLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/agency/dashboard" },
    { name: "Cars ", path: "/agency/cars" },
    { name: "Bookings ", path: "/agency/bookings" },
    { name: "Profile", path: "/agency/Profile" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-black text-white p-4 transition-all duration-300 flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-6">
            {/* <h1 className="text-lg font-bold ">
              {collapsed ? "R" : `Rent<span className="text-blue-400">MyRide</span>`}
            </h1> */}
            {!collapsed && (
              <h1 className="text-xl font-bold ">
                Rent<span className="text-blue-400">MyRide</span>
              </h1>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="bg-gray-700 px-2 py-1 rounded"
            >
              ☰
            </button>
          </div>

          {/* MENU */}
          {menu.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-3 mb-2 rounded cursor-pointer ${
                location.pathname === item.path
                  ? "bg-blue-500"
                  : "hover:bg-gray-700"
              }`}
            >
              {collapsed ? item.name[0] : item.name}
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/*  MAIN */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">{children}</div>
    </div>
  );
}

export default AgencyLayout;
