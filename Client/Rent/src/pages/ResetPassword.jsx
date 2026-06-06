

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleReset = async () => {
    await API.post("/auth/reset-password", {
      email,
      otp,
      newPassword: password,
    });

    toast.success("Password updated!");
    navigate("/auth/login")
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <input
        placeholder="New Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
