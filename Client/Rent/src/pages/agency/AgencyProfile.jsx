

import { useEffect, useState } from "react";
import API from "../../services/api";
import AgencyLayout from "./AgencyLayout";
import { MdEmail } from "react-icons/md";
import { Check, Edit, MapPin, PhoneCall, User } from "lucide-react";
import toast from "react-hot-toast";

function AgencyProfile() {
  const [agency, setAgency] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  useEffect(() => {
    fetchAgency();
  }, []);

  const fetchAgency = async () => {
    try {
      const res = await API.get("/auth/profile");

      setAgency(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        contactNumber: res.data.contactNumber || "",
        address: res.data.address || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  VALIDATION FUNCTION
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(form.email)) {
      toast.error("Enter valid email (must contain @)");
      return false;
    }

    if (!phoneRegex.test(form.contactNumber)) {
      toast.error("Contact must be 10 digits");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    try {
      //  APPLY VALIDATION
      if (!validateForm()) return;

      await API.put("/auth/profile", form);
      toast.success("Profile updated ");
      setEditMode(false);
      fetchAgency();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  return (
    <AgencyLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-purple-50 p-6 flex justify-center items-start">
        {/* MAIN CARD */}
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition duration-300">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full text-white">
              <User size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Agency Profile</h2>
          </div>

          {!editMode ? (
            <>
              {/* PROFILE DETAILS */}
              <div className="space-y-5">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
                  <User className="text-blue-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    {agency?.name}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
                  <MdEmail className="text-purple-600 text-xl" />
                  <p className="text-lg font-semibold text-gray-700">
                    {agency?.email}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
                  <PhoneCall className="text-green-600" />
                  <p className="text-lg font-semibold text-gray-700">
                    {agency?.contactNumber || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
                  <MapPin className="text-red-500" />
                  <p className="text-lg font-semibold text-gray-700">
                    {agency?.address || "No address"}
                  </p>
                </div>
              </div>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setEditMode(true)}
                className="mt-8 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl hover:scale-105 transition duration-300 shadow-lg"
              >
                Edit Profile <Edit size={18} />
              </button>
            </>
          ) : (
            <>
              {/* EDIT FORM */}
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
                  placeholder="Phone"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleUpdate}
                  className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:scale-105 transition shadow-lg"
                >
                  Save <Check size={18} />
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-400 text-white px-5 py-3 rounded-xl hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AgencyLayout>
  );
}

export default AgencyProfile;
