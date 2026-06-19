import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { Calendar, Calendar1, Car, FuelIcon, UsersIcon } from "lucide-react";
import Swal from "sweetalert2";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [total, setTotal] = useState(0);
  console.log("KEY", import.meta.env.VITE_RAZORPAY_KEY);

  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpay().then((res) => {
      if (!res) {
        toast.error("Razorpay SDK failed to load");
      }
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const carRes = await API.get("/cars");
        const selected = carRes.data.find((c) => c._id === id);
        setCar(selected);

        const userRes = await API.get("/users/profile");

        setForm((prev) => ({
          ...prev,
          address: userRes.data.address || "",
          city: userRes.data.city || "",
          pincode: userRes.data.pincode || "",
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (car) {
      if (!form.fromDate || !form.toDate) {
        setTotal(car.pricePerDay);
        return;
      }

      const days =
        (new Date(form.toDate) - new Date(form.fromDate)) /
          (1000 * 60 * 60 * 24) +
        1;

      if (days > 0) {
        setTotal(days * car.pricePerDay);
      }
    }
  }, [form, car]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //   const handleBooking = async () => {
  //     try {
  //       await API.post("/booking/create", {
  //         carId: id,
  //         ...form,
  //       });

  //       alert("Booking Created!");
  //       navigate("/my-bookings");
  //     } catch (err) {
  //       alert(err.response?.data?.message);
  //     }
  //   };

  //   const handleBooking = async () => {
  //     try {
  //       if (!window.Razorpay) {
  //         alert("Razorpay SDK not loaded.Check script");
  //         return;
  //       }
  //       //  Create order from backend
  //       const { data } = await API.post("/payment/create-order", {
  //         amount: total,
  //       });
  //       console.log(window.Razorpay);

  //       const options = {
  //         key: import.meta.env.VITE_RAZORPAY_KEY, // frontend key
  //         amount: data.amount,
  //         currency: "INR",
  //         name: "RentMyRide",
  //         description: "Car Booking Payment",
  //         order_id: data.id,

  //         handler: async function (response) {
  //           try {
  //             // Verify payment
  //             await API.post("/payment/verify", {
  //               razorpay_order_id: response.razorpay_order_id,
  //               razorpay_payment_id: response.razorpay_payment_id,
  //               razorpay_signature: response.razorpay_signature,
  //             });

  //             //  Create booking AFTER payment
  //             await API.post("/booking/create", {
  //               carId: id,
  //               ...form,
  //             });

  //             alert("Payment Successful & Booking Confirmed 🎉");
  //             navigate("/my-bookings");
  //           } catch (err) {
  //             alert("Payment verification failed");
  //           }
  //         },

  //         prefill: {
  //           name: "User",
  //           email: "user@email.com",
  //         },

  //         theme: {
  //           color: "#6366f1",
  //         },
  //       };

  //       const rzp = new window.Razorpay(options);
  //       rzp.open();
  //     } catch (err) {
  //       console.log(err);
  //       alert("Payment failed");
  //     }
  //   };

  // const handleBooking = async () => {
  //   try {
  //     if (!window.Razorpay) {
  //       console.log("Razorpay SDK not loaded");
  //       return;
  //     }

  //     const todayDate = new Date();
  //     const from = new Date(form.fromDate);
  //     const to = new Date(form.toDate);

  //     if (from < todayDate.setHours(0, 0, 0, 0)) {
  //       return toast.error("Past date allowed nahi Hai");
  //     }
  //     if (to < from) {
  //       return toast.error("Invalid date range");
  //     }
  //     // CREATE BOOKING FIRST
  //     const bookingRes = await API.post("/bookings/create", {
  //       carId: id,
  //       ...form,
  //     });

  //     const bookingId = bookingRes.data._id;

  //     // CREATE ORDER
  //     const { data } = await API.post("/payment/create-order", {
  //       amount: total,
  //     });

  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY,
  //       amount: data.amount,
  //       currency: "INR",
  //       name: "RentMyRide",
  //       description: "Car Booking Payment",
  //       order_id: data.id,

  //       handler: async function (response) {
  //         try {
  //           // VERIFY PAYMENT (WITH bookingId )
  //           await API.post("/payment/verify", {
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             bookingId: bookingId,
  //           });

  //           toast.success("Payment Successful & Booking Confirmed ");
  //           navigate("/my-bookings");
  //         } catch (err) {
  //           console.log(err.response?.data || err.message);
  //           toast.error("Payment verification failed ");
  //         }
  //       },

  //       prefill: {
  //         name: "User",
  //         email: "user@email.com",
  //       },

  //       theme: {
  //         color: "#6366f1",
  //       },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (err) {
  //     console.log(err.response?.data || err.message);
  //     toast.error("Already Booked ");
  //   }
  // };
  const handleBooking = async () => {
    try {
      if (!window.Razorpay) {
        console.log("Razorpay SDK not loaded");
        return;
      }

      //  VALIDATION (ALL REQUIRED)
      if (
        !form.fromDate ||
        !form.toDate ||
        !form.address ||
        !form.city ||
        !form.pincode
      ) {
        return toast.error("All fields are required");
      }

      const todayDate = new Date();
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);

      if (from < todayDate.setHours(0, 0, 0, 0)) {
        return toast.error("Past date is not allowed.");
      }
      if (to < from) {
        return toast.error("Invalid date range");
      }

      //  CHECK AVAILABILITY FIRST
      try {
        await API.post("/bookings/check-availability", {
          carId: id,
          fromDate: form.fromDate,
          toDate: form.toDate,
        });
      } catch (err) {
        const message = err.response?.data?.message || "Car already booked";

        toast.error(message);
        return;
      }

      // TERMS & CONDITIONS POPUP
      const result = await Swal.fire({
        title: "Terms & Conditions",
        html: `
    <div style="text-align:center; margin-bottom:10px;">
      <h3 style="margin:0; color:#6366f1;">Welcome to RentMyRide </h3>
    </div>

    <div style="
      text-align:left;
      font-size:14px;
      line-height:1.7;
      background:#ffffff;
      padding:15px;
      border-radius:12px;
      border:1px solid #e5e7eb;
      color:#111827;
    ">

      <ol style="padding-left:18px;">
        <li>-Booking is confirmed only after successful payment.</li>
        <li>-If you cancel within <b>3 days (72 hours)</b>, you get a <b>full refund</b>.</li>
        <li>-If cancelled after 3 days, <b>cancellation charges</b> will apply.</li>
        <li>-User must provide correct booking details (address, dates, etc.).</li>
        <li>-Any damage or misuse may result in additional charges.</li>
      </ol>

      <div style="
        margin-top:15px;
        display:flex;
        align-items:center;
        gap:8px;
        padding:10px;
        border-radius:8px;
        border:1px solid #d1d5db;
        background:#f9fafb;
      ">
        <input type="checkbox" id="agreeTerms" />
        <label for="agreeTerms">I agree to Terms & Conditions</label>
      </div>

    </div>
  `,
        showCancelButton: true,
        confirmButtonText: "Proceed to Pay ",
        cancelButtonText: "Cancel ",

        background: "#ffffff",
        color: "#111827",

        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#ef4444",

        customClass: {
          popup: "rounded-2xl shadow-xl",
        },

        preConfirm: () => {
          const isChecked = document.getElementById("agreeTerms").checked;
          if (!isChecked) {
            Swal.showValidationMessage("Please accept Terms & Conditions");
          }
          return isChecked;
        },
      });

      // USER CANCEL
      if (!result.isConfirmed) {
        navigate("/cars");
        return;
      }

      //  CREATE BOOKING FIRST
      const bookingRes = await API.post("/bookings/create", {
        carId: id,
        ...form,
      });

      const bookingId = bookingRes.data._id;

      //  CREATE ORDER
      const { data } = await API.post("/payment/create-order", {
        amount: total,
        bookingId: bookingId,
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
              bookingId: bookingId,
            });

            toast.success("Payment Successful & Booking Confirmed");
            navigate("/my-bookings");
          } catch (err) {
            console.log(err.response?.data || err.message);

            // PAYMENT VERIFY FAIL → redirect with booking visible
            navigate("/my-bookings");
          }
        },

        modal: {
          ondismiss: async function () {
            //  USER CLOSED PAYMENT
            navigate("/my-bookings");
          },
        },

        prefill: {
          name: "User",
          email: "user@email.com",
        },

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Already Booked");
    }
  };

  if (!car) return <p className="text-white">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white pt-24 px-6 grid md:grid-cols-2 gap-12">
        {/*  CAR DETAILS */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          {/*  IMAGE FIX */}
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-80 object-cover rounded-2xl mb-6"
          />

          {/* TITLE FIX */}
          <h2 className="text-3xl font-bold mb-1">{car.name}</h2>

          <p className="text-gray-400 text-lg mb-4">{car.brand}</p>

          {/* DETAILS */}
          <div className="flex gap-6 text-sm text-gray-300 mb-5">
            <span className="flex gap-2">
              <Car /> {car.type}
            </span>
            <span className="flex gap-2">
              <FuelIcon /> {car.fuelType}
            </span>
            <span className="flex gap-2">
              <UsersIcon /> {car.seatingCapacity}
            </span>
          </div>

          <p className="text-2xl font-semibold">₹{car.pricePerDay}/day</p>
        </div>

        {/* BOOKING FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Book This Car </h2>

          <div className="space-y-5">
            <div className="relative">
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                className="date-input w-full p-3 rounded-lg bg-black border border-gray-600 text-white"
              />
              <span
                onClick={() =>
                  document.querySelector('input[name="fromDate"]').showPicker()
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
              >
                <Calendar />
              </span>
            </div>

            <div className="relative">
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                className="date-input  w-full p-3 rounded-lg bg-black border border-gray-600 text-white"
              />
              <span
                onClick={() =>
                  document.querySelector('input[name="toDate"]').showPicker()
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
              >
                <Calendar />
              </span>
            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black border border-gray-600"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black border border-gray-600"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black border border-gray-600"
            />

            {/*  TOTAL */}
            <div className="text-2xl font-bold mt-4">Total: ₹{total}</div>

            <button
              onClick={handleBooking}
              className="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingPage;
