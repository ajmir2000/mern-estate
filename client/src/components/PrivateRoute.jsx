import { useSelector } from "react-redux";
//outlet use child from PrivateRoute and useNavigate is a hook but Navigate is a component
import { Outlet, Navigate } from "react-router-dom";
export default function PrivateRoute() {
    // if there is a current user, render the child component (Outlet) === Profile component, otherwise navigate to sign-in page
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
