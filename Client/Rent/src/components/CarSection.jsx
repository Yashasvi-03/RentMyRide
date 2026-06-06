

import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft, ArrowRight, Car, FuelIcon, User2Icon, UserCheck2Icon, UserCircle, UsersIcon, UserXIcon } from "lucide-react";

function CarsSection({ filters }) {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  //  FILTER + LIMIT (6 cars only)
  const filteredCars = cars
    .filter((car) => {
      if (!filters?.location) return true;
      return car.location
        ?.toLowerCase()
        .includes(filters.location.toLowerCase());
    })
    .slice(0, 6); 

  return (
    <div id="cars" className="relative py-24 pb-12 px-6 bg-transparent">
      {/*  GLOW BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(0,102,255,0.2),transparent_60%)]"></div>

      <div className="relative z-10">
        {/*  HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Premium Car Collection </h2>

          <p className="text-gray-400">
            Experience luxury rides with powerful performance
          </p>
        </motion.div>

        {/*  GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/*  GLOW */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>

              {/* CARD */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={car.image || "https://via.placeholder.com/400"}
                    alt={car.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>

                  {/* PRICE */}
                  <div className="absolute top-4 left-4 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-semibold shadow">
                    ₹{car.pricePerDay}/day
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <p className="text-gray-400 ">{car.brand}</p>
                  <p className="text-sm text-gray-400 mb-3 ">Owner:{" "}
                    {car.agency?.name?.toLowerCase() === "admin"?"RentMyRide":car.agency?.name ||"Unkonwn"}
                  </p>

                  {/* DETAILS */}
                  <div className="flex justify-between text-sm text-gray-300 mb-5">
                    <span className="flex gap-2"><Car/>{car.type || "Type"}</span>
                    <span className="flex gap-2"><FuelIcon/>{car.fuelType || "Fuel"}</span>
                    <span className="flex gap-2"><UsersIcon/>:-{car.seatingCapacity || "Seats"}</span>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => navigate(`/booking/${car._id}`)}
                    className="relative w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden"
                  >
                    <span className="relative z-10">Book Now</span>

                    {/* SHINE */}
                    <span className="absolute left-[-100%] top-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:left-[100%] transition-all duration-700"></span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/*  VIEW ALL BUTTON */}
        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/cars")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow hover:scale-105  transition"
          >
             <span className="flex justify-between gap-1">View All Cars  <ArrowRight/></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarsSection;
