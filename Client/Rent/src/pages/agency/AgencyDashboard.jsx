

import { useEffect, useState } from "react";
import API from "../../services/api";
import AgencyLayout from "./AgencyLayout";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";

function AgencyDashboard() {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingRes = await API.get("/bookings/agency");

      // ONLY AGENCY CARS 
      const carRes = await API.get("/cars/my");

      setBookings(bookingRes.data.bookings || bookingRes.data || []);
      setCars(carRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const revenue = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const barData = bookings.slice(0, 6).map((b, i) => ({
    name: `B${i + 1}`,
    amount: b.totalAmount || 0,
  }));

  const paymentData = [
    {
      name: "Paid",
      value: bookings.filter((b) => b.paymentStatus === "paid").length,
    },
    {
      name: "Pending",
      value: bookings.filter(
        (b) => !b.paymentStatus || b.paymentStatus === "pending",
      ).length,
    },
    {
      name: "Failed",
      value: bookings.filter((b) => b.paymentStatus === "failed").length,
    },
  ];

  const PAYMENT_COLORS = ["#22c55e", "#facc15", "#ef4444"];

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <AgencyLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Agency Dashboard </h2>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-lg">Cars</h3>
            <p className="text-3xl font-bold">{cars.length}</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-lg">Bookings</h3>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-lg">Revenue</h3>
            <p className="text-3xl font-bold">₹{revenue}</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/*  BAR CHART */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="font-semibold mb-4">Revenue Overview </h3>

            {cars.length === 0 ? (
              <p className="text-center text-gray-400">
                
                 Add car first to see data
              </p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-400"> No bookings yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true} 
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/*  PIE CHART */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="font-semibold mb-4">Payment Status </h3>

            {cars.length === 0 ? (
              <p className="text-center text-gray-400">
                 Add car first to see data
              </p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-400"> No bookings yet</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={6}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      isAnimationActive={true} //  animation
                      animationDuration={1200}
                    >
                      {paymentData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PAYMENT_COLORS[index]}
                          stroke="#fff"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* LEGEND */}
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  {paymentData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PAYMENT_COLORS[i] }}
                      ></span>
                      <span className="text-gray-700">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>

          {recentBookings.length === 0 ? (
            <p className="text-gray-500">No bookings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-left">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Car</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((b, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b hover:bg-blue-50 hover:scale-[1.01] transition duration-300"
                    >
                      <td className="py-3 px-4 font-medium">
                        {b.user?.name || "User"}
                      </td>

                      <td className="py-3 px-4">{b.car?.name || "Car"}</td>

                      <td className="py-3 px-4 font-semibold text-green-600">
                        ₹{b.totalAmount}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs ${
                            b.status === "approved"
                              ? "bg-green-500"
                              : b.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AgencyLayout>
  );
}

export default AgencyDashboard;
