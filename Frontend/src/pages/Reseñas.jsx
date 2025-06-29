import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerReseñasUsuario, actualizarReseña, eliminarReseña } from "../services/reseñaService";
import { IconCarambolaFilled, IconCarambola, IconEdit, IconTrash, IconCalendar } from "@tabler/icons-react";
import ModalEditarReseña from "../components/modals/ModalEditarReseña";

const Reseñas = () => {
  const { usuario } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reseñaEditando, setReseñaEditando] = useState(null);

  useEffect(() => {
    document.title = "Red-Fi | Mis Reseñas";
  }, []);

  useEffect(() => {
    const cargarReseñas = async () => {
      if (usuario) {
        try {
          setError(null);
          const data = await obtenerReseñasUsuario();
          setReseñas(data);
        } catch (error) {
          console.error("Error al cargar reseñas:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    cargarReseñas();
  }, [usuario]);

  const handleEditarReseña = (reseña) => {
    setReseñaEditando(reseña);
    setIsModalOpen(true);
  };

  const handleGuardarReseña = async (formData) => {
    try {
      const reseñaActualizada = await actualizarReseña(reseñaEditando.id, formData);
      setReseñas(reseñas.map(r => r.id === reseñaEditando.id ? reseñaActualizada : r));
      setIsModalOpen(false);
      setReseñaEditando(null);
    } catch (error) {
      console.error("Error al actualizar reseña:", error);
      setError(error.message);
    }
  };

  const handleEliminarReseña = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      try {
        await eliminarReseña(id);
        setReseñas(reseñas.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error al eliminar reseña:", error);
        setError(error.message);
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderEstrellas = (estrellas) => {
  const estrellasLlenas = Math.round(estrellas);
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) =>
        i < estrellasLlenas ? (
          <IconCarambolaFilled key={i} size={16} />
        ) : (
          <IconCarambola key={i} size={16} />
        )
      )}
    </div>
  );
};


  if (!usuario) {
    return (
      <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto pt-16 text-center">
          <p className="text-texto text-lg">No has iniciado sesión.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto pt-16 text-center">
          <p className="text-texto text-lg">Cargando tus reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
      <div className="max-w-7xl mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
            Mis Reseñas
          </h1>
          <p className="text-white/70 text-lg">
            Administrá todas las reseñas que has publicado
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-center mb-6">
            {error}
          </div>
        )}

        {/* Contenido */}
        {reseñas.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold text-texto mb-2">
                No tienes reseñas publicadas
              </h3>
              <p className="text-white/70 mb-4">
                Comienza compartiendo tu experiencia con diferentes proveedores de internet
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden lg:block">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-texto uppercase tracking-wider">
                        Proveedor
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-texto uppercase tracking-wider">
                        Calificación
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-texto uppercase tracking-wider">
                        Comentario
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-texto uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-texto uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {reseñas.map((reseña) => (
                      <tr key={reseña.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-texto">
                              {reseña.proveedores?.nombre || 'Proveedor no disponible'}
                            </div>
                            {reseña.proveedores?.tecnologia && (
                              <div className="text-sm text-white/60">
                                {reseña.proveedores.tecnologia}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderEstrellas(reseña.estrellas)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-texto max-w-xs truncate">
                            {reseña.comentario}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-white/60">
                            <IconCalendar size={16} className="mr-2" />
                            {formatearFecha(reseña.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarReseña(reseña)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded-lg transition"
                              title="Editar reseña"
                            >
                              <IconEdit size={24} />
                            </button>
                            <button
                              onClick={() => handleEliminarReseña(reseña.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition"
                              title="Eliminar reseña"
                            >
                              <IconTrash size={24} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="lg:hidden space-y-4">
              {reseñas.map((reseña) => (
                <div
                  key={reseña.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-texto">
                        {reseña.proveedores?.nombre || 'Proveedor no disponible'}
                      </h3>
                      {reseña.proveedores?.tecnologia && (
                        <p className="text-sm text-white/60">
                          {reseña.proveedores.tecnologia}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditarReseña(reseña)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded-lg transition"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleEliminarReseña(reseña.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderEstrellas(reseña.estrellas)}
                  </div>

                  <p className="text-sm text-texto mb-3 line-clamp-3">
                    {reseña.comentario}
                  </p>

                  <div className="flex items-center text-xs text-white/60">
                    <IconCalendar size={14} className="mr-1" />
                    {formatearFecha(reseña.created_at)}
                  </div>
                </div>
              ))}
            </div>

            {/* Estadísticas */}
            <div className="mt-8 text-center">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-bold text-texto mb-2">
                  Estadísticas de tus reseñas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-2xl font-bold text-acento">
                      {reseñas.length}
                    </div>
                    <div className="text-sm text-white/60">
                      Total de reseñas
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-acento">
                      {(reseñas.reduce((acc, r) => acc + r.estrellas, 0) / reseñas.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-white/60">
                      Calificación promedio
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-acento">
                      {new Set(reseñas.map(r => r.proveedor_id)).size}
                    </div>
                    <div className="text-sm text-white/60">
                      Proveedores evaluados
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <ModalEditarReseña
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReseñaEditando(null);
        }}
        reseña={reseñaEditando}
        onSave={handleGuardarReseña}
      />
    </div>
  );
};

export default Reseñas;
