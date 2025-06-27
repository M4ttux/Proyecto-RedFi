import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPerfil } from "../services/userService";
import { Link } from "react-router-dom";
import { IconUserCircle } from "@tabler/icons-react";

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
  const nombre = perfil?.nombre || "Usuario";
  const foto = perfil?.foto_url || usuario?.user_metadata?.foto_perfil;
  const iniciales = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
      {/* Info básica del usuario */}
      <section className="max-w-7xl mx-auto text-center pt-8">
        {foto ? (
          <img
            src={foto}
            alt="Foto de perfil"
            className="w-28 h-28 rounded-full object-cover border-4 border-white/20 mx-auto mb-4 shadow-lg"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-white/20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">{iniciales}</span>
          </div>
        )}

        <h2 className="text-2xl lg:text-3xl font-bold text-texto">{nombre}</h2>
        <p className="text-white/60 mt-1">{usuario.email}</p>
        <p className="text-sm text-white/40 mt-2">
          Usuario <span className="font-bold text-acento">Premium</span>
        </p>
      </section>

      {/* Acciones */}
      <section className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Gestionar Boletas */}
        <Link
          to="/boletas"
          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition"
        >
          <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
            Gestionar Boletas de Servicio
          </h3>
          <p>
            Visualizá y administrá tus boletas, recibí alertas antes del
            vencimiento y revisá los aumentos mes a mes.
          </p>
        </Link>

        {/* Red-Fi Academy */}
        <Link to="/academy">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition">
            <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
              Red-Fi Academy
            </h3>
            <p>
              Accedé a nuestros mini cursos sobre redes, Wi-Fi y cómo mejorar tu
              conexión.
            </p>
          </div>
        </Link>

        {/* Ver Reseñas */}
        <Link to="/resenas">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition">
            <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
              Mis Reseñas
            </h3>
            <p>
              Visualizá y administrá todas las reseñas que has publicado sobre
              diferentes proveedores.
            </p>
          </div>
        </Link>

        {/* Editar Perfil */}
        <Link
          to="/editar-perfil"
          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition"
        >
          <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
            Editar Perfil
          </h3>
          <p>Cambiá tu foto, nombre y otros datos de tu cuenta Red-Fi.</p>
        </Link>

        {/* Gestionar Plan */}
        <Link
          to="/planes"
          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition"
        >
          <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
            Gestionar Plan
          </h3>
          <p>Gestioná tu plan y descubrí nuestros beneficios.</p>
        </Link>
      </section>
    </div>
  );
};

export default Cuenta;
