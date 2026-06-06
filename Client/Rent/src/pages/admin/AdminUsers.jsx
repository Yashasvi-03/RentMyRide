

import { useEffect, useState } from "react";
import API from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function AdminUsers() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q") || "";

  const cardsPerPage = 9;

  useEffect(() => {
    fetchUsersBookings();
  }, []);

  const fetchUsersBookings = async () => {
    try {
      const res = await API.get("/bookings");

      //  REMOVE DELETED USERS 
      const validBookings = (res.data || []).filter((b) => b.user?._id);

      setBookings(validBookings);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/admin/users?q=${search}`);
      setCurrentPage(1);
    }
  };

  const safe = (val) => (val ? val.toString().toLowerCase() : "");

  const filteredBookings = bookings.filter(
    (b) =>
      safe(b.user?.name).includes(query.toLowerCase()) ||
      safe(b.user?.email).includes(query.toLowerCase()),
  );

  const uniqueUsers = [
    ...new Map(bookings.map((b) => [b.user?._id, b.user])).values(),
  ];

  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;

  const storedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const currentBookings = storedBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / cardsPerPage);

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Users Activity</h2>
        <p className="text-gray-500">Track users and their booked cars</p>
      </div>

      {/* STATS + SEARCH */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg">Total Users</h3>
          <p className="text-3xl font-bold">{uniqueUsers.length}</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl flex items-center w-full md:w-80 shadow">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search user..."
            className="outline-none w-full ml-2 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* CARDS */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBookings.map((b, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-2xl hover:-translate-y-2 transition duration-300 border-l-4 border-blue-500"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {b.user?.name}
                </h3>

                <p className="text-gray-500 text-sm mb-3">{b.user?.email}</p>

                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-600">Booked Car</p>
                  <p className="font-semibold text-gray-800">
                    {b.car?.name || "Car"}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {b.createdAt
                    ? new Date(b.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Prev
            </button>

            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded ${
                currentPage === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </button>

            {currentPage > 2 && (
              <span
                onClick={() => setCurrentPage(currentPage - 2)}
                className="px-2 cursor-pointer"
              >
                ...
              </span>
            )}

            {[currentPage, currentPage + 1].map((page) =>
              page > 1 && page < totalPages ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ) : null,
            )}

            {currentPage + 1 < totalPages - 1 && (
              <span
                onClick={() => setCurrentPage(currentPage + 2)}
                className="px-2 cursor-pointer"
              >
                ...
              </span>
            )}

            {totalPages > 1 && currentPage !== totalPages && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsers;
