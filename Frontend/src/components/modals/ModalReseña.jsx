const ModalReseña = ({ reseña, onClose }) => {
  if (!reseña) return null;

  const estrellas =
    "★".repeat(reseña.estrellas) + "☆".repeat(5 - reseña.estrellas);

  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

  // Limpieza si viene como string tipo "Usuario {\"nombre\":\"Matías\"}"
  let nombre;
  try {
    if (nombreBruto.includes("{")) {
      const match = nombreBruto.match(/Usuario (.*)/);
      const json = match ? JSON.parse(match[1]) : null;
      nombre = json?.nombre || nombreBruto;
    } else {
      nombre = nombreBruto;
    }
  } catch {
    nombre = nombreBruto;
  }

  const proveedor =
    reseña.nombre_proveedor ||
    reseña.proveedores?.nombre ||
    reseña.proveedor?.nombre ||
    `Proveedor ID: ${reseña.proveedor_id}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center animate-fadeIn">
      <div className="bg-secundario p-6 rounded-xl max-w-md w-full relative shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-400 transition"
        >
          ✖
        </button>

        <p className="text-xs uppercase tracking-wide text-acento mb-3">
          Reseña destacada
        </p>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={`https://i.pravatar.cc/64?u=${reseña.usuario_id}`}
            className="w-12 h-12 rounded-full border-2 border-acento shadow-md"
            alt="Avatar del usuario"
          />
          <div>
            <p className="font-semibold text-white text-base">{nombre}</p>
            <p className="text-texto/60 text-sm">Proveedor: {proveedor}</p>
          </div>
        </div>

        <div className="text-yellow-400 text-lg mb-3 tracking-wide">
          {estrellas}
        </div>

        <p className="text-texto/90 italic bg-black/10 rounded-md px-4 py-3 text-sm leading-relaxed">
          “{reseña.comentario}”
        </p>
      </div>
    </div>
  );
};

export default ModalReseña;
