

import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();

  // TIMER
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // SEND OTP
  const handleSendOTP = async () => {
    await API.post("/auth/forgot-password", { email });
    toast.success("OTP Sent ");
    setStep(2);
    setTimer(60);
  };

  // AUTO VERIFY
  useEffect(() => {
    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp]);

  const verifyOTP = async () => {
    try {
      await API.post("/auth/verify-otp", { email, otp });
      toast.success("OTP Verified ");
      setStep(3);
    } catch {
      toast.error("Invalid OTP ");
    }
  };

  // RESET PASSWORD
  const handleReset = async () => {
    await API.post("/auth/reset-password", {
      email,
      otp,
      newPassword: password,
    });

    toast.success("Password Updated ");
    navigate("/login");
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded bg-white/20"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSendOTP}
            className="w-full bg-blue-500 py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 mb-3 rounded bg-white/20 text-center tracking-widest"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />

          <p className="text-sm text-center">
            {timer > 0 ? `Resend in ${timer}s` : "Resend available"}
          </p>

          <button
            disabled={timer > 0}
            onClick={handleSendOTP}
            className="w-full mt-2 bg-gray-400 py-2 rounded"
          >
            Resend OTP
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 mb-4 rounded bg-white/20"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleReset}
            className="w-full bg-green-500 py-2 rounded"
          >
            Reset Password
          </button>
        </>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
