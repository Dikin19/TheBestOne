import { Outlet, useNavigate, Navigate } from "react-router";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

function AuthLayout() {

  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </motion.div>
  )
}

export default AuthLayout;
