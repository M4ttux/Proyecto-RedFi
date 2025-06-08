import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerProveedorPorId } from "../services/proveedorService";
import { IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";

const VistaProveedor = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const fetchProveedor = async () => {
      const data = await obtenerProveedorPorId(id);
      setProveedor(data);
    };
    fetchProveedor();
  }, [id]);

  if (!proveedor) return <p className="text-center text-white mt-10">Cargando proveedor...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-texto">
      <h1 className="text-5xl lg:text-6xl font-bold mb-4">{proveedor.nombre}</h1>
      <p><strong>Tecnología:</strong> {proveedor.tecnologia}</p>
      <p><strong>Zona:</strong> {proveedor.zona_id}</p>
      <p className="mb-6">
        <strong>Color asignado:</strong>{" "}
        <span style={{ color: proveedor.color }}>{proveedor.color}</span>
      </p>

      {/* Reseñas */}
      <h2 className="text-3xl lg:text-4xl font-semibold mb-4">Reseñas</h2>
      {proveedor.reseñas && proveedor.reseñas.length > 0 ? (
        <div className="space-y-4">
          {proveedor.reseñas.map((r) => (
            <div
              key={r.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg"
            >
              <p className="italic mb-2">“{r.comentario}”</p>
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-300">— {r.user?.nombre || "Anónimo"}</span>
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < r.estrellas ? (
                      <IconCarambolaFilled size={14} key={i} />
                    ) : (
                      <IconCarambola size={14} key={i} />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Este proveedor aún no tiene reseñas.</p>
      )}
    </div>
  );
};

export default VistaProveedor;
