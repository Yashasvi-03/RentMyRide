

import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

function AdminAgencies() {
  const [agencies, setAgencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const agenciesPerPage = 9;

  const fetchAgencies = async () => {
    try {
      const res = await API.get("/admin/agencies");
      setAgencies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  // TOGGLE APPROVE (same API)
  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      toast.success("Status Updated");
      fetchAgencies();
    } catch (err) {
      toast.error("Error");
    }
  };

  const pendingCount = agencies.filter((a) => !a.isApproved).length;

  // PAGINATION
  const indexOfLast = currentPage * agenciesPerPage;
  const indexOfFirst = indexOfLast - agenciesPerPage;
  const currentAgencies = agencies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(agencies.length / agenciesPerPage);

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-4">Agency Approval</h2>

      <p className="mb-4 text-yellow-600 font-semibold">
        Pending Agencies: {pendingCount}
      </p>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentAgencies.map((agency) => (
              <tr
                key={agency._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-semibold">{agency.name}</td>

                <td className="py-3 px-4 text-gray-600">{agency.email}</td>

                {/* STATUS */}
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      agency.isApproved ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {agency.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>

                {/* TOGGLE SWITCH */}
                <td className="py-3 px-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agency.isApproved}
                      onChange={() => handleApprove(agency._id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}

export default AdminAgencies;
