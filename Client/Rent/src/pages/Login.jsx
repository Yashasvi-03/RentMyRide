import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      console.log("Full Response:", res.data);

      //  TOKEN
      localStorage.setItem("token", res.data.token);

      // USER STORE
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        }),
      );

      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(user));
      // localStorage.setItem(`user_${user.role}`, JSON.stringify(user));
      // localStorage.setItem(`token_${user.role}`, token);

      toast.success("Login Successful ");

      const role = res.data.role;

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "agency") {
        navigate("/agency/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log("Login Error:", err.response?.data);

      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-3 rounded bg-white/20 outline-none"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 rounded bg-white/20 outline-none"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={handleLogin}
        className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600 transition"
      >
        Login
      </button>

      <p className="text-sm mt-4 text-center">
        Forgot Password?{" "}
        <Link to="/forgot-password" className="text-blue-300">
          Click here
        </Link>
      </p>

      <p className="text-sm mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-300">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
