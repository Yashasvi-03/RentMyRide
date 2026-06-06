import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CarsPage from "./pages/CarPage";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminRoute from "./pages/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminCars from "./pages/admin/AdminCars";
import AdminAgencies from "./pages/admin/AdminAgencies";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AgencyRoute from "./pages/agency/AgencyRoute";
import AgencyDashboard from "./pages/agency/AgencyDashboard";
import AgencyBookings from "./pages/agency/AgencyBookings";
import AgencyCars from "./pages/agency/AgencyCars";
import About from "./pages/About";
import AgencyProfile from "./pages/agency/AgencyProfile";
import Contact from "./pages/Contact";
import { useEffect, useState } from "react";
import AdminMessages from "./pages/admin/AdminMessages";
// import { setLoaderHandler } from "../api";
import GlobalLoader from "./components/GlobalLoader";
import { setLoaderHandler } from "./services/api";
import AdminProfile from "./pages/admin/AdminProfile";
// import { getUser } from "./services/authHelper";

function AppRoutes() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoaderHandler(setLoading);
    // setLoaderHandler(setLoading);
  }, []);
  return (
    <>
      <GlobalLoader loading={loading} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute allowedRoles={["admin"]}>
              <AdminDashboard />
              {/* <AdminLayout>
                
              </AdminLayout> */}
            </AdminRoute>
          }
        />

        <Route
          path="/admin/cars"
          element={
            <AdminRoute allowedRoles={["admin"]}>
              <AdminCars />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminBookings />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminMessages />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/agencies"
          element={
            <AdminRoute>
              <AdminAgencies />
            </AdminRoute>
          }
        />

        <Route
          path="/agency/dashboard"
          element={
            <AgencyRoute>
              <AgencyDashboard />
            </AgencyRoute>
          }
        />
        <Route
          path="/agency/profile"
          element={
            <AgencyRoute>
              <AgencyProfile />
            </AgencyRoute>
          }
        />
        <Route
          path="/agency/bookings"
          element={
            <AgencyRoute>
              <AgencyBookings />
            </AgencyRoute>
          }
        />
        <Route
          path="/agency/cars"
          element={
            <AgencyRoute>
              <AgencyCars />
            </AgencyRoute>
          }
        />
      </Routes>
    </>
  );
}

function AppWrapper() {
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "agency") {
          navigate("/agency/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, []);

  return <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
