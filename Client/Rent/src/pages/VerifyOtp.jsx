import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    await API.post("/auth/verify-otp", { email, otp });
    toast.success("OTP verified");
    navigate("/reset-password");
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyOTP;
