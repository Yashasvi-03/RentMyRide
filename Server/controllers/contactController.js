// const { sendMessageMail } = require("../utils/sendEmail");

// const sendContactMessage = async (req, res) => {
//   try {
//     const { name, email, message } = req.body;

//     // validation
//     if (!name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const isSent = await sendMessageMail({ name, email, message });

//     if (!isSent) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send message",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Message sent successfully",
//     });
//   } catch (error) {
//     console.log("Controller Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// module.exports = { sendContactMessage };


const Contact = require("../models/Contact");
const { sendMessageMail } = require("../utils/sendEmail");

const sendContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //  SAVE IN DB
        await Contact.create({ name, email, message });

        // SEND MAIL
        await sendMessageMail({ name, email, message });

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });
    } catch (error) {
        console.log("Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = { sendContactMessage };