import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../icons/logotipo/imagotipo";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuario, logout } = useAuth();
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const linkClase = "hover:text-acento transition px-4 py-2 font-bold";

  return (
    <nav className="bg-fondo px-4 py-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo
            className="h-10"
            colorPrincipal="#FFFFFF"
            colorAcento="#FB8531"
          />
        </Link>

        <button onClick={toggleMenu} className="lg:hidden text-texto">
          ☰
        </button>

        {/* Links escritorio */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Link to="/" className={linkClase}>
            Inicio
          </Link>
          <Link to="/mapa" className={linkClase}>
            Mapa
          </Link>
          <Link to="/herramientas" className={linkClase}>
            Herramientas
          </Link>
          <Link to="/soporte" className={linkClase}>
            Soporte
          </Link>
          {!usuario ? (
            <>
              <Link
                to="/login"
                className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer"
              >
                Registro
              </Link>
            </>
          ) : (
            <>
              <Link to="/cuenta" className={linkClase}>
                Mi Cuenta
              </Link>
              <button
                onClick={logout}
                className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Links mobile */}
      {menuAbierto && (
        <div className="flex flex-col items-start mt-4 space-y-2 lg:hidden">
          <Link to="/" className={linkClase}>
            Inicio
          </Link>
          <Link to="/mapa" className={linkClase}>
            Mapa
          </Link>
          <Link to="/herramientas" className={linkClase}>
            Herramientas
          </Link>
          <Link to="/soporte" className={linkClase}>
            Soporte
          </Link>
          {!usuario ? (
            <>
              <Link
                to="/login"
                className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition font-bold cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition font-bold cursor-pointer"
              >
                Registro
              </Link>
            </>
          ) : (
            <>
              <Link to="/cuenta" className={linkClase}>
                Mi Cuenta
              </Link>
              <button
                onClick={logout}
                className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
