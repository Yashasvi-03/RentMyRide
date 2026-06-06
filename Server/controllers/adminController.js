const User = require("../models/User");
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const { sendEmail, sendApprovalEmail } = require("../utils/sendEmail");

// Get all agencies
exports.getAllAgencies = async (req, res) => {
    try {
        const agencies = await User.find({ role: "agency" });
        res.json(agencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve agency
exports.approveAgency = async (req, res) => {
    console.log("API HII");

    try {
        const agency = await User.findById(req.params.id);

        if (!agency) {
            console.log("Agency not Found");

            return res.status(404).json({ message: "Agency not found" });
        }

        agency.isApproved = true;
        await agency.save();
        console.log("Approved successfully");
        await sendApprovalEmail(
            agency.email,
            "Account Approved",
            `<h2> Your Agency account is approved</h2>
            <p> You can now login to RentMyRide.</p>`

        );

        return res.json({ message: "Agency approved successfully & email sent" });
    } catch (error) {
        console.log("Error:", error.message);

        res.status(500).json({ message: error.message });
    }
};
// exports.getAllData = async (req, res) => {
//     try {
//         const users = await User.countDocuments();
//         const cars = await Car.countDocuments();
//         const bookingsCount = await Booking.countDocuments();

//         const bookings = await Booking.find().populate("car").populate("user");
//         console.log("bookings:",bookings);

//         //  TOTAL REVENUE
//         const revenue = bookings.reduce((total, booking) => {
//             return total + (booking.totalAmount || 0);
//         }, 0);

//         //  CHART DATA (DATE WISE)
//         const revenueByDate = {};

//         bookings.forEach((b) => {
//             const date = new Date(b.createdAt).toLocaleDateString();

//             if (!revenueByDate[date]) {
//                 revenueByDate[date] = 0;
//             }

//             revenueByDate[date] += b.totalAmount || 0;
//         });

//         const chartData = Object.keys(revenueByDate).map((date) => ({
//             date,
//             revenue: revenueByDate[date],
//         }));

//         // RESPONSE
//         res.json({
//             users,
//             cars,
//             bookings: bookingsCount,
//             revenue,
//             chartData, //  important for graph
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };




exports.getNotifications = async (req, res) => {
    try {
        const pendingAgencies = await User.countDocuments({
            role: "agency",
            isApproved: false,
        });

        const pendingCars = await Car.countDocuments({
            status: { $ne: "approved" },
        });

        res.json({
            pendingAgencies,
            pendingCars,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





exports.getAllData = async (req, res) => {
    try {
        const users = await User.countDocuments();
        const cars = await Car.countDocuments();

        const bookings = await Booking.find()
            .populate("car")
            .populate("user");

        //  TOTAL REVENUE
        const revenue = bookings.reduce((total, b) => {
            return total + (b.totalAmount || 0);
        }, 0);

        // FILTER
        const filter = req.query.filter || "weekly";

        const revenueMap = {};

        bookings.forEach((b) => {
            const date = new Date(b.createdAt);
            let key;

            if (filter === "monthly") {
                key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            } else {
                key = date.toLocaleDateString();
            }

            if (!revenueMap[key]) {
                revenueMap[key] = 0;
            }

            revenueMap[key] += b.totalAmount || 0;
        });

        const chartData = Object.keys(revenueMap).map((key) => ({
            date: key,
            revenue: revenueMap[key],
        }));

        //  TOP CARS
        const carRevenue = {};

        bookings.forEach((b) => {
            const carName = b.car?.name || "Unknown";

            if (!carRevenue[carName]) {
                carRevenue[carName] = 0;
            }

            carRevenue[carName] += b.totalAmount || 0;
        });

        const topCars = Object.entries(carRevenue)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        //  RECENT BOOKINGS
        const recentBookings = bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        //  FINAL RESPONSE 
        res.json({
            users,
            cars,
            bookings: bookings.length,
            revenue,
            chartData,
            topCars,
            recentBookings,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};





// GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  BLOCK / UNBLOCK 
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





const Contact = require("../models/Contact");
const { sendReplyMail } = require("../utils/sendEmail");

// GET ALL MESSAGES
exports.getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

// SEND REPLY



exports.replyToMessage = async (req, res) => {
  try {
    console.log("API HIT REPLY");
    
    const { reply } = req.body;
    console.log("Reply",reply);
    

    const msg = await Contact.findById(req.params.id);
    console.log(msg);
    

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    //  send mail
    const isSent = await sendReplyMail(msg.email, reply);

    if (!isSent) {
      return res.status(500).json({ message: "Email not sent" });
    }

    // msg.reply = reply;
    // msg.replied = true;
    const updated=await Contact.findByIdAndUpdate(req.params.id,{
        reply:reply,
        replied:true,
    },{new:true})
    console.log("Updated",updated);
    

    // await msg.save();

    res.json({ message: "Reply sent successfully" });
  } catch (err) {
    console.log("Reply Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


