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
      <div className="bg-fondo text-texto min-h-screen flex flex-col overflow-x-hidden">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow">
          <Outlet />
        </main>
        {!esVistaMapa && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default Layout;
