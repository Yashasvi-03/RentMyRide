

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    agencyName: "",
    contactNumber: "",
    address: "", 
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    //  VALIDATIONS

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.contactNumber ||
      !form.address
    ) {
      return toast.error("All fields are required");
    }

    if (form.name.length < 3) {
      return toast.error("Name must be at least 3 characters");
    }

    // Address min length
    if (form.address.length < 5) {
      return toast.error("Address must be at least 5 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return toast.error("Invalid email format");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*!]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      return toast.error(
        "Password must be at least 6 characters and include letters & numbers",
      );
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.contactNumber)) {
      return toast.error("Contact number must be 10 digits");
    }

    if (form.role === "agency" && !form.agencyName) {
      return toast.error("Agency name is required");
    }

    try {
      await API.post("/auth/register", form);

      if (form.role === "agency") {
        toast.success("Registered! Wait untill login approval");
      } else {
        toast.success("Registed Successfully");
      }
      // toast.success("Registered Successfully ");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Register
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Contact */}
        <input
          type="text"
          placeholder="Contact Number"
          className="w-full p-3 rounded mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
        />

        {/*  ADDRESS FIELD */}
        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 rounded mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* Role */}
        <select
          className="w-full p-3 rounded mb-3 bg-white/20 text-white outline-none"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="customer" className="text-black">
            Customer
          </option>
          <option value="agency" className="text-black">
            Agency
          </option>
        </select>

        {/* Agency Name */}
        {form.role === "agency" && (
          <input
            type="text"
            placeholder="Agency Name"
            className="w-full p-3 rounded mb-3 bg-white/20 text-white placeholder-gray-300 outline-none"
            onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
          />
        )}

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-green-500 py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-sm mt-4 text-center text-gray-300">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
