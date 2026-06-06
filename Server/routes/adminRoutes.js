const express = require("express");
const router = express.Router();

const { getAllAgencies, approveAgency, getAllData, getNotifications, getAllUsers, toggleUserStatus } = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

//Notification of Agency
router.get("/notifications", protect, authorizeRoles("admin"), getNotifications)
// Only Admin can access
router.get("/dashboard", protect, authorizeRoles("admin"), getAllData)
router.get("/agencies", protect, authorizeRoles("admin"), getAllAgencies);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveAgency);

//request message reply

const {
    getMessages,
    replyToMessage,
} = require("../controllers/adminController");

router.get("/messages", getMessages);
router.post("/reply/:id", replyToMessage);

module.exports = router;
//User
router.get("/users", protect, authorizeRoles("admin"), getAllUsers)
router.get("/users/:id", protect, authorizeRoles("admin"), toggleUserStatus)
module.exports = router;