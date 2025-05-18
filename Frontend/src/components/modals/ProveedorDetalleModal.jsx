import { createPortal } from "react-dom";

const ProveedorDetalleModal = ({ proveedor, onClose }) => {
  if (!proveedor) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-secundario text-texto p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-texto hover:text-red-400 text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-acento mb-2">{proveedor.nombre}</h2>
        <p className="mb-4">Tecnología: <span className="font-medium">{proveedor.tecnologia}</span></p>
        <p className="text-sm text-gray-400">* Más información y reseñas se mostrarán pronto aquí.</p>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ProveedorDetalleModal;
