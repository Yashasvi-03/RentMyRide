const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, resetURL) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);



  await transporter.sendMail({
    from: `"RentMyRide" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset password",
    // text,
    html: `
  <div style="font-family: Arial, sans-serif;">
    <h2>Reset Your Password</h2>
    

    <a href="${resetURL}" >${resetURL}
       
    </a>

    
  </div>
`
  });
};
const sendApprovalEmail = async (to, subject, resetURL) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);



  await transporter.sendMail({
    from: `"RentMyRide" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Agency Approved",
    // text,
    html: `
  <div style="font-family: Arial, sans-serif;">
    <h1>Welcome to RentMyRide</h1>
    
    

    <a href="${resetURL}" >${resetURL}
       
    </a>

    
  </div>
`
  });
};


const sendRefundEmail = async (to, amount) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"RentMyRide" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Refund Processed",
    html: `
      <h2>Refund Successful </h2>
      <p>Your booking has been cancelled.</p>
      <p><b>Refund Amount:</b> ₹${amount}</p>
      <p>Amount will reflect in 5-7 working days.</p>
    `,
  });
};


// const sendMessageMail = async ({ name, email, message }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, 
//       },
//     });

//     const mailOptions = {
//       from: email,
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Contact Message from ${name}`,
//       html: `
//         <h2>New Message from RentMyRide</h2>
//         <p><b>Name:</b> ${name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Message:</b> ${message}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.log("Mail Error:", error);
//     return false;
//   }
// };



// const sendMessageMail = async ({ name, email, message }) => {
//   try {


//     if(!process.env.ADMIN_EMAIL){
//       console.log("ADMIN EMAIL missing in .env");

//     }
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"RentMyRide" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Contact Message from ${name}`,
//       replyTo:email,
//       html: `
//         <h2>New Message from RentMyRide</h2>
//         <p><b>Name:</b> ${name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Message:</b> ${message}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.log("Mail Error:", error);
//     return false;
//   }
// };






const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  USER → ADMIN
const sendMessageMail = async ({ name, email, message }) => {
  try {
    await transporter.sendMail({
      from: `"RentMyRide" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Message from ${name}`,
      replyTo: email,
      html: `<p>${message}</p>`,
    });
    return true;
  } catch {
    return false;
  }
};

//  ADMIN → USER
const sendReplyMail = async (to, reply) => {
  try {
    await transporter.sendMail({
      from: `"RentMyRide Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reply from RentMyRide",
      html: `<p>${reply}</p>`,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};




module.exports = { sendEmail, sendRefundEmail, sendApprovalEmail, sendMessageMail, sendReplyMail };
