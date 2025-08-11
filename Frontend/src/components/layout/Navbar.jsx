import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../icons/logotipo/imagotipo";
import {
  IconX,
  IconBell,
  IconBellFilled,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { obtenerNotificacionesBoletas } from "../../services/boletas/notificaciones";
import MainButton from "../ui/MainButton";
import MainLinkButton from "../ui/MainLinkButton";
import { logoutUser } from "../../services/authService";

export const useNotificaciones = () => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = async () => {
    if (!usuario) return;
    const alertas = await obtenerNotificacionesBoletas(usuario.id);
    setNotificaciones(alertas);
  };

  useEffect(() => {
    cargarNotificaciones();
    const handler = () => cargarNotificaciones();

    window.addEventListener("nueva-boleta", handler);
    return () => window.removeEventListener("nueva-boleta", handler);
  }, [usuario]);

  return { notificaciones, setNotificaciones, cargarNotificaciones };
};

const Navbar = () => {
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const { usuario } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();
  const { currentTheme, availableThemes, changeTheme, themeData } = useTheme();
  const location = useLocation();
  const esVistaMapa = location.pathname === "/mapa";

  // Función para obtener el color principal del logo según el tema
  const getLogoColorPrincipal = () => {
    if (currentTheme === "light") {
      return "#1f2a40"; // Secundario del tema dark
    }
    return themeData?.texto || "#FFFFFF";
  };

  const getThemeIcon = () => {
    return currentTheme === "light" ? IconSun : IconMoon;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:block px-4 py-4 ${
          currentTheme === "light"
            ? "bg-fondo shadow-lg border-b border-texto/15"
            : "bg-fondo shadow-lg border-b border-texto/15"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <Link to="/" className="flex items-center gap-2">
            <Logo
              className="h-10"
              colorPrincipal={getLogoColorPrincipal()}
              colorAcento={themeData?.acento || "#FB8531"}
            />
          </Link>

          <div className="flex items-center space-x-4">
            {/* Navigation Links usando MainLinkButton */}
            <MainLinkButton to="/" variant="navbar" className="!px-4 !py-2">
              Inicio
            </MainLinkButton>
            <MainLinkButton to="/mapa" variant="navbar" className="!px-4 !py-2">
              Mapa
            </MainLinkButton>
            <MainLinkButton
              to="/herramientas"
              variant="navbar"
              className="!px-4 !py-2"
            >
              Herramientas
            </MainLinkButton>
            <MainLinkButton
              to="/soporte"
              variant="navbar"
              className="!px-4 !py-2"
            >
              Soporte
            </MainLinkButton>

            {/* Botón de tema - siempre visible */}
            <div className="relative">
              <MainButton
                onClick={() => setMostrarTemas(!mostrarTemas)}
                variant="secondary"
                className="!bg-transparent hover:text-acento"
                icon={getThemeIcon()}
                iconSize={26}
                title="Cambiar tema"
              />

              {mostrarTemas && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 p-2 space-y-1 ${
                    currentTheme === "light"
                      ? "bg-fondo border border-texto/15 text-texto"
                      : "bg-fondo text-texto border border-texto/15"
                  }`}
                >
                  {availableThemes.map((theme) => (
                    <MainButton
                      key={theme}
                      onClick={() => {
                        changeTheme(theme);
                        setMostrarTemas(false);
                      }}
                      variant={currentTheme === theme ? "primary" : "secondary"}
                      className={`w-full !justify-start ${
                        currentTheme === theme ? "!bg-primario !text-white" : ""
                      }`}
                    >
                      <span className="capitalize font-bold">{theme}</span>
                    </MainButton>
                  ))}
                </div>
              )}
            </div>

            {!usuario ? (
              <MainLinkButton
                to="/login"
                variant="accent"
                className="px-3 py-1 hover:scale-105"
              >
                Iniciar sesión
              </MainLinkButton>
            ) : (
              <>
                <MainLinkButton
                  to="/cuenta"
                  variant="navbar"
                  className="!px-4 !py-2"
                >
                  Perfil
                </MainLinkButton>
                <div className="relative">
                  <MainButton
                    onClick={() => setMostrarNotis(!mostrarNotis)}
                    variant="secondary"
                    className={`relative !bg-transparent hover:text-acento ${
                      notificaciones.length > 0 ? "animate-bounce" : ""
                    }`}
                    icon={
                      notificaciones.length > 0
                        ? () => (
                            <IconBellFilled size={26} className="text-acento" />
                          )
                        : IconBell
                    }
                    iconSize={26}
                    title="Notificaciones"
                  >
                    {notificaciones.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                        {notificaciones.length}
                      </span>
                    )}
                  </MainButton>

                  {mostrarNotis && (
                    <div
                      className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50 p-4 space-y-2 ${
                        currentTheme === "light"
                          ? "bg-fondo text-texto border border-texto/15 "
                          : "bg-fondo text-texto border border-texto/15"
                      }`}
                    >
                      {notificaciones.length === 0 ? (
                        <p className="italic text-center">
                          No hay notificaciones
                        </p>
                      ) : (
                        notificaciones.map((msg, i) => (
                          <div
                            key={i}
                            className={`border-b pb-2 last:border-b-0 flex justify-between items-start gap-2 ${
                              currentTheme === "light"
                                ? "border-texto/15"
                                : "border-texto/15"
                            }`}
                          >
                            <span className="break-words">{msg}</span>
                            <MainButton
                              onClick={() =>
                                setNotificaciones((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                )
                              }
                              variant="cross"
                              title="Cerrar"
                              icon={IconX}
                              iconSize={20}
                              className="leading-none p-0"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <MainButton
                  onClick={async () => {
                    await logoutUser();
                  }}
                  variant="danger"
                  className="px-3 py-1 hover:scale-105"
                >
                  Cerrar sesión
                </MainButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Solo Logo */}
      {!esVistaMapa && (
        <nav
          className={`lg:hidden px-4 py-4 ${
            currentTheme === "light"
              ? "bg-fondo shadow-lg border-b border-texto/15"
              : "bg-fondo shadow-lg border-b border-texto/15"
          }`}
        >
          <div className="flex justify-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo
                className="h-8"
                colorPrincipal={getLogoColorPrincipal()}
                colorAcento={themeData?.acento || "#FB8531"}
              />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
