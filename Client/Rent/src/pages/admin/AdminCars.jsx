

import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function AdminCars() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const carsPerPage = 6;

  const [form, setForm] = useState({
    name: "",
    brand: "",
    type: "",
    fuelType: "",
    seatingCapacity: "",
    pricePerDay: "",
    images: [],
    location: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [sliderIndex, setSliderIndex] = useState({});

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const urls = e.target.value.split(",").map((url) => url.trim());
    setForm({ ...form, images: urls });
  };

  const changeSlide = (id, direction, length) => {
    setSliderIndex((prev) => {
      const current = prev[id] || 0;

      if (direction === "next") {
        return { ...prev, [id]: current === length - 1 ? 0 : current + 1 };
      } else {
        return { ...prev, [id]: current === 0 ? length - 1 : current - 1 };
      }
    });
  };

  const handleSubmit = async () => {
    //  REQUIRED VALIDATION ADDED
    if (
      !form.name ||
      !form.brand ||
      !form.type ||
      !form.fuelType ||
      !form.seatingCapacity ||
      !form.pricePerDay ||
      !form.location ||
      !form.images.length
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/cars/${editingId}`, {
          ...form,
          images: form.images?.length ? form.images : [],
        });
        toast.success("Car Updated ");
      } else {
        await API.post("/cars/add", {
          ...form,
          images: form.images?.length ? form.images : [],
        });
        toast.success("Car Added ");
      }

      setForm({
        name: "",
        brand: "",
        type: "",
        fuelType: "",
        seatingCapacity: "",
        pricePerDay: "",
        images: [],
        location: "",
      });

      setEditingId(null);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This car will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/cars/${id}`);

      Swal.fire({
        title: "Deleted!",
        text: "Car has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCars();
    } catch {
      toast.error("Not allowed");
    }
  };

  const handleEdit = (car) => {
    setForm({
      name: car.name || "",
      brand: car.brand || "",
      type: car.type || "",
      fuelType: car.fuelType || "",
      seatingCapacity: car.seatingCapacity || "",
      pricePerDay: car.pricePerDay || "",
      images: car.images?.length ? car.images : car.image ? [car.image] : [],
      location: car.location || "",
    });

    setEditingId(car._id);
  };

  const safe = (val) => (val ? val.toString().toLowerCase() : "");

  const filteredCars = cars.filter(
    (car) =>
      safe(car.name).includes(query.toLowerCase()) ||
      safe(car.brand).includes(query.toLowerCase()),
  );

  const sortedCars = [...filteredCars].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;

  const currentCars = sortedCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Manage Cars</h2>

      <div className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Car Name"
          className="input"
        />
        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="input"
        />
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type"
          className="input"
        />
        <input
          name="fuelType"
          value={form.fuelType}
          onChange={handleChange}
          placeholder="Fuel Type"
          className="input"
        />
        <input
          name="seatingCapacity"
          value={form.seatingCapacity}
          onChange={handleChange}
          placeholder="Seating Capacity"
          className="input"
        />
        <input
          name="pricePerDay"
          value={form.pricePerDay}
          onChange={handleChange}
          placeholder="Price"
          className="input"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="input"
        />

        <input
          type="text"
          value={form.images?.join(", ") || ""}
          onChange={handleImages}
          placeholder="Image URLs"
          className="input col-span-2"
        />

        <div className="flex gap-2 flex-wrap col-span-2">
          {form.images.map((img, i) => (
            <img key={i} src={img} className="w-24 h-20 object-cover rounded" />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Car" : "Add Car"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {currentCars.map((car) => {
          const currentIndex = sliderIndex[car._id] || 0;
          const isAdminCar = car.agency?.name?.toLowerCase() === "admin";

          return (
            <div
              key={car._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-2xl hover:scale-[1.04] transition duration-300"
            >
              <div className="relative">
                <img
                  src={
                    car.images && car.images.length > 0
                      ? car.images[currentIndex]
                      : car.image
                        ? car.image
                        : "https://dummyimage.com/600x400/000/fff&text=No+Image"
                  }
                  className="w-full h-40 object-cover rounded"
                />
              </div>

              <h3 className="text-lg font-bold mt-2">{car.name}</h3>
              <p>{car.brand}</p>

              <p className="text-sm text-gray-500">
                Owner: {isAdminCar ? "RentMyRide" : car.agency?.name}
              </p>

              <p className="text-sm">
                {car.type} • {car.fuelType}
              </p>

              <p className="text-green-600 font-bold">₹{car.pricePerDay}</p>

              {isAdminCar && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(car)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(car._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedCars.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminCars;
