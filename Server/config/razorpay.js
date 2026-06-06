const Razorpay = require("razorpay");

const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KET,
    key_secret:process.env.RAZORPAY_SECRET,
})
module.exports=razorpay;