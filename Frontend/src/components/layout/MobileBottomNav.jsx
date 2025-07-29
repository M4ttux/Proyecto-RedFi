import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  IconX,
  IconBell,
  IconBellFilled,
  IconHome,
  IconMap,
  IconTool,
  IconHeadset,
  IconUser,
  IconDots,
  IconLogout,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useNotificaciones } from "./NavbarV2";
import MainButton from "../ui/MainButton";
import { logoutUser } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";

const MobileBottomNav = () => {
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const { usuario } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();
  const location = useLocation();

  const { currentTheme, changeTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    changeTheme(nextTheme);
  };

  const mainNavigationItems = [
    { path: "/", label: "Inicio", icon: IconHome },
    { path: "/mapa", label: "Mapa", icon: IconMap },
    { path: "/herramientas", label: "Herramientas", icon: IconTool },
  ];

  const isActive = (path) => location.pathname === path;

  const getThemeIcon = () => {
    return currentTheme === "light" ? IconSun : IconMoon;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-fondo border-t border-texto/10 z-[9999] safe-area-inset-bottom">
        <div className="flex justify-around items-center py-3 px-2">
          {/* Main Navigation Items */}
          {mainNavigationItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-1 px-2 transition-colors min-w-[60px] ${
                isActive(path) ? "text-acento" : "text-texto"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}

          {/* More Menu Button */}
          <div className="relative">
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="flex flex-col items-center py-1 px-2 transition-colors min-w-[60px] text-texto"
            >
              <IconDots size={22} />
              <span className="text-xs mt-1 font-medium">Más</span>
            </button>

            {/* More Menu Dropdown */}
            {mostrarMenu && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-secundario text-texto rounded-lg shadow-lg z-50 py-2">
                <Link
                  to="/soporte"
                  onClick={() => setMostrarMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive("/soporte") ? "text-acento" : "text-texto"
                  }`}
                >
                  <IconHeadset size={20} />
                  <span>Soporte</span>
                </Link>

                {usuario && (
                  <>
                    <Link
                      to="/cuenta"
                      onClick={() => setMostrarMenu(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        isActive("/cuenta") ? "text-acento" : "text-texto"
                      }`}
                    >
                      <IconUser size={20} />
                      <span>Perfil</span>
                    </Link>

                    <button
                      onClick={async () => {
                        await logoutUser();
                        setMostrarMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 font-bold hover:bg-red-600 transition-colors text-red-400 w-full text-left"
                    >
                      <IconLogout size={20} />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                )}

                {!usuario && (
                  <Link
                    to="/login"
                    onClick={() => setMostrarMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 transition-colors font-bold text-acento"
                  >
                    <IconUser size={20} />
                    <span>Login</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    toggleTheme();
                    setMostrarMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors w-full text-left"
                >
                  {currentTheme === "light" ? (
                    <IconSun size={20} />
                  ) : (
                    <IconMoon size={20} />
                  )}
                  <span>Cambiar tema</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Icon for Mobile */}
          {usuario && (
            <div className="relative">
              <button
                onClick={() => setMostrarNotis(!mostrarNotis)}
                className={`flex flex-col items-center py-1 px-2 transition-colors min-w-[60px] ${
                  notificaciones.length > 0
                    ? "text-acento animate-bounce"
                    : "text-texto"
                }`}
              >
                {notificaciones.length > 0 ? (
                  <IconBellFilled size={22} />
                ) : (
                  <IconBell size={22} />
                )}
                <span className="text-xs mt-1 font-medium">Alertas</span>
                {notificaciones.length > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-texto text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                    {notificaciones.length}
                  </span>
                )}
              </button>

              {/* Mobile Notifications Dropdown */}
              {mostrarNotis && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-secundario text-texto rounded-lg shadow-lg p-4 space-y-2">
                  {notificaciones.length === 0 ? (
                    <p className="text-texto italic text-center">
                      Sin notificaciones
                    </p>
                  ) : (
                    notificaciones.map((msg, i) => (
                      <div
                        key={i}
                        className="border-b border-texto/10 pb-2 last:border-b-0 flex justify-between items-start gap-2"
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
          )}
        </div>
      </nav>

      {/* Mobile Bottom Padding to prevent content overlap */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default MobileBottomNav;
