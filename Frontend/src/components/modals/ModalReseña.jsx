const ModalReseña = ({ reseña, onClose }) => {
  if (!reseña) return null;

  const estrellas =
    "★".repeat(reseña.estrellas) + "P".repeat(5 - reseña.estrellas);
  const nombre = reseña.user_profiles?.nombre || "Usuario anónimo";
  const proveedor = reseña.proveedores?.nombre || "Proveedor desconocido";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-secundario p-6 rounded-lg max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg"
        >
          ✖
        </button>
        <p className="text-xs uppercase tracking-wide text-acento mb-2">
          Reseña destacada
        </p>
        <div className="flex items-center gap-2 mb-2">
          <img
            src={`https://i.pravatar.cc/40?u=${reseña.usuario_id}`}
            className="w-8 h-8 rounded-full border border-white/20"
          />
          <div>
            <p className="font-bold">{nombre}</p>
            <p className="text-texto/60 text-xs">Proveedor: {proveedor}</p>
          </div>
        </div>
        <div className="text-yellow-400 text-sm mb-2">{estrellas}</div>
        <p className="text-texto/80 italic leading-snug">
          “{reseña.comentario}”
        </p>
      </div>
    </div>
  );
};

export default ModalReseña;
