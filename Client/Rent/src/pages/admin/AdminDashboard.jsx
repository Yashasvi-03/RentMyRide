import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./AdminLayout";
import RevenueChart from "./RevenueChart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [filter, setFilter] = useState("weekly");
  const [loading, setLoading] = useState(false);

  const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/admin/dashboard?filter=${filter}`);

        setData(res.data);
        setChartData(res.data.chartData || []);
        setTopCars(
          (res.data.topCars || []).filter(
            (car) => car && car.name && car.name !== "Unknown",
          ),
        );
        setRecentBookings(res.data.recentBookings || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/*  STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Users", value: data.users, color: "bg-blue-500" },
          { label: "Cars", value: data.cars, color: "bg-green-500" },
          { label: "Bookings", value: data.bookings, color: "bg-purple-500" },
          {
            label: "Revenue",
            value: `₹${data.revenue}`,
            color: "bg-yellow-500",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.color} text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300`}
          >
            <h4 className="text-lg">{card.label}</h4>
            <p className="text-2xl font-bold">{card.value || 0}</p>
          </div>
        ))}
      </div>

      {/*  FILTER */}
      <div className="mb-6 flex gap-3">
        <button
          disabled={loading}
          onClick={() => setFilter("weekly")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Weekly
        </button>

        <button
          disabled={loading}
          onClick={() => setFilter("monthly")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "monthly"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Monthly
        </button>
      </div>

      {/*  CHARTS SIDE BY SIDE */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* LINE CHART */}
        <div className="bg-white p-6 rounded-xl shadow h-[350px] flex items-center justify-center transition">
          {loading ? (
            <p className="animate-pulse text-gray-400">Loading chart...</p>
          ) : (
            <RevenueChart data={chartData} />
          )}
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow h-[350px] flex items-center justify-center transition">
          {loading ? (
            <p className="animate-pulse text-gray-400">Loading chart...</p>
          ) : topCars.length === 0 ? (
            <p>No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCars.filter(
                    (car) => car && car.name && car.name !== "Unknown",
                  )}
                  dataKey="revenue"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={4}
                  animationDuration={800}
                >
                  {topCars.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/*  TOP CARS */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 hover:shadow-xl transition">
        <h3 className="text-xl font-semibold mb-4">Top Cars</h3>

        {topCars.length === 0 ? (
          <p>No data available</p>
        ) : (
          topCars
            .filter((car) => car && car.name && car.name !== "Unknown")
            .map((car, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2 hover:bg-gray-100 px-3 rounded transition"
              >
                <span>{car.name}</span>
                <span className="text-green-600 font-bold">
                  ₹{car.revenue || 0}
                </span>
              </div>
            ))
        )}
      </div>

      {/*  RECENT BOOKINGS */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
        <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>

        {recentBookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">User</th>
                <th className="py-2">Car</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Payment</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2">{b.user?.name || "User"}</td>
                  <td className="py-2">{b.car?.name || "Car"}</td>
                  <td className="py-2 text-green-600 font-semibold">
                    ₹{b.totalPrice || b.totalAmount || 0}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        b.paymentStatus === "paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {b.paymentStatus || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
