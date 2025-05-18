import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../icons/logotipo/imagotipo";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuario, logout } = useAuth();
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const linkClase = "hover:text-acento transition";

  return (
    <nav className="bg-fondo px-4 py-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8" colorPrincipal="#FFFFFF" colorAcento="#FB8531" />
        </Link>

        <button onClick={toggleMenu} className="lg:hidden text-texto">
          ☰
        </button>

        <div className={`flex-col lg:flex lg:flex-row lg:items-center gap-4 lg:gap-6 ${menuAbierto ? "flex" : "hidden"}`}>
          <Link to="/" className={linkClase}>Inicio</Link>
          <Link to="/mapa" className={linkClase}>Mapa</Link>
          <Link to="/herramientas" className={linkClase}>Herramientas</Link>
          <Link to="/soporte" className={linkClase}>Soporte</Link>

          {!usuario ? (
            <>
              <Link to="/login" className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition">Login</Link>
              <Link to="/register" className="border border-white px-3 py-1 rounded hover:bg-white hover:text-primario transition">Registro</Link>
            </>
          ) : (
            <>
              <Link to="/cuenta" className={linkClase}>Mi Cuenta</Link>
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
