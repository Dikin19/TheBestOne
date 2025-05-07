import { Outlet, useNavigate, Navigate } from "react-router";
import Navbar from "./Navbar";

function AuthLayout() {

  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" />;
  }


  return (
    <>

      <Navbar />

      <Outlet />

    </>
  )
}

export default AuthLayout;
