import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    user = null;
  }

  return user?.role === "admin" ? children : <Navigate to="/login" />;
}

export default AdminRoute;
