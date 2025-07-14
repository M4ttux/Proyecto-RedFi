import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPerfil } from "../services/perfilService";
import MainH2 from "../components/ui/MainH2";
import MainH3 from "../components/ui/MainH3";
import MainLinkButton from "../components/ui/MainLinkButton";

const Cuenta = () => {
  useEffect(() => {
    document.title = "Red-Fi | Mi Perfil";
  }, []);

  const { usuario } = useAuth();
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
    <div className="w-full">
      {/* Info básica del usuario */}
      <section className="max-w-7xl mx-auto text-center">
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
        <MainH2>{nombre}</MainH2>
        <p className="text-white/60 mb-4">{usuario.email}</p>
        <p className="text-sm text-white/40 mb-4">
          Usuario <span className="font-bold text-acento">Premium</span>
        </p>
      </section>

      {/* Acciones */}
      <section className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 sm:px-6">
        {/* Gestionar Boletas */}
        <div>
          <MainLinkButton to="/boletas" variant="card">
            <MainH3>Gestionar boletas</MainH3>
            <p>
              Visualize y administre sus boletas, reciba alertas antes del
              vencimiento y revise los aumentos mes a mes.
            </p>
          </MainLinkButton>
        </div>

        {/* Red-Fi Academy */}
        <div>
          <MainLinkButton to="/academy" variant="card">
            <MainH3>Red-Fi Academy</MainH3>
            <p>
              Accede a nuestros mini cursos sobre redes, Wi-Fi y cómo mejorar tu
              conexión.
            </p>
          </MainLinkButton>
        </div>

        {/* Ver Reseñas */}
        <div>
          <MainLinkButton to="/resenas" variant="card">
            <MainH3>Mis reseñas</MainH3>
            <p>
              Visualize y administre todas las reseñas que has publicado sobre
              diferentes proveedores.
            </p>
          </MainLinkButton>
        </div>

        {/* Editar Perfil */}
        <div>
          <MainLinkButton to="/editar-perfil" variant="card">
            <MainH3>Editar perfil</MainH3>
            <p>Cambie su foto, nombre y otros datos de su cuenta Red-Fi.</p>
          </MainLinkButton>
        </div>

        {/* Gestionar Plan */}
        <div>
          <MainLinkButton to="/planes" variant="card">
            <MainH3>Gestionar plan</MainH3>
            <p>Gestione su plan y descubra nuestros beneficios.</p>
          </MainLinkButton>
        </div>

        {/* Glosario de Redes */}
        <div>
          <MainLinkButton to="/glosario" variant="card">
            <MainH3>Glosario de redes</MainH3>
            <p>Buscá términos como IP, ping, latencia y más.</p>
          </MainLinkButton>
        </div>
      </section>
    </div>
  );
};

export default Cuenta;
