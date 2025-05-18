import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPerfil } from "../services/userService";

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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-secundario text-texto rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-acento">Mi cuenta</h2>
      <p>
        <strong>Email:</strong> {usuario.email}
      </p>
      <p>
        <strong>Nombre:</strong> {perfil?.nombre || "Sin nombre definido"}
      </p>

      <button
        onClick={logout}
        className="mt-6 bg-primario text-texto px-4 py-2 rounded hover:bg-acento"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Cuenta;
