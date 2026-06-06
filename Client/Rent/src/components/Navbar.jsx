import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.log("Invalid JSON", error);
    localStorage.removeItem("user");
  }

  // const user =
  //   storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  //  Handle Cars Click
  const handleCarsClick = () => {
    if (location.pathname !== "/") {
      navigate("/#cars");
    } else {
      const section = document.getElementById("cars");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="fixed w-full z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-white cursor-pointer"
        >
          Rent<span className="text-blue-400">MyRide</span>
        </h1>

        {/* MENU */}
        <div className="hidden md:flex gap-10 text-gray-300">
          <div
            onClick={() => navigate("/")}
            className="relative group cursor-pointer"
          >
            <span className="group-hover:text-white transition">Home</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </div>

          <div
            onClick={handleCarsClick}
            className="relative group cursor-pointer"
          >
            <span
              className="group-hover:text-white transition"
              onClick={() => navigate("/cars")}
            >
              Cars
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </div>

          <div
            onClick={() => navigate("/about")}
            className="relative group cursor-pointer"
          >
            <span className="group-hover:text-white transition">About</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </div>

          <div
            onClick={() => navigate("/contact-us")}
            className="relative group cursor-pointer"
          >
            <span className="group-hover:text-white transition">
              Contact-Us
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </div>

          <div
            onClick={() => navigate("/my-bookings")}
            className="relative group cursor-pointer"
          >
            <span className="group-hover:text-white transition">MyBooking</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 items-center">
          {/* PROFILE ICON */}
          <User
            onClick={() => navigate("/profile")}
            className="cursor-pointer text-white hover:text-indigo-400 transition"
          />

          {/*  IF NOT LOGGED IN */}
          {!token && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 border border-gray-400 rounded-lg text-white hover:bg-white hover:text-black transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white hover:scale-105 transition"
              >
                Register
              </button>
            </>
          )}

          {/*  IF LOGGED IN */}
          {token && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-400 rounded-lg text-white hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
