
import { IconX, IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import MainH2 from "../ui/MainH2";
const ModalProveedor = ({ proveedor, onClose, navigate }) => {
  if (!proveedor) return null;

  // Datos simulados por ahora
  const cantidadResenas = 20;
  const promedioEstrellas = 4.3;
  const descripcionPlaceholder =
    "Proveedor destacado en la región, reconocido por su estabilidad y atención al cliente.";

  const tecnologias = Array.isArray(proveedor.tecnologia)
    ? proveedor.tecnologia
    : [proveedor.tecnologia];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center animate-fadeIn">
      <div className="bg-secundario text-white p-6 rounded-2xl w-full max-w-sm shadow-2xl relative border border-white/10">
        {/* Botón cerrar */}
        <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/60 hover:text-red-400 transition"
            title="Cerrar"
          >
            <IconX size={24} />
          </button>

        {/* Imagen/ícono del proveedor */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl">
            🏢
          </div>
        </div>

        {/* Nombre del proveedor */}
        <MainH2 className="text-center">{proveedor.nombre}</MainH2>

        {/* Estrellas */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex gap-1 text-yellow-400 text-2xl">
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.round(promedioEstrellas) ? (
                <IconCarambolaFilled key={i} size={22} />
              ) : (
                <IconCarambola key={i} size={22} />
              )
            )}
          </div>
          <span className="mt-1 text-sm text-texto/80">
            {promedioEstrellas.toFixed(1)} – {cantidadResenas} reseñas
          </span>
        </div>

        {/* Tecnologías */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tecnologias.map((tec, index) => (
            <span
              key={index}
              className="bg-white/10 border border-white/20 text-xs px-3 py-1 rounded-full"
            >
              {tec}
            </span>
          ))}
        </div>

        {/* Descripción */}
        <p className="text-sm text-texto/80 text-center mb-6 px-2">
          {descripcionPlaceholder}
        </p>

        {/* Botón "Más información" */}
        <button
          onClick={() => {
            onClose();
            navigate(`/proveedores/${proveedor.id}`);
          }}
          className="w-full bg-primario hover:bg-acento transition text-white py-2 px-4 rounded-lg font-medium"
        >
          Más información
        </button>
      </div>
    </div>
  );
};

export default ModalProveedor;
