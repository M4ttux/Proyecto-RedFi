import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../icons/logotipo/imagotipo";
import { IconX, IconMenu2 } from "@tabler/icons-react";
import { supabase } from "../supabase/client";

// ✅ Hook de notificaciones con evento personalizado
export const useNotificaciones = () => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = async () => {
    if (!usuario) return;

    const { data, error } = await supabase
      .from("boletas")
      .select("*")
      .eq("user_id", usuario.id);

    if (!error) {
      const hoy = new Date();
      const alertas = [];

      data.forEach((b) => {
        const vencimiento = new Date(b.vencimiento);
        const dias = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
        if (dias >= 0 && dias <= 3) {
          alertas.push(
            `📅 ${b.proveedor} vence en ${dias} día${dias === 1 ? "" : "s"}`
          );
        }
      });

      const ordenadas = [...data].sort(
        (a, b) => new Date(b.vencimiento) - new Date(a.vencimiento)
      );
      if (ordenadas.length >= 2) {
        const actual = parseFloat(ordenadas[0].monto);
        const anterior = parseFloat(ordenadas[1].monto);
        const diferencia = actual - anterior;
        if (diferencia > 0) {
          alertas.push(`⚠️ Subió $${diferencia.toFixed(2)} este mes`);
        }
      }

      setNotificaciones(alertas);
    }
  };

  useEffect(() => {
    cargarNotificaciones();

    const handler = () => {
      cargarNotificaciones();
    };

    // ✅ Se actualiza al escuchar el evento de nueva boleta
    window.addEventListener("nueva-boleta", handler);

    return () => {
      window.removeEventListener("nueva-boleta", handler);
    };
  }, [usuario]);

  return { notificaciones, setNotificaciones, cargarNotificaciones };
};

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const { usuario, logout } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const linkClase = "hover:text-acento transition px-4 py-2 font-bold";

  return (
    <nav className="bg-fondo px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-10" colorPrincipal="#FFFFFF" colorAcento="#FB8531" />
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="lg:hidden text-texto text-2xl transition-all"
          >
            {menuAbierto ? (
              <IconX size={28} className="text-acento" />
            ) : (
              <IconMenu2 size={28} />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Link to="/" className={linkClase}>Inicio</Link>
          <Link to="/mapa" className={linkClase}>Mapa</Link>
          <Link to="/herramientas" className={linkClase}>Herramientas</Link>
          <Link to="/soporte" className={linkClase}>Soporte</Link>

          {!usuario ? (
            <>
              <Link to="/login" className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer">Login</Link>
              <Link to="/register" className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer">Registro</Link>
            </>
          ) : (
            <>
              <Link to="/cuenta" className={linkClase}>Mi Cuenta</Link>
              <div className="relative ml-2">
                <button
                  onClick={() => setMostrarNotis(!mostrarNotis)}
                  className={`text-white text-xl relative ${notificaciones.length > 0 ? "animate-bounce" : ""}`}
                  title="Notificaciones"
                >
                  🔔
                  {notificaciones.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {notificaciones.length}
                    </span>
                  )}
                </button>

                {mostrarNotis && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded shadow-lg z-50 p-4 space-y-2">
                    {notificaciones.length === 0 ? (
                      <p className="text-gray-500 italic text-center">Sin notificaciones</p>
                    ) : (
                      notificaciones.map((msg, i) => (
                        <div
                          key={i}
                          className="border-b border-gray-200 pb-2 last:border-b-0 flex justify-between items-start gap-2"
                        >
                          <span className="break-words">{msg}</span>
                          <button
                            className="text-gray-500 hover:text-red-500 font-bold text-lg leading-none"
                            onClick={() =>
                              setNotificaciones((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            title="Cerrar"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>

      {menuAbierto && (
        <div className={`lg:hidden px-4 transition-all duration-300 ease-in-out overflow-hidden ${menuAbierto ? "max-h-[500px] opacity-100 scale-100 mt-4" : "max-h-0 opacity-0 scale-95"}`}>
          <div className="flex flex-col items-start space-y-2">
            <Link to="/" onClick={() => setMenuAbierto(false)} className={linkClase}>Inicio</Link>
            <Link to="/mapa" onClick={() => setMenuAbierto(false)} className={linkClase}>Mapa</Link>
            <Link to="/herramientas" onClick={() => setMenuAbierto(false)} className={linkClase}>Herramientas</Link>
            <Link to="/soporte" onClick={() => setMenuAbierto(false)} className={linkClase}>Soporte</Link>

            {!usuario ? (
              <div className="flex flex-row items-start gap-4">
                <Link to="/login" onClick={() => setMenuAbierto(false)} className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition font-bold cursor-pointer">Login</Link>
                <Link to="/register" onClick={() => setMenuAbierto(false)} className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition font-bold cursor-pointer">Registro</Link>
              </div>
            ) : (
              <>
                <Link to="/cuenta" onClick={() => setMenuAbierto(false)} className={linkClase}>Mi Cuenta</Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuAbierto(false);
                  }}
                  className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
