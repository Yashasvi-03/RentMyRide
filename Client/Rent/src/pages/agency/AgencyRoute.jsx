import { Navigate } from "react-router-dom";

function AgencyRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.role === "agency" ? children : <Navigate to="/" />;
}

export default AgencyRoute;
