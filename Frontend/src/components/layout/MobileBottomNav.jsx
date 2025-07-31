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
import { useNotificaciones } from "./Navbar";
import MainButton from "../ui/MainButton";
import MainLinkButton from "../ui/MainLinkButton";
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
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[9999] safe-area-inset-bottom ${
          currentTheme === "light"
            ? "bg-fondo border-t border-texto/15 shadow-lg"
            : "bg-fondo border-t border-texto/15 shadow-lg"
        }`}
      >
        <div className="flex justify-around items-center py-3 px-2">
          {/* Main Navigation Items usando MainLinkButton */}
          {mainNavigationItems.map(({ path, label, icon: Icon }) => (
            <MainLinkButton
              key={path}
              to={path}
              variant="navbarIcon"
              className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent ${
                isActive(path)
                  ? "!text-acento !scale-110"
                  : currentTheme === "light"
                  ? "!text-texto"
                  : "!text-texto"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </MainLinkButton>
          ))}

          {/* More Menu Button usando MainButton */}
          <div className="relative">
            <MainButton
              onClick={() => setMostrarMenu(!mostrarMenu)}
              variant="secondary"
              className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent ${
                currentTheme === "light" ? "!text-texto" : "!text-texto"
              }`}
              icon={IconDots}
              iconSize={22}
            >
              <span className="text-xs mt-1 font-medium">Más</span>
            </MainButton>

            {/* More Menu Dropdown */}
            {mostrarMenu && (
              <div
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-lg shadow-lg z-50 py-2 ${
                  currentTheme === "light"
                    ? "bg-fondo border border-texto/15 text-texto"
                    : "bg-fondo text-texto border border-texto/15"
                }`}
              >
                {/* Soporte usando MainLinkButton */}
                <MainLinkButton
                  to="/soporte"
                  onClick={() => setMostrarMenu(false)}
                  variant="navbar"
                  className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                    isActive("/soporte") ? "!text-acento" : ""
                  }`}
                >
                  <IconHeadset size={20} />
                  <span>Soporte</span>
                </MainLinkButton>

                {/* Cambiar tema usando MainButton */}
                <MainButton
                  onClick={() => {
                    toggleTheme();
                    setMostrarMenu(false);
                  }}
                  variant="secondary"
                  className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                    currentTheme === "light"
                      ? "!bg-transparent !text-texto"
                      : "!bg-transparent !text-texto"
                  }`}
                  icon={currentTheme === "light" ? IconSun : IconMoon}
                  iconSize={20}
                >
                  <span>Cambiar tema</span>
                </MainButton>

                {usuario && (
                  <>
                    {/* Perfil usando MainLinkButton */}
                    <MainLinkButton
                      to="/cuenta"
                      onClick={() => setMostrarMenu(false)}
                      variant="navbar"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        isActive("/cuenta") ? "!text-acento" : ""
                      }`}
                    >
                      <IconUser size={20} />
                      <span>Perfil</span>
                    </MainLinkButton>

                    {/* Cerrar sesión usando MainButton */}
                    <MainButton
                      onClick={async () => {
                        await logoutUser();
                        setMostrarMenu(false);
                      }}
                      variant="danger"
                      className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                        currentTheme === "light"
                          ? "!bg-transparent !text-red-600"
                          : "!bg-transparent !text-red-400"
                      }`}
                      icon={IconLogout}
                      iconSize={20}
                    >
                      <span>Cerrar sesión</span>
                    </MainButton>
                  </>
                )}

                {!usuario && (
                  /* Login usando MainLinkButton */
                  <MainLinkButton
                    to="/login"
                    onClick={() => setMostrarMenu(false)}
                    variant="accent"
                    className={`w-full !justify-start !px-4 !py-3 !rounded-none ${
                      currentTheme === "light"
                        ? "!bg-transparent !text-orange-600"
                        : "!bg-transparent !text-acento"
                    }`}
                  >
                    <IconUser size={20} />
                    <span>Login</span>
                  </MainLinkButton>
                )}
              </div>
            )}
          </div>

          {/* Notifications Icon for Mobile usando MainButton */}
          {usuario && (
            <div className="relative">
              <MainButton
                onClick={() => setMostrarNotis(!mostrarNotis)}
                variant="secondary"
                className={`flex flex-col items-center py-1 px-2 min-w-[60px] !bg-transparent ${
                  notificaciones.length > 0
                    ? "!text-acento animate-bounce"
                    : currentTheme === "light"
                    ? "!text-texto"
                    : "!text-texto"
                }`}
                icon={notificaciones.length > 0 ? IconBellFilled : IconBell}
                iconSize={22}
              >
                <span className="text-xs mt-1 font-medium">Alertas</span>
                {notificaciones.length > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-texto text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                    {notificaciones.length}
                  </span>
                )}
              </MainButton>

              {/* Mobile Notifications Dropdown */}
              {mostrarNotis && (
                <div
                  className={`absolute bottom-full right-0 mb-2 w-72 rounded-lg shadow-lg p-4 space-y-2 ${
                    currentTheme === "light"
                      ? "bg-fondo border border-texto/15 text-texto"
                      : "bg-fondo text-texto border border-texto/15"
                  }`}
                >
                  {notificaciones.length === 0 ? (
                    <p className="italic text-center">Sin notificaciones</p>
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
          )}
        </div>
      </nav>

      {/* Mobile Bottom Padding to prevent content overlap */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default MobileBottomNav;
