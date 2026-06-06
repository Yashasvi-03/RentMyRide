const Booking = require("../models/Booking");
const Car = require("../models/Car");
const { sendRefundEmail } = require("../utils/sendEmail");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
//  Create Booking
exports.createBooking = async (req, res) => {
    try {

        const { carId, fromDate, toDate, address, city, pincode } = req.body;
        if (!carId || !fromDate || !toDate || !address) {
            return res.status(400).json({ message: "Missing booking details" });
        }
        //  Check car exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        //  CHECK DOUBLE BOOKING
        const existingBooking = await Booking.findOne({
            car: carId,
            status: {
                $in: ["pending", "confirmed"]
            },
            $or: [
                {
                    fromDate: { $lte: new Date(toDate) },
                    toDate: { $gte: new Date(fromDate) },
                },
            ],
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "Car already booked for selected dates",
            });
        }

        //  Calculate total days
        const days =
            (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) + 1;

        const totalAmount = days * car.pricePerDay;

        const booking = await Booking.create({
            user: req.user._id,
            car: carId,
            fromDate,
            toDate,
            totalAmount,
            address,
            city,
            pincode,
            status: "pending",
            paymentStatus: "pending",
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkAvailability = async (req, res) => {
    try {
        const { carId, fromDate, toDate } = req.body;

        const existingBooking = await Booking.findOne({
            car: carId,
            status: { $ne: "cancelled" },
            $or: [
                {
                    fromDate: { $lte: toDate },
                    toDate: { $gte: fromDate },
                },
            ],
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "Car already booked for selected dates",
            });
        }

        res.json({ message: "Available" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};







// Get User Bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("car");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//  Admin - Get ALL Users Bookings
exports.getAllUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("car", "name");

        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//  Get Agency Bookings
exports.getAgencyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: "car",
                match: { agency: req.user._id },
            })
            .populate("user", "name email");

        // filter only valid bookings
        const filtered = bookings.filter(b => b.car !== null);

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Cancel Booking (User)
// exports.cancelBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id);

//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         // Only owner can cancel
//         if (booking.user.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         booking.status = "cancelled";
//         await booking.save();

//         res.json({ message: "Booking cancelled" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// exports.cancelBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id).populate("user");

//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         if (booking.user._id.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         if (booking.status === "cancelled") {
//             return res.status(400).json({ message: "Already cancelled" });
//         }

//         // 📅 DAYS CALCULATION
//         const bookingDate = new Date(booking.createdAt);
//         const now = new Date();

//         const diffDays = Math.floor(
//             (now - bookingDate) / (1000 * 60 * 60 * 24)
//         );

//         let refundAmount = 0;

//         // 🎯 RULE
//         if (diffDays <= 3) {
//             refundAmount = booking.totalAmount; // FULL REFUND
//         } else {
//             refundAmount = booking.totalAmount * 0.8; // 20% CUT
//         }

//         // 💳 RAZORPAY REFUND
//         if (booking.razorpayPaymentId) {
//             await razorpay.payments.refund(booking.razorpayPaymentId, {
//                 amount: refundAmount * 100, // paisa convert
//             });
//         }

//         // 🔄 UPDATE
//         booking.status = "cancelled";
//         booking.refundAmount = refundAmount;
//         booking.isRefunded = true;
//         booking.paymentStatus = "refunded";

//         await booking.save();

//         // 📧 EMAIL
//         await sendRefundEmail(booking.user.email, refundAmount);

//         res.json({
//             message: "Booking cancelled & refund done",
//             refundAmount,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// };



// exports.cancelBooking = async (req, res) => {
//     try {

//         console.log("Cancel APi Hit");

//         const booking = await Booking.findById(req.params.id).populate("user");

//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         if (booking.user._id.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         if (booking.status === "cancelled") {
//             return res.status(400).json({ message: "Already cancelled" });
//         }

//         // 📅 DAYS LOGIC
//         const bookingDate = new Date(booking.createdAt);
//         const now = new Date();

//         const diffDays = Math.floor(
//             (now - bookingDate) / (1000 * 60 * 60 * 24)
//         );

//         let refundAmount = 0;

//         if (diffDays <= 3) {
//             refundAmount = booking.totalAmount;
//         } else {
//             refundAmount = booking.totalAmount * 0.8;
//         }

//         // 💳 REFUND
//         if (booking.razorpayPaymentId) {
//             await razorpay.payments.refund(booking.razorpayPaymentId, {
//                 amount: refundAmount * 100,
//             });
//         }

//         booking.status = "cancelled";
//         booking.paymentStatus = "refunded";
//         booking.refundAmount = refundAmount;
//         booking.isRefunded = true;

//         await booking.save();

//         res.json({
//             message: "Booking cancelled & refund processed",
//             refundAmount,
//         });
//         // 📧 EMAIL
//         await sendRefundEmail(booking.user.email, refundAmount);



//     } catch (error) {
//         console.log("Cancel Error:", error.message);

//         res.status(500).json({ message: error.message });
//     }
// };


exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("user");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({ message: "Already cancelled" });
        }

        //  NEW CONDITION (IMPORTANT)
        if (booking.paymentStatus !== "paid") {
            booking.status = "cancelled";
            await booking.save();

            return res.json({
                message: "Booking cancelled (No payment done, so no refund)",
                refundAmount: 0,
            });
        }

        //  DAYS LOGIC
        const bookingDate = new Date(booking.createdAt);
        const now = new Date();

        const diffDays = Math.floor(
            (now - bookingDate) / (1000 * 60 * 60 * 24)
        );

        let refundAmount = 0;

        if (diffDays <= 3) {
            refundAmount = booking.totalAmount;
        } else {
            refundAmount = booking.totalAmount * 0.8;
        }

        // REFUND ONLY IF PAID
        if (booking.razorpayPaymentId) {
            await razorpay.payments.refund(booking.razorpayPaymentId, {
                amount: refundAmount * 100,
            });
            console.log(booking.razorpayPaymentId);

        }

        booking.status = "cancelled";
        booking.paymentStatus = "refunded";
        booking.refundAmount = refundAmount;
        booking.isRefunded = true;

        await booking.save();

        res.json({
            message: "Booking cancelled & refund processed",
            refundAmount,
        });

        //  EMAIL
        sendRefundEmail(booking.user.email, refundAmount);

    } catch (error) {
        console.log("Cancel Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


//  Update Booking Status (Agency)
exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("car");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Only agency of that car
        if (booking.car.agency.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        booking.status = req.body.status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user", "name").populate("car", "name")
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}









