

import { useEffect, useState } from "react";
import API from "../../services/api";
import AgencyLayout from "./AgencyLayout";
import { Car, FuelIcon, UsersIcon } from "lucide-react";
import toast from "react-hot-toast";

function AgencyCars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  useEffect(() => {
    fetchCars();
  }, []);

  // ONLY OWN CARS
  const fetchCars = async () => {
    const res = await API.get("/cars/my");
    setCars(res.data);
  };

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    //  REQUIRED VALIDATION ADDED
    if (
      !form.name ||
      !form.brand ||
      !form.pricePerDay ||
      !form.type ||
      !form.fuelType ||
      !form.seatingCapacity ||
      !form.location ||
      !form.image
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editId) {
        await API.put(`/cars/${editId}`, {
          ...form,
          images: form.image ? [form.image] : [],
        });
        toast.success("Car Updated");
      } else {
        await API.post("/cars/add", {
          ...form,
          images: form.image ? [form.image] : [],
        });
        toast.success("Car Added");
      }

      setForm({});
      setEditId(null);
      fetchCars();
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT
  const handleEdit = (car) => {
    setForm(car);
    setEditId(car._id);
  };

  // DELETE
  const handleDelete = async (id) => {
    await API.delete(`/cars/${id}`);
    toast.error("Car Deleted");
    fetchCars();
  };

  //  SORT BY RECENT (LATEST FIRST)
  const sortedCars = [...cars].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // PAGINATION
  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = sortedCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  return (
    <AgencyLayout>
      <h2 className="text-3xl font-bold mb-6">My Cars </h2>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl mb-4">{editId ? "Update Car" : "Add Car"}</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="brand"
            placeholder="Brand"
            value={form.brand || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="pricePerDay"
            placeholder="Price"
            value={form.pricePerDay || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="type"
            placeholder="Type"
            value={form.type || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="fuelType"
            placeholder="Fuel"
            value={form.fuelType || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="seatingCapacity"
            placeholder="Seats"
            value={form.seatingCapacity || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location || ""}
            onChange={handleChange}
            className="p-2 border"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image || ""}
            onChange={handleChange}
            className="p-2 border"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* CARD LIST */}
      {cars.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          <p>No cars found </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition duration-300"
              >
                <img
                  src={
                    car.images && car.images.length > 0
                      ? car.images[0]
                      : car.image
                        ? car.image
                        : "https://dummyimage.com/600x400/000/fff&text=No+Image"
                  }
                  onError={(e) =>
                    (e.target.src =
                      "https://dummyimage.com/600x400/000/fff&text=No+Image")
                  }
                  className="w-full h-56 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <p className="text-gray-500">{car.brand}</p>

                  <p className="text-sm text-gray-400 mb-3">
                    Owner:{" "}
                    {car.agency?.name?.toLowerCase() === "admin"
                      ? "RentMyRide"
                      : car.agency?.name || "Unknown"}
                  </p>

                  <div className="flex justify-between text-sm mt-2 text-gray-600">
                    <span>
                      <Car /> {car.type}
                    </span>
                    <span>
                      <FuelIcon /> {car.fuelType}
                    </span>
                    <span>
                      <UsersIcon /> {car.seatingCapacity}
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-green-600">
                    ₹{car.pricePerDay}/day
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(car)}
                      className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(car._id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </AgencyLayout>
  );
}

export default AgencyCars;
