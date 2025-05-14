/* import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Inicio" },
    { to: "/mapa", label: "Mapa" },
    { to: "/herramientas", label: "Herramientas" },
    { to: "/soporte", label: "Soporte" },
    { to: "/cuenta", label: "Cuenta" },
  ];

  return (
    <nav className="w-full bg-transparent text-white px-6 py-6 border-b border-white/10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold">
          Red-Fi
        </Link>

        <ul className="hidden md:flex gap-6 font-medium">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`transition-colors ${
                  location.pathname === item.to
                    ? "text-acento underline"
                    : "hover:text-acento"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuAbierto && (
        <div className="mt-4 md:hidden">
          <ul className="flex flex-col gap-3 font-medium">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block px-3 py-2 rounded hover:bg-secundario ${
                    location.pathname === item.to ? "text-acento underline" : ""
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Inicio" },
    { to: "/mapa", label: "Mapa" },
    { to: "/herramientas", label: "Herramientas" },
    { to: "/soporte", label: "Soporte" },
    { to: "/cuenta", label: "Cuenta" },
  ];

  return (
    <nav className="w-full bg-transparent text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primario">
          Red-Fi
        </Link>

        {/* Menú Desktop */}
        <ul className="hidden md:flex gap-6 font-medium">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`transition-colors ${
                  location.pathname === item.to
                    ? "text-acento underline"
                    : "hover:text-acento"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú Mobile */}
      {menuAbierto && (
        <div className="mt-4 md:hidden">
          <ul className="flex flex-col gap-2 font-medium">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMenuAbierto(false)}
                  className={`block px-3 py-2 hover:text-acento ${
                    location.pathname === item.to ? "text-acento underline" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
