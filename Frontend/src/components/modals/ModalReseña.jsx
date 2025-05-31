const ModalReseña = ({ reseña, onClose }) => {
  if (!reseña) return null;

  // 🔍 Debug completo
  console.log("📊 Reseña recibida en modal:", reseña);

  const estrellas = "★".repeat(reseña.estrellas) + "☆".repeat(5 - reseña.estrellas);
  
  // 🔧 Acceso más robusto a los datos
  const nombre = 
    reseña.user_profiles?.nombre || 
    reseña.usuarios?.nombre || 
    reseña.usuario?.nombre ||
    reseña.nombre_usuario ||
    `Usuario ${reseña.usuario_id}`;

  const proveedor = 
    reseña.proveedores?.nombre || 
    reseña.proveedor?.nombre ||
    reseña.nombre_proveedor ||
    `Proveedor ID: ${reseña.proveedor_id}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-secundario p-6 rounded-lg max-w-md w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg hover:text-acento transition-colors"
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
            alt="Avatar del usuario"
          />
          <div>
            <p className="font-bold text-white">{nombre}</p>
            <p className="text-texto/60 text-xs">Proveedor: {proveedor}</p>
          </div>
        </div>
        
        <div className="text-yellow-400 text-sm mb-2">{estrellas}</div>
        
        <p className="text-texto/80 italic leading-snug">
          "{reseña.comentario}"
        </p>

      </div>
    </div>
  );
};

export default ModalReseña;
