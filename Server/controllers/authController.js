
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

//  Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

//  Register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, agencyName, address, contactNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            agencyName,
            address,
            contactNumber,
            isApproved: role === "agency" ? false : true
        });
        if(user.role==="agency"){
            return res.status(201).json({
                message:"Registerd successfully, Wait untill approval."
            })
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email & password" });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {

            // Agency approval check
            if (user.role === "agency" && !user.isApproved) {
                return res.status(403).json({ message: "Wait untill approval" });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),


            });

        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// export const forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     //  Generate token
//     const token = crypto.randomBytes(32).toString("hex");

//     user.resetToken = token;
//     user.resetTokenExpire = Date.now() + 10 * 60 * 1000; 

//     await user.save();

//     //  Reset URL
//     const resetURL = `http://localhost:5173/reset-password/${token}`

//     console.log("Reset Link:", resetURL); 

//     res.json({ message: "Reset link sent", resetURL });
// };



// exports.resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     const user = await User.findOne({
//         resetToken: token,
//         resetTokenExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//         return res.status(400).json({ message: "Token expired" });
//     }

//     user.password = password; 
//     user.resetToken = undefined;
//     user.resetTokenExpire = undefined;

//     await user.save();

//     res.json({ message: "Password reset successful" });
// };




// POST /auth/forgot-password

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    //  OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; 
    await user.save();

    await sendEmail(
        user.email,
        "OTP for Password Reset",
        `Your OTP is: ${otp}`
    );

    res.json({ message: "OTP sent to email" });
};



// POST /auth/verify-otp
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
        !user ||
        user.resetOTP !== otp ||
        user.otpExpire < Date.now()
    ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
};



exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (
        !user ||
        user.resetOTP !== otp ||
        user.otpExpire < Date.now()
    ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    // clear OTP
    user.resetOTP = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
};


// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     const token = crypto.randomBytes(32).toString("hex");

//     user.resetToken = token;
//     user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

//     await user.save();

//     const resetURL = `http://localhost:5173/reset-password/${token}`;

//     await sendEmail(
//         user.email,
//         "Reset Your Password",
//         `Click here: ${resetURL}`
//     );

//     res.json({ message: "Email sent successfully",resetURL });
// };
//  Get Profile




exports.getProfile = async (req, res) => {
    try {
        res.json(req.user); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.address = req.body.address || user.address;
        user.contactNumber = req.body.contactNumber || user.contactNumber;

        // Update password 
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();

        res.json({
            // message: "Profile updated",
            user,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};