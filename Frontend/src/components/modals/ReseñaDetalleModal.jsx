import { createPortal } from "react-dom";

const ReseñaDetalleModal = ({ reseña, onClose }) => {
  if (!reseña) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-secundario text-texto p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-texto hover:text-red-400 text-xl"
        >
          ×
        </button>
        <h2 className="text-lg font-bold text-acento mb-1">{reseña.usuario}</h2>
        <p className="text-yellow-400 text-lg">
          {"★".repeat(reseña.estrellas)}
          {"☆".repeat(5 - reseña.estrellas)}
        </p>
        <p className="mt-4">{reseña.comentario}</p>

        <div className="mt-6 flex gap-4 justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-texto px-4 py-2 rounded">
            👍 Me sirvió
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-texto px-4 py-2 rounded">
            👎 No me sirvió
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ReseñaDetalleModal;
