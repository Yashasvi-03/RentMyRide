import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero({ setFilters }) {
  const [form, setform] = useState({
    location: "",
    fromDate: "",
    toDate: "",
  });
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("FILTERS:", form);
    if (!form.fromDate || !form.toDate) {
      return toast.error("Please select both dates");
    }
    const today = new Date().toISOString().split("T")[0];
    if (form.fromDate < today) {
      return toast.error("From date cannot be in the past");
    }
    if (form.toDate < form.fromDate) {
      return toast.error("Return date must be after pickup date");
    }

    setFilters(form);

    document.getElementById("cars")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center text-white relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1493238792000-8113da705763')",
      }}
    >
      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

      {/* CONTENT */}
      <div className="relative z-10 px-10 md:px-20 max-w-4xl">
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
        >
          Drive Beyond Limits
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-200 mb-8 text-lg"
        >
          Experience luxury cars at unbeatable prices. Book your perfect ride
          today.
        </motion.p>

        {/*  FORM STYLE SEARCH */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/40 text-white rounded-2xl shadow-2xl p-6 max-w-[500px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter city"
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>

            {/* Pickup Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Pick-up Date</label>
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                min={today}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>

            {/* Return Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Return Date</label>
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                min={form.fromDate || today}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-5 text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition font-semibold"
            >
              Search Cars
            </button>
          </div>
        </motion.form>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4 mt-6"
        >
          <button
            onClick={() => navigate("/cars")}
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Explore Cars
          </button>

          <button
            onClick={() => navigate("/about")}
            className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"
          >
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
