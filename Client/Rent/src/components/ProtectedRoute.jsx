import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  let user = null;
  const token = localStorage.getItem("token");

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    user = null;
  }

  //  Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  // Allowed
  return children;
}

export default ProtectedRoute;
