

import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Car, FuelIcon, UsersIcon } from "lucide-react";
import nodata from "../assets/no-data-found.mp4";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    fuelType: "",
    seatingCapacity: "",
  });

  const [types, setTypes] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [seats, setSeats] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  const fetchCars = async () => {
    try {
      setLoading(true);

      const res = await API.get("/cars");

      const sortedCars = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setCars(sortedCars);
      setFilteredCars(sortedCars);

      setTypes([...new Set(sortedCars.map((c) => c.type).filter(Boolean))]);
      setFuelTypes([
        ...new Set(sortedCars.map((c) => c.fuelType).filter(Boolean)),
      ]);
      setSeats([
        ...new Set(sortedCars.map((c) => c.seatingCapacity).filter(Boolean)),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const applyFilters = () => {
    let temp = [...cars];

    if (filters.location) {
      temp = temp.filter((c) =>
        c.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    if (filters.minPrice) {
      temp = temp.filter((c) => c.pricePerDay >= filters.minPrice);
    }

    if (filters.maxPrice) {
      temp = temp.filter((c) => c.pricePerDay <= filters.maxPrice);
    }

    if (filters.type) {
      temp = temp.filter((c) => c.type === filters.type);
    }

    if (filters.fuelType) {
      temp = temp.filter((c) => c.fuelType === filters.fuelType);
    }

    if (filters.seatingCapacity) {
      temp = temp.filter((c) => c.seatingCapacity == filters.seatingCapacity);
    }

    setFilteredCars(temp);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      type: "",
      fuelType: "",
      seatingCapacity: "",
    });
    setFilteredCars(cars);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white pt-24 px-6 flex gap-8">
        {/* SIDEBAR SAME */}
        <div className="w-72 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-fit sticky top-28">
          <h2 className="text-xl font-semibold mb-6">Filters</h2>

          <div className="space-y-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black border border-gray-600"
            />
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black border border-gray-600"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black border border-gray-600"
            />

            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black border border-gray-600"
            >
              <option value="">All Types</option>
              {types.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black border border-gray-600"
            >
              <option value="">Fuel Type</option>
              {fuelTypes.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <select
              name="seatingCapacity"
              value={filters.seatingCapacity}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black border border-gray-600"
            >
              <option value="">Seats</option>
              {seats.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={applyFilters}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transition"
            >
              Apply Filters
            </button>

            <button
              onClick={resetFilters}
              className="w-full py-2 bg-gray-800 border border-gray-500 rounded-lg hover:scale-105 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Explore Cars</h1>
            <p className="text-gray-400">Find your perfect ride</p>
          </div>

          {loading ? (
            <div className="flex justify-center mt-20">
              <p className="animate-pulse text-gray-400">Loading cars...</p>
            </div>
          ) : currentCars.length === 0 ? (
            <div className="flex flex-col items-center mt-20">
              <video src={nodata} autoPlay loop muted className="w-96" />
              <h2>No Cars Found</h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {currentCars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>

                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg group-hover:scale-[1.04] transition duration-300">
                      <img
                        src={car.image}
                        className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
                      />

                      <div className="p-5">
                        <h3 className="text-xl">{car.name}</h3>
                        <p className="text-gray-400">{car.brand}</p>

                        {/*  OWNER NAME ADDED */}
                        <p className="text-sm text-gray-400 mt-1">
                          Owner:{" "}
                          {car.agency?.name?.toLowerCase() === "admin"
                            ? "RentMyRide"
                            : car.agency?.name || "Unknown"}
                        </p>

                        <div className="flex justify-between text-sm text-gray-300 mt-3">
                          <span className="flex gap-2">
                            <Car />
                            {car.type}
                          </span>
                          <span className="flex gap-2">
                            <FuelIcon />
                            {car.fuelType}
                          </span>
                          <span className="flex gap-2">
                            <UsersIcon />
                            {car.seatingCapacity}
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/booking/${car._id}`)}
                          className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-10 mb-10 gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-500" : "bg-gray-700"}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CarsPage;
