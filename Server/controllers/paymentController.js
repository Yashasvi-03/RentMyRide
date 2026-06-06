const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const crypto = require("crypto")
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
// exports.createOrder = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         if (!amount) {
//             return res.status(400).json({ message: "Amount required" });
//         }
//         const options = {
//             amount: amount * 100, // convert to paise
//             currency: "INR",
//             receipt: "order_rcptid_" + Date.now(),
//         };

//         const order = await razorpay.orders.create(options);

//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.createOrder = async (req, res) => {
    try {
        console.log("BODY:",req.body);
        
        const { amount, bookingId } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        //  SAVE ORDER ID IN BOOKING
        await Booking.findByIdAndUpdate(bookingId, {
            razorpayOrderId: order.id,
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// exports.verifyPayment = async (req, res) => {
//     try {
//         const { bookingId } = req.body;


//         const booking = await Booking.findById(bookingId);
//         if (!booking) {
//             return res.status(404).json({ message: "Booking is not found" })
//         }
//         booking.paymentStatus = "paid";
//         booking.status = "confirmed";

//         await booking.save();

//         res.json({ message: "Payment successful & booking confirmed" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };





exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
        } = req.body;

        //  Signature generate
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        console.log("BODY:", req.body);

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        //  Invalid payment
        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }
        console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

        //  Payment valid → update booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.paymentStatus = "paid";
        booking.status = "confirmed";

        booking.razorpayPaymentId = razorpay_payment_id;

        await booking.save();

        res.json({ message: "Payment successful & booking confirmed" });

    } catch (error) {
        console.log("VERIFY ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
};