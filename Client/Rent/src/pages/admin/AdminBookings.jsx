

import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");

      //  FILTER: remove deleted user OR car bookings
      const validBookings = (res.data || []).filter((b) => b.user && b.car);

      setBookings(validBookings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // PAGINATION DATA
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const storedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const currentBookings = storedBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / rowsPerPage);

  const getPagination = () => {
    let pages = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push("left-dots");
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("right-dots");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">All Bookings </h2>
          <p className="text-gray-500">Manage all user bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-lg">No bookings found </p>
          </div>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-left">
                    <th className="py-3 px-3 rounded-tl-xl">User</th>
                    <th className="py-3 px-3">Car</th>
                    <th className="py-3 px-3">From</th>
                    <th className="py-3 px-3">To</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment</th>
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
                      <td className="py-3 px-3 font-medium text-gray-800">
                        {b.user?.name}
                      </td>

                      <td className="py-3 px-3">{b.car?.name}</td>

                      <td className="py-3 px-3">
                        {new Date(b.fromDate).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3">
                        {new Date(b.toDate).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3 font-semibold text-green-600">
                        ₹{b.totalAmount}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                            b.paymentStatus === "paid"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {b.paymentStatus || "pending"}
                        </span>
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
                        {new Date(b.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

              {getPagination().map((p, i) =>
                p === "left-dots" ? (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(currentPage - 2)}
                    className="px-3 py-2 bg-gray-300 rounded"
                  >
                    ...
                  </button>
                ) : p === "right-dots" ? (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(currentPage + 2)}
                    className="px-3 py-2 bg-gray-300 rounded"
                  >
                    ...
                  </button>
                ) : (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-2 rounded ${
                      currentPage === p
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

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
    </>
  );
}

export default AdminBookings;
