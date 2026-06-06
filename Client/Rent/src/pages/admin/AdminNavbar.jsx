

import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await API.get("/admin/agencies");
        const pending = res.data.filter((a) => !a.isApproved);
        setNotifications(pending);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAgencies();
  }, []);

  //  SEARCH FUNCTION
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const value = search.trim();

      if (!value) return;

      // EMAIL → USER PAGE
      if (value.includes("@")) {
        navigate(`/admin/users?q=${value}`);
      } else {
        // OTHERWISE CAR PAGE
        navigate(`/admin/cars?q=${value}`);
      }
    }
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/*  SEARCH */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded w-1/3">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search cars..."
          className="bg-transparent outline-none ml-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch} 
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/*  NOTIFICATION */}
        <div className="relative">
          <Bell
            size={22}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />

          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {notifications.length}
            </span>
          )}

          {open && (
            <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded p-3 z-50">
              <h3 className="font-semibold mb-2">Notifications</h3>

              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No new requests</p>
              ) : (
                notifications.map((agency) => (
                  <div
                    key={agency._id}
                    onClick={() => navigate("/admin/agencies")}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
                  >
                    New Agency: {agency.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <span className="text-gray-700 font-medium" >
          admin@gmail.com</span>
      </div>
    </div>
  );
}

export default AdminNavbar;
