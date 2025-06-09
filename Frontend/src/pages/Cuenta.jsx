import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPerfil } from "../services/userService";
import { Link } from "react-router-dom";
import {
  IconUserCircle,
} from "@tabler/icons-react";

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
    <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
      {/* Info básica del usuario */}
      <section className="max-w-7xl mx-auto text-center pt-16">
        <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-white/20 mx-auto mb-4 flex items-center justify-center shadow-lg">
          <IconUserCircle size={80} className="text-acento" />
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold text-texto">
          {perfil?.nombre || "Usuario"}
        </h2>
        <p className="text-white/60 mt-1">{usuario.email}</p>
        <p className="text-sm text-white/40 mt-2">
          Perfil de usuario de Red-Fi
        </p>
      </section>

      {/* Acciones */}
      <section className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gestionar Boletas */}
        <Link
          to="/boletas"
          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition"
        >
          <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
            Gestionar Boletas de Servicio
          </h3>
          <p>
            Visualizá y administrá tus boletas, recibí alertas antes del vencimiento y revisá los aumentos mes a mes.
          </p>
        </Link>

                {/* Red-Fi Academy */}
        <Link to="/academy">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center hover:bg-acento/30 transition">
            <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
              Red-Fi Academy
            </h3>
            <p>
              Accedé a nuestros mini cursos sobre redes, Wi-Fi y cómo mejorar tu conexión.
            </p>
          </div>
        </Link>

        {/* Ver Reseñas */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center opacity-70 cursor-not-allowed">
          <h3 className="text-xl lg:text-2xl font-bold text-texto mb-2">
            Ver Reseñas
          </h3>
          <p>
            Esta sección estará disponible próximamente. Aquí verás tus reseñas publicadas y su estado.
          </p>
        </div>


      </section>
    </div>
  );
};

export default Cuenta;
