

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  //  PREFILL LOGIC ADDED
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);

      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/contact", form);

      toast.success("Message sent successfully ");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.log(err.response?.data);

      toast.error(err.response?.data?.message || "Error sending message");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white pt-28 px-6">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-gray-400">
            Have questions? We’d love to hear from you!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-400" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-400">support@rentmyride.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
              <div className="flex items-center gap-4">
                <Phone className="text-green-400" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
              <div className="flex items-center gap-4">
                <MapPin className="text-red-400" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-gray-400">Ahmedabad, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-semibold mb-6">Send Message </h2>

            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 mb-4 rounded bg-black/40 border border-white/20 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 mb-4 rounded bg-black/40 border border-white/20 outline-none"
              required
            />

            <textarea
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-3 mb-4 rounded bg-black/40 border border-white/20 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg hover:scale-105 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
