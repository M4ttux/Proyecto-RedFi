import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";

const Layout = () => {
  return (
    <AuthProvider>
      <div className="bg-fondo text-texto min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
