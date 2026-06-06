

import { useEffect, useState } from "react";
import API from "../../services/api";
import AgencyLayout from "./AgencyLayout";

function AgencyBookings() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 6;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/agency");
      setBookings(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  //  SORT (LATEST FIRST)
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // PAGINATION
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedBookings.length / rowsPerPage);

  return (
    <AgencyLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold">My Bookings </h2>
          <p className="text-gray-500">Manage bookings for your cars</p>
        </div>

        {/* EMPTY */}
        {bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-lg">No bookings found </p>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-left">
                    <th className="py-3 px-3 rounded-tl-xl">Car</th>
                    <th className="py-3 px-3">Image</th>
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 rounded-tr-xl">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {currentBookings.map((b, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-blue-50 hover:scale-[1.01] transition duration-300"
                    >
                      <td className="py-3 px-3 font-semibold">
                        {b.car?.name || "Car"}
                      </td>

                      <td className="py-3 px-3">
                        <img
                          src={b.car?.image || "https://via.placeholder.com/80"}
                          alt="car"
                          className="w-16 h-12 object-cover rounded-lg shadow"
                        />
                      </td>

                      <td className="py-3 px-3">{b.user?.name || "User"}</td>

                      <td className="py-3 px-3 text-green-600 font-semibold">
                        ₹{b.totalAmount}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                            b.status === "approved"
                              ? "bg-green-500"
                              : b.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        >
                          {b.status || "pending"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-500 text-xs">
                        {b.createdAt
                          ? new Date(b.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </AgencyLayout>
  );
}

export default AgencyBookings;
