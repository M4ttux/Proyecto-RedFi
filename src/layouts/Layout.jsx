import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const esVistaMapa = location.pathname === "/mapa";

  return (
    <AuthProvider>
      <header>
        <Navbar />
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
      {!esVistaMapa && <Footer />}
    </AuthProvider>
  );
};

export default Layout;
