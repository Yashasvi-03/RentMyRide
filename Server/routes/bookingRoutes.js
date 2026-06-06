const {
    createBooking,
    getUserBookings,
    getAgencyBookings,
    cancelBooking,
    updateBookingStatus,
    getAllBookings,
    getAllUserBookings,
    checkAvailability
} = require("../controllers/bookingController");
const express = require("express");
const router = express.Router();
const authorizeRoles = require("../middleware/roleMiddleware");
const protect = require("../middleware/authMiddleware");

// Create
router.post("/create", protect, createBooking);
router.post("/check-availability", protect, checkAvailability);

// User history
router.get("/my", protect, getUserBookings);

// Agency bookings
router.get("/agency", protect, authorizeRoles("agency"), getAgencyBookings);

// Cancel booking
router.put("/cancel/:id", protect, cancelBooking);

// Agency update status
router.put("/status/:id", protect, authorizeRoles("agency"), updateBookingStatus);


// Admin-All Bookings
router.get("/",protect,authorizeRoles("admin"),getAllUserBookings)
module.exports = router;