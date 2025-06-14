import { useState, useEffect } from "react";
import { IconX, IconStar } from "@tabler/icons-react";
import { obtenerProveedores } from "../../services/proveedorService";

const ModalEditarReseña = ({ isOpen, onClose, reseña, onSave }) => {
  const [formData, setFormData] = useState({
    comentario: "",
    estrellas: 0,
    proveedor_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const cargarProveedores = async () => {
      if (isOpen) {
        try {
          const data = await obtenerProveedores();
          setProveedores(data);
        } catch (error) {
          console.error("Error al cargar proveedores:", error);
        }
      }
    };

    cargarProveedores();
  }, [isOpen]);

  useEffect(() => {
    if (reseña) {
      setFormData({
        comentario: reseña.comentario || "",
        estrellas: reseña.estrellas || 0,
        proveedor_id: reseña.proveedor_id || "",
      });
    }
  }, [reseña]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (rating) => {
    setFormData({
      ...formData,
      estrellas: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-fondo border border-white/20 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-texto">Editar Reseña</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-texto transition"
            disabled={loading}
          >
            <IconX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Proveedor *
              </label>
              <select
                name="proveedor_id"
                value={formData.proveedor_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-texto focus:outline-none focus:border-acento"
                disabled={loading}
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id} className="bg-fondo">
                    {proveedor.nombre}
                    {proveedor.tecnologia && ` (${proveedor.tecnologia})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Calificación *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="text-2xl transition-colors"
                    disabled={loading}
                  >
                    <IconStar
                      className={
                        star <= formData.estrellas
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-400"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Comentario *
              </label>
              <textarea
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento resize-none"
                placeholder="Escribe tu experiencia con este proveedor..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white/10 text-texto rounded-lg hover:bg-white/20 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primario text-white rounded-lg hover:bg-acento transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarReseña;
