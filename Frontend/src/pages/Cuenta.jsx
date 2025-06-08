import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPerfil } from "../services/userService";
import { Link } from "react-router-dom";
import { IconUserCircle, IconMail, IconId, IconLogout } from "@tabler/icons-react";

const Cuenta = () => {
  useEffect(() => {
    document.title = "Red-Fi | Mi Perfil";
  }, []);

  const { usuario, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (usuario) cargarPerfil();
  }, [usuario]);

  if (!usuario) {
    return (
      <p className="text-center mt-10 text-texto">No has iniciado sesión.</p>
    );
  }

  if (loading) {
    return <p className="text-center mt-10 text-texto">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-secundario text-texto rounded-lg shadow-lg space-y-6">
      <div className="text-center">
        <IconUserCircle size={64} className="mx-auto text-acento" />
        <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-acento">
          ¡Hola, {perfil?.nombre || "Usuario"}!
        </h2>
        <p className="text-white/70">Bienvenido a tu panel de usuario</p>
      </div>

      <div className="space-y-3 text-lg">
        <p className="flex items-center gap-2">
          <IconMail className="text-acento" /> <strong>Email:</strong> {usuario.email}
        </p>
        <p className="flex items-center gap-2">
          <IconId className="text-acento" /> <strong>Nombre:</strong> {perfil?.nombre || "Sin nombre definido"}
        </p>
      </div>

      <div className="space-y-3">
        <Link
          to="/boletas"
          className="block w-full text-center bg-white text-primario font-semibold px-4 py-2 rounded hover:bg-acento hover:text-white transition"
        >
          Gestionar Boletas de Servicio
        </Link>
        <button
          onClick={logout}
          className="w-full bg-primario text-texto px-4 py-2 rounded hover:bg-acento font-semibold flex items-center justify-center gap-2"
        >
          <IconLogout /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Cuenta;
