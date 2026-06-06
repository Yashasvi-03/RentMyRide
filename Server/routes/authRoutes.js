const express = require("express");
const router = express.Router();
const { registerUser, loginUser, resetPassword, forgotPassword, verifyOTP } = require("../controllers/authController");
const { getProfile, updateProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp",verifyOTP)
router.post("/reset-password", resetPassword)

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);
module.exports = router;