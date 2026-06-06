import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { MapPin, PhoneCallIcon, User, UserCircle2 } from "lucide-react";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import nodata from "../assets/no-data-found.mp4";

function Profile() {
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [edit, setEdit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  // GET PROFILE
  const getProfile = async () => {
    try {
      const { data } = await API.get("/users/profile");
      setUser(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        contactNumber: data.contactNumber || "",
        address: data.address || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // GET BOOKINGS
  const getBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProfile();
    getBookings();
  }, []);

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const { data } = await API.put("/users/profile", form);
      setUser(data);
      setEdit(false);
      toast.success("Profile updated ");
      getProfile();
    } catch (err) {
      toast.error("Update failed ");
    }
  };

  // PAGINATION LOGIC
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white pt-24 px-6 pb-20">
        {/* <h1 className="text-3xl font-bold text-center mb-10">My Profile </h1> */}

        {/* PROFILE CARD */}
        {/* <div className="max-w-3xl mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
          {!edit ? (
            <>
              <p className="text-lg flex gap-2">
                <User /> Name: {user.name}
              </p>
              <p className="text-lg flex gap-2">
                <MdEmail />
                Email: {user.email}
              </p>
              <p className="text-lg flex gap-2">
                <PhoneCallIcon /> Phone: {user.contactNumber}
              </p>
              <p className="text-lg flex gap-2">
                <MapPin />
                Address:{user.address}
              </p>

              <button
                onClick={() => setEdit(true)}
                className="mt-5 bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input
                className="w-full p-2 mb-3 rounded bg-black border"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full p-2 mb-3 rounded bg-black border "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="w-full p-2 mb-3 rounded bg-black border"
                value={form.contactNumber}
                onChange={(e) =>
                  setForm({ ...form, contactNumber: e.target.value })
                }
              />

              <input
                className="w-full p-2 mb-3 rounded bg-black border"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <div className="flex gap-3">
                <button
                  onClick={updateProfile}
                  className="bg-green-600 px-5 py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEdit(false)}
                  className="bg-gray-600 px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div> */}

        {/* PROFILE CARD */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* glow effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

          {!edit ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                <span className="flex flex-row gap-2  justify-center ">
                  <UserCircle2 className="w-8 h-8" /> My Profile
                </span>
              </h2>

              <div className="space-y-4 text-lg">
                <p className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
                  <User className="text-blue-400" />
                  <span className="text-gray-300">Name:</span>
                  <span className="text-white font-semibold">{user.name}</span>
                </p>

                <p className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
                  <MdEmail className="text-purple-400" />
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white font-semibold">{user.email}</span>
                </p>

                <p className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
                  <PhoneCallIcon className="text-green-400" />
                  <span className="text-gray-300">Phone:</span>
                  <span className="text-white font-semibold">
                    {user.contactNumber}
                  </span>
                </p>

                <p className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
                  <MapPin className="text-red-400" />
                  <span className="text-gray-300">Address:</span>
                  <span className="text-white font-semibold">
                    {user.address}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setEdit(true)}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 rounded-xl hover:scale-105 transition font-semibold"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                <span className="flex flex-row gap-2  justify-center ">
                  <UserCircle2 className="w-8 h-8" /> My Profile
                </span>
              </h2>

              <input
                className="w-full p-3 mb-3 rounded-xl bg-black/40 border border-white/10"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full p-3 mb-3 rounded-xl bg-black/40 border border-white/10"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="w-full p-3 mb-3 rounded-xl bg-black/40 border border-white/10"
                value={form.contactNumber}
                onChange={(e) =>
                  setForm({ ...form, contactNumber: e.target.value })
                }
              />

              <input
                className="w-full p-3 mb-3 rounded-xl bg-black/40 border border-white/10"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <div className="flex gap-3">
                <button
                  onClick={updateProfile}
                  className="flex-1 bg-green-600 px-5 py-3 rounded-xl hover:scale-105 transition"
                >
                  Save
                </button>

                <button
                  onClick={() => setEdit(false)}
                  className="flex-1 bg-gray-700 px-5 py-3 rounded-xl hover:scale-105 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* BOOKINGS */}
        <h2 className="text-2xl font-bold mt-10 mb-5 text-center">My Orders</h2>

        {/* CONDITIONAL UI */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
            <video
              src={nodata}
              autoPlay
              loop
              muted
              playsInline
              className="w-[500px] max-w-full rounded-3xl shadow-xl"
            />

            <p className="text-gray-300 text-2xl font-bold mt-6">
              No Bookings Yet
            </p>

            <p className="text-gray-400 mt-2">
              Looks like you haven’t booked any car yet
            </p>

            <button
              onClick={() => navigate("/cars")}
              className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition duration-200"
            >
              Book Now
            </button>
          </div>
        ) : (
          <>
            {/* BOOKINGS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white/5 p-4 rounded-xl border border-white/10"
                >
                  <img
                    src={b.car?.image}
                    className="h-40 w-full object-cover rounded"
                  />

                  <h3 className="text-lg mt-2">{b.car?.name}</h3>

                  <p className="text-sm text-gray-400">
                    {b.fromDate?.slice(0, 10)} → {b.toDate?.slice(0, 10)}
                  </p>

                  <p className="mt-1">₹{b.totalAmount}</p>

                  <p className="text-sm text-gray-400">Status: {b.status}</p>
                </div>
              ))}
            </div>

            {/* PAGINATION (ONLY IF BOOKINGS EXIST) */}
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
