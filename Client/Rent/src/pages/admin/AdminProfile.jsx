import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";
import { User } from "lucide-react";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    address: "",
  });

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setAdmin(res.data);

      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        contactNumber: res.data.contactNumber || "",
        password: "",
        address: res.data.address || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // VALIDATION
  const validate = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!form.name) return "Name is required";
    if (!emailRegex.test(form.email)) return "Invalid email";
    if (!/^\d{10}$/.test(form.contactNumber))
      return "Contact must be 10 digits";
    if (form.password && form.password.length < 6)
      return "Password must be at least 6 characters";
    if (!form.address) return "Address is required";

    return null;
  };

  // UPDATE
  const handleUpdate = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await API.put("/auth/profile", form);
      toast.success("Profile updated ");
      setEditMode(false);
      fetchProfile();
    } catch {
      toast.error("Update failed ");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex justify-center items-center p-6">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
          {/* HEADER */}
          

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full text-white">
              <User size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          </div>

          {!editMode ? (
            <>
              {/* VIEW MODE */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="text-lg font-semibold">{admin?.name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="text-lg font-semibold">{admin?.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">Contact</p>
                  <p className="text-lg font-semibold">
                    {admin?.contactNumber || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">Address</p>
                  <p className="text-lg font-semibold">
                    {admin?.address || "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              {/* EDIT MODE */}
              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                />

                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                />

                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="New Password (optional)"
                  type="password"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
                />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-xl hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
