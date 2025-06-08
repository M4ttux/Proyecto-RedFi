import { IconEye, IconTrash, IconEdit } from "@tabler/icons-react";

const ModalVerBoleta = ({ boleta, onClose, onEditar, onEliminar, onDescargar }) => {
  if (!boleta) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative transition transform duration-300 ease-out scale-95 animate-fadeIn">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-3xl font-bold hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center">Detalle de Boleta</h2>

        {/* Contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Info a la izquierda, desplazado hacia abajo */}
          <div className="space-y-3 ml-10 mb-2 text-xl">
            <p><strong>Mes:</strong> {boleta.mes}</p>
            <p><strong>Año:</strong> {boleta.anio}</p>
            <p><strong>Monto:</strong> ${parseFloat(boleta.monto).toFixed(2)}</p>
            <p><strong>Proveedor:</strong> {boleta.proveedor}</p>
            <p><strong>Vencimiento:</strong> {new Date(boleta.vencimiento).toLocaleDateString("es-AR", {
              day: "2-digit", month: "long", year: "numeric"
            })}</p>
          </div>

          {/* Imagen a la derecha */}
          <div className="flex justify-center">
            <img
              src={boleta.url_imagen}
              alt="Boleta"
              className="max-h-[300px] object-contain rounded border"
            />
          </div>
        </div>

        {/* Botones centrados */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <a href={boleta.url_imagen} target="_blank" rel="noopener noreferrer" title="Ver">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              <IconEye size={20} /> Ver
            </button>
          </a>
          <button
            onClick={() => onEditar(boleta)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded"
          >
            <IconEdit size={20} /> Editar
          </button>
          <button
            onClick={() => onEliminar(boleta)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            <IconTrash size={20} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerBoleta;
