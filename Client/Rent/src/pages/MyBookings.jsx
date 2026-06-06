import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import nodata from "../assets/no-data-found.mp4";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const bookingsPerPage = 6;

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // CANCEL BOOKING
  const cancelBooking = async (id) => {
    try {
      const res = await API.put(`/bookings/cancel/${id}`);

      toast.success(
        `${res.data.message} | Refund ₹${res.data.refundAmount || 0}`,
      );

      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  // PAYMENT
  const handlePayment = async (booking) => {
    try {
      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const { data } = await API.post("/payment/create-order", {
        amount: booking.totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "RentMyRide",
        description: "Car Booking Payment",
        order_id: data.id,

        handler: async function (response) {
          try {
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });

            toast.success("Payment successful ");
            fetchBookings();
          } catch (err) {
            toast.error("Payment verification failed ");
          }
        },

        prefill: {
          name: booking.user?.name || "User",
          email: booking.user?.email || "user@email.com",
        },

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  // PAGINATION
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;

  const storedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const currentBookings = storedBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(storedBookings.length / bookingsPerPage);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white pt-24 px-6 pb-16">
        <h1 className="text-3xl font-bold mb-8 text-center">My Bookings</h1>

        {/*  NO BOOKINGS */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <p className="animate-pulse text-gray-400">Loading bookings..</p>
          </div>
        ) : storedBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
            <video
              src={nodata}
              autoPlay
              loop
              muted
              playsInline
              className="w-[500px] max-w-full rounded-3xl shadow-xl"
            />

            <p className="text-gray-300 text-2xl font-bold mt-6">
              No Bookings Yet
            </p>

            <p className="text-gray-400 mt-2">
              Looks like you haven’t booked any car yet
            </p>

            <button
              onClick={() => navigate("/cars")}
              className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition duration-200"
            >
              Book Now
            </button>
          </div>
        ) : (
          <>
            {/* BOOKINGS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:scale-105 transition duration-300"
                >
                  <img
                    src={b.car?.image}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <h2 className="text-xl font-semibold">{b.car?.name}</h2>

                  <p className="text-gray-400 text-sm mb-2">{b.car?.brand}</p>

                  <p className="text-sm">
                    {b.fromDate?.slice(0, 10)} → {b.toDate?.slice(0, 10)}
                  </p>

                  <p className="mt-2 font-semibold">₹{b.totalAmount}</p>

                  <p className="text-gray-400 text-sm mt-1">
                    {b.address}, {b.city}
                  </p>

                  {/* STATUS */}
                  <div className="flex justify-between mt-4 items-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        b.status === "confirmed"
                          ? "bg-green-600"
                          : b.status === "cancelled"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                      }`}
                    >
                      {b.status}
                    </span>

                    <span
                      className={`text-sm ${
                        b.paymentStatus === "paid"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </div>

                  {/* BUTTONS */}
                  {b.status !== "cancelled" && (
                    <>
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="mt-4 w-full py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                      >
                        Cancel Booking
                      </button>

                      {b.paymentStatus === "pending" && (
                        <button
                          onClick={() => handlePayment(b)}
                          className="mt-3 w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                        >
                          Proceed to Pay
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/*  PAGINATION (only if bookings exist) */}
            {storedBookings.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1 ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default MyBookings;
